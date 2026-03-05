import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'
import { secureHeaders } from 'hono/secure-headers'
import { requestId } from 'hono/request-id'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { etag } from 'hono/etag'
import { timeout } from 'hono/timeout'
import { createLogger } from './middleware/logger.js'
import { createRequestCounter } from './middleware/requestCounter.js'
import { createRateLimiter } from './middleware/rateLimiter.js'
import { registerRoutes } from './routes/index.js'
import { CORS_CONFIG } from './constants/index.js'
import { config } from './config.js'

export const createApp = () => {
    const app = new Hono()

    // 安全 & 协议中间件
    app.use(secureHeaders())
    app.use(cors(CORS_CONFIG))

    // 请求处理中间件
    app.use(requestId())                         // Hono 内置 requestId（含输入校验）
    app.use(trimTrailingSlash())                  // /health/ → 301 → /health
    app.use(compress())
    app.use(etag({ weak: true }))                // Weak ETag，支持 304 Not Modified
    app.use(timeout(config.TIMEOUT))             // 请求级超时保护

    // 全局限流: 每 IP 每分钟 120 次
    app.use(createRateLimiter({ windowMs: 60_000, max: 120 }))

    // 代理端点严格限流（防止滥用）
    app.use('/favicon', createRateLimiter({ windowMs: 60_000, max: 100 }))
    app.use('/uptime', createRateLimiter({ windowMs: 60_000, max: 200 }))

    // 业务中间件
    app.use(createRequestCounter())
    app.use(createLogger())

    registerRoutes(app)
    return app
}
