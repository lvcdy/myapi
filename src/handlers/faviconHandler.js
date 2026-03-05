/**
 * 网站图标获取处理器 - 本地抓取模式
 */

import axios from 'axios'
import { isValidUrl, isPrivateUrl } from '../utils/validators.js'
import { createHttpConfig, createImageHttpConfig, getMimeTypeFromUrl, isImageResponse } from '../utils/httpClient.js'
import { config } from '../config.js'
import { RESPONSE_MESSAGES } from '../constants/index.js'

// 负面缓存：缓存获取失败的 URL，避免重复请求
const failedCache = new Map()
const FAILED_CACHE_TTL = 10 * 60 * 1000 // 10 分钟
const MAX_FAILED_CACHE_SIZE = 1000

function isFailedCached(url) {
    const entry = failedCache.get(url)
    if (!entry) return false
    if (Date.now() - entry > FAILED_CACHE_TTL) {
        failedCache.delete(url)
        return false
    }
    return true
}

function cacheFailedUrl(url) {
    // 防止缓存无限增长
    if (failedCache.size >= MAX_FAILED_CACHE_SIZE) {
        const oldest = failedCache.keys().next().value
        failedCache.delete(oldest)
    }
    failedCache.set(url, Date.now())
}

/**
 * 从 HTML 中提取 favicon URL
 * @param {string} html - HTML 内容
 * @param {string} baseUrl - 基础 URL
 * @returns {string|null} favicon URL
 */
function extractFaviconFromHtml(html, baseUrl) {
    const base = new URL(baseUrl)

    // 匹配各种 favicon 声明方式
    const patterns = [
        /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
        /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
        /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']+)["']/i,
        /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon(?:-precomposed)?["']/i,
    ]

    for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
            try {
                return new URL(match[1], baseUrl).href
            } catch {
                continue
            }
        }
    }

    return null
}

/**
 * 下载并返回图片
 * @param {string} url - 图片 URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<{data: Buffer, contentType: string}|null>}
 */
async function downloadImage(url, timeout) {
    try {
        const response = await axios.get(url, createImageHttpConfig({ timeout }))

        if (!isImageResponse(response)) {
            return null
        }

        const contentType = response.headers['content-type'] || getMimeTypeFromUrl(url)
        return {
            data: Buffer.from(response.data),
            contentType
        }
    } catch {
        return null
    }
}

/**
 * 处理网站图标获取请求
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export async function handleFavicon(c) {
    const url = c.req.query('url')

    if (!url) {
        return c.json({ error: RESPONSE_MESSAGES.URL_REQUIRED }, 400)
    }

    if (!isValidUrl(url)) {
        return c.json({ error: RESPONSE_MESSAGES.INVALID_URL }, 400)
    }

    if (isPrivateUrl(url)) {
        return c.json({ error: 'private/internal addresses are not allowed' }, 403)
    }

    // 检查负面缓存
    if (isFailedCached(url)) {
        return c.json({ error: 'favicon not found (cached)' }, 404)
    }

    try {
        const base = new URL(url)
        const timeout = config.TIMEOUT

        // 策略 1: 从 HTML 页面解析 favicon 链接
        try {
            const htmlResponse = await axios.get(url, createHttpConfig({
                timeout,
                headers: { 'Accept': 'text/html,*/*' }
            }))

            const faviconUrl = extractFaviconFromHtml(htmlResponse.data, url)
            if (faviconUrl) {
                const image = await downloadImage(faviconUrl, timeout)
                if (image) {
                    return c.body(image.data, 200, {
                        'Content-Type': image.contentType,
                        'Cache-Control': 'public, max-age=86400'
                    })
                }
            }
        } catch {
            // HTML 解析失败，继续尝试其他策略
        }

        // 策略 2: 尝试默认的 /favicon.ico 路径
        const defaultFaviconUrl = `${base.origin}/favicon.ico`
        const image = await downloadImage(defaultFaviconUrl, timeout)
        if (image) {
            return c.body(image.data, 200, {
                'Content-Type': image.contentType,
                'Cache-Control': 'public, max-age=86400'
            })
        }

        cacheFailedUrl(url)
        return c.json({ error: 'favicon not found' }, 404)
    } catch (err) {
        cacheFailedUrl(url)
        return c.json({ error: 'failed to fetch favicon', message: err.message }, 500)
    }
}
