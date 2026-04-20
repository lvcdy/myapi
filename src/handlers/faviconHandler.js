/**
 * 网站图标获取处理器 - 本地抓取模式
 */

import axios from "axios";
import {
  createHttpConfig,
  createImageHttpConfig,
  getMimeTypeFromUrl,
  isImageResponse,
} from "../utils/httpClient.js";
import { validatePublicUrlParam } from "../utils/requestValidation.js";
import { config } from "../config.js";

const FALLBACK_FAVICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect width="16" height="16" rx="3" fill="#e2e8f0"/><text x="8" y="12" text-anchor="middle" font-size="11" fill="#94a3b8">?</text></svg>';

// ── 缓存配置 ──
const FAILED_CACHE_TTL = 5 * 60 * 1000; // 负面缓存 5 分钟
const SUCCESS_CACHE_TTL = 60 * 60 * 1000; // 成功缓存 1 小时
const MAX_CACHE_SIZE = 1000;
const MAX_HTML_LENGTH = 512 * 1024; // HTML 最大 512KB

function createBoundedTtlCache(ttl, maxSize) {
  const cache = new Map();

  return {
    get(key) {
      const entry = cache.get(key);
      if (!entry) return null;
      if (Date.now() - entry.time > ttl) {
        cache.delete(key);
        return null;
      }
      return entry.value;
    },
    set(key, value) {
      if (cache.size >= maxSize) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
      }
      cache.set(key, { value, time: Date.now() });
    },
  };
}

// 负面缓存：避免反复请求已知失败的 URL
const failedCache = createBoundedTtlCache(FAILED_CACHE_TTL, MAX_CACHE_SIZE);
// 成功缓存：避免反复抓取已拿到图标的 URL
const successCache = createBoundedTtlCache(SUCCESS_CACHE_TTL, MAX_CACHE_SIZE);

function isFailedCached(url) {
  return failedCache.get(url) === true;
}

function cacheFailedUrl(url) {
  failedCache.set(url, true);
}

function getSuccessCached(url) {
  return successCache.get(url);
}

function cacheSuccessUrl(url, data, contentType) {
  successCache.set(url, { data, contentType });
}

function respondFallbackIcon(c, reason = "fallback") {
  return c.body(FALLBACK_FAVICON, 200, {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": "public, max-age=300",
    "X-Favicon-Fallback": reason,
  });
}

function isStrictApiMode(c) {
  const strict = c.req.query("strict");
  if (!strict) return false;
  return ["1", "true", "yes", "on"].includes(strict.toLowerCase());
}

function respondFaviconFailure(c, strictMode, reason = "not-found") {
  if (strictMode) {
    return c.json({ error: "favicon not found", reason }, 404);
  }
  return respondFallbackIcon(c, reason);
}

/**
 * 从 HTML 中提取 favicon URL
 */
function extractFaviconFromHtml(html, baseUrl) {
  const patterns = [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon(?:-precomposed)?["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try {
        return new URL(match[1], baseUrl).href;
      } catch {
        continue;
      }
    }
  }

  return null;
}

/**
 * 下载并返回图片，使用 AbortSignal 确保可取消
 */
async function downloadImage(url, timeout, signal) {
  try {
    const response = await axios.get(
      url,
      createImageHttpConfig({
        timeout,
        signal,
        maxContentLength: 2 * 1024 * 1024, // 图片最大 2MB
      })
    );

    if (response.status >= 400 || !isImageResponse(response)) {
      return null;
    }

    const contentType =
      response.headers["content-type"] || getMimeTypeFromUrl(url);
    return {
      data: Buffer.from(response.data),
      contentType,
    };
  } catch {
    return null;
  }
}

/**
 * 处理网站图标获取请求
 */
export async function handleFavicon(c) {
  const { url, response } = validatePublicUrlParam(c);
  if (response) {
    return response;
  }
  const strictMode = isStrictApiMode(c);

  // 命中成功缓存 → 直接返回
  const cached = getSuccessCached(url);
  if (cached) {
    return c.body(cached.data, 200, {
      "Content-Type": cached.contentType,
      "Cache-Control": "public, max-age=86400",
    });
  }

  // 命中负面缓存 → 快速失败
  if (isFailedCached(url)) {
    return respondFaviconFailure(c, strictMode, "cached-miss");
  }

  // 创建 AbortController，确保 handler 结束时取消所有未完成的外发请求
  const controller = new AbortController();
  const { signal } = controller;

  // 为 favicon 抓取设置更严格的内部预算，避免触发全局 timeout 中间件
  const deadlineMs = Math.max(1200, Math.min(config.TIMEOUT - 500, 5000));
  const stepTimeout = Math.max(800, Math.min(Math.floor(deadlineMs / 2), 2500));
  const deadlineTimer = setTimeout(() => controller.abort(), deadlineMs);

  try {
    const base = new URL(url);

    // 策略 1: 从 HTML 页面解析 favicon 链接
    try {
      const htmlResponse = await axios.get(
        url,
        createHttpConfig({
          timeout: stepTimeout,
          signal,
          maxContentLength: MAX_HTML_LENGTH,
          headers: { Accept: "text/html,*/*" },
        })
      );

      if (htmlResponse.status < 400 && typeof htmlResponse.data === "string") {
        const faviconUrl = extractFaviconFromHtml(htmlResponse.data, url);
        if (faviconUrl) {
          const image = await downloadImage(faviconUrl, stepTimeout, signal);
          if (image) {
            cacheSuccessUrl(url, image.data, image.contentType);
            return c.body(image.data, 200, {
              "Content-Type": image.contentType,
              "Cache-Control": "public, max-age=86400",
            });
          }
        }
      }
    } catch {
      // HTML 解析失败，继续尝试其他策略
    }

    // 策略 2: 尝试默认的 /favicon.ico 路径
    const defaultFaviconUrl = `${base.origin}/favicon.ico`;
    const image = await downloadImage(defaultFaviconUrl, stepTimeout, signal);
    if (image) {
      cacheSuccessUrl(url, image.data, image.contentType);
      return c.body(image.data, 200, {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=86400",
      });
    }

    cacheFailedUrl(url);
    return respondFaviconFailure(c, strictMode, "not-found");
  } catch {
    cacheFailedUrl(url);
    return respondFaviconFailure(c, strictMode, "fetch-failed");
  } finally {
    // 无论成功/失败/超时，立即取消所有未完成的外发请求
    clearTimeout(deadlineTimer);
    controller.abort();
  }
}
