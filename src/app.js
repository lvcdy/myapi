/**
 * 应用主模块 - Hono 应用工厂
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createLogger } from './middleware/logger.js'
import { createRequestCounter } from './middleware/requestCounter.js'
import { registerRoutes } from './routes/index.js'
import { CORS_CONFIG } from './constants/index.js'

export function createApp() {
    const app = new Hono()

    // 注册所有中间件
    app.use(createRequestCounter())
    app.use(createLogger())
    app.use(cors(CORS_CONFIG))

    // 注册所有路由
    registerRoutes(app)

    return app
}
