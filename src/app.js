/**
 * 应用主模块 - 路由和中间件配置
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handleUptime } from './handlers/uptimeHandler.js'
import { handleFavicon } from './handlers/faviconHandler.js'
import { getHomepageHtml } from './views/homepage.js'

export function createApp() {
    const app = new Hono()

    // 中间件：CORS
    app.use(cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'OPTIONS'],
        allowHeaders: ['Content-Type']
    }))

    // 路由：主页
    app.get('/', (c) => c.html(getHomepageHtml()))

    // 路由：网站可用性检测
    app.get('/uptime', handleUptime)

    // 路由：网站图标获取
    app.get('/favicon', handleFavicon)

    return app
}
