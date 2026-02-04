/**
 * 应用主模块 - 路由和中间件配置
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createLogger } from './middleware/logger.js'
import { handleUptime } from './handlers/uptimeHandler.js'
import { handleFavicon } from './handlers/faviconHandler.js'
import { handleHealth } from './handlers/healthHandler.js'
import { getHomepageHtml } from './views/homepage.js'

export function createApp() {
    const app = new Hono()

    // 中间件：请求日志
    app.use(createLogger())

    // 中间件：CORS
    app.use(cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'OPTIONS'],
        allowHeaders: ['Content-Type']
    }))

    // 路由：主页
    app.get('/', (c) => c.html(getHomepageHtml()))

    // 路由：健康检查
    app.get('/health', handleHealth)

    // 路由：网站可用性检测
    app.get('/uptime', handleUptime)

    // 路由：网站图标获取
    app.get('/favicon', handleFavicon)

    // 404 处理
    app.notFound((c) => {
        return c.json({ error: 'Not Found' }, 404)
    })

    // 错误处理
    app.onError((err, c) => {
        console.error('❌ 应用错误:', err.message)
        return c.json({
            error: 'Internal Server Error',
            message: err.message
        }, 500)
    })

    return app
}
