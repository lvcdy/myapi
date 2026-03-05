import { handleHealth } from '../handlers/healthHandler.js'
import { handleUptime } from '../handlers/uptimeHandler.js'
import { handleFavicon } from '../handlers/faviconHandler.js'
import { handleFaviconSvg, handleFaviconIco, handleAppleTouchIcon } from '../handlers/projectFaviconHandler.js'
import { handleHitokoto, handleHitokotoTypes } from '../handlers/hitokotoHandler.js'
import { handleStats } from '../handlers/statsHandler.js'
import { getHomepageHtml } from '../views/homepage.js'

export const routes = [
    { method: 'GET', path: '/', handler: (c) => c.html(getHomepageHtml()), description: '主页' },
    { method: 'GET', path: '/favicon.svg', handler: handleFaviconSvg, description: 'Favicon SVG' },
    { method: 'GET', path: '/favicon.ico', handler: handleFaviconIco, description: 'Favicon ICO' },
    { method: 'GET', path: '/apple-touch-icon.png', handler: handleAppleTouchIcon, description: 'Apple Icon' },
    { method: 'GET', path: '/health', handler: handleHealth, description: '健康检查' },
    { method: 'GET', path: '/stats', handler: handleStats, description: '统计（需认证）' },
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

    // 全局错误处理 — 仅暴露安全信息，内部细节写日志
    app.onError((err, c) => {
        console.error('❌ 应用错误:', err.stack || err.message)
        // 超时错误保持 504
        const status = err.status || 500
        return c.json({
            error: status === 504 ? 'Gateway Timeout' : 'Internal Server Error'
        }, status)
    })
}
