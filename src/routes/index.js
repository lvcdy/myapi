import { handleHealth } from '../handlers/healthHandler.js'
import { handleUptime } from '../handlers/uptimeHandler.js'
import { handleFavicon } from '../handlers/faviconHandler.js'
import { handleFaviconSvg, handleFaviconIco, handleAppleTouchIcon } from '../handlers/projectFaviconHandler.js'
import { handleHitokoto, handleHitokotoTypes } from '../handlers/hitokotoHandler.js'
import { getHomepageHtml } from '../views/homepage.js'
import { getRequestStats } from '../middleware/requestCounter.js'

export const routes = [
    { method: 'GET', path: '/', handler: (c) => c.html(getHomepageHtml()), description: '主页' },
    { method: 'GET', path: '/favicon.svg', handler: handleFaviconSvg, description: 'Favicon SVG' },
    { method: 'GET', path: '/favicon.ico', handler: handleFaviconIco, description: 'Favicon ICO' },
    { method: 'GET', path: '/apple-touch-icon.png', handler: handleAppleTouchIcon, description: 'Apple Icon' },
    { method: 'GET', path: '/health', handler: handleHealth, description: '健康检查' },
    { method: 'GET', path: '/stats', handler: (c) => c.json(getRequestStats()), description: '统计' },
    { method: 'GET', path: '/uptime', handler: handleUptime, description: '可用性检测' },
    { method: 'GET', path: '/favicon', handler: handleFavicon, description: '网站图标' },
    { method: 'GET', path: '/hitokoto', handler: handleHitokoto, description: '一言' },
    { method: 'GET', path: '/hitokoto/types', handler: handleHitokotoTypes, description: '一言类型' }
]

/**
 * 注册所有路由
 * @param {Hono} app - Hono 应用实例
 */
export function registerRoutes(app) {
    routes.forEach(route => {
        const method = route.method.toLowerCase()
        if (typeof app[method] === 'function') {
            app[method](route.path, route.handler)
        }
    })

    // 404 处理
    app.notFound((c) => {
        return c.json({ error: 'Not Found' }, 404)
    })

    // 全局错误处理
    app.onError((err, c) => {
        console.error('❌ 应用错误:', err.message)
        return c.json({
            error: 'Internal Server Error',
            message: err.message,
            timestamp: new Date().toISOString()
        }, 500)
    })
}

/**
 * 获取路由列表（用于文档或调试）
 * @returns {Array} 路由列表
 */
export function getRoutesList() {
    return routes.map(r => ({
        method: r.method,
        path: r.path,
        description: r.description
    }))
}
