import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";
import { requestId } from "hono/request-id";
import { trimTrailingSlash } from "hono/trailing-slash";
import { etag } from "hono/etag";
import { timeout } from "hono/timeout";
import { createLogger } from "./middleware/logger.js";
import { createRequestCounter } from "./middleware/requestCounter.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";
import { registerRoutes } from "./routes/index.js";
import { config } from "./config.js";
import {
  loggerConfig,
  rateLimiterConfig,
  requestCounterConfig,
  requestIdConfig,
  compressConfig,
  etagConfig,
  timeoutConfig,
  secureHeadersConfig,
  corsConfig,
  trimTrailingSlashConfig,
} from "./middleware/config.js";

export const createApp = () => {
  const app = new Hono();

  // 安全 & 协议中间件
  if (secureHeadersConfig.enable) {
    app.use(secureHeaders());
  }
  if (corsConfig.enable) {
    app.use(cors(corsConfig.options));
  }

  // 允许内联脚本执行的CSP头
  app.use((c, next) => {
    c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:");
    return next();
  });

  // 请求处理中间件
  if (requestIdConfig.enable) {
    app.use(requestId()); // Hono 内置 requestId（含输入校验）
  }
  if (trimTrailingSlashConfig.enable) {
    app.use(trimTrailingSlash()); // /health/ → 301 → /health
  }
  if (compressConfig.enable) {
    app.use(compress());
  }
  if (etagConfig.enable) {
    app.use(etag({ weak: etagConfig.weak })); // Weak ETag，支持 304 Not Modified
  }
  if (timeoutConfig.enable) {
    app.use(timeout(timeoutConfig.timeout)); // 请求级超时保护
  }

  // 全局限流: 每 IP 每分钟 300 次
  if (rateLimiterConfig.global) {
    app.use(createRateLimiter(rateLimiterConfig.global));
  }

  // 代理端点严格限流（防止滥用）
  // 限流时返回默认占位图标，避免浏览器因收到 JSON 而无法显示图标
  const FALLBACK_FAVICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect width="16" height="16" rx="3" fill="#e2e8f0"/><text x="8" y="12" text-anchor="middle" font-size="11" fill="#94a3b8">?</text></svg>';
  if (rateLimiterConfig.favicon) {
    app.use(
      "/favicon",
      createRateLimiter({
        ...rateLimiterConfig.favicon,
        onRateLimited: (c) =>
          c.body(FALLBACK_FAVICON, 429, {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "no-cache",
          }),
      })
    );
  }
  if (rateLimiterConfig.uptime) {
    app.use("/uptime", createRateLimiter(rateLimiterConfig.uptime));
  }

  // 业务中间件
  if (requestCounterConfig.enable) {
    app.use(createRequestCounter());
  }
  if (loggerConfig.enable) {
    app.use(createLogger());
  }

  registerRoutes(app);
  return app;
};
