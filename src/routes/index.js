import { handleHealth } from '../handlers/healthHandler.js'
import { handleUptime } from '../handlers/uptimeHandler.js'
import { handleFavicon } from '../handlers/faviconHandler.js'
import { handleFaviconSvg, handleFaviconIco, handleAppleTouchIcon } from '../handlers/projectFaviconHandler.js'
import { handleHitokoto, handleHitokotoTypes } from '../handlers/hitokotoHandler.js'
import { handleStats } from '../handlers/statsHandler.js'
import { getHomepageHtml } from '../views/homepage.js'

const HOMEPAGE_EXCLUDED_PATHS = new Set(['/'])
const HOMEPAGE_HIDDEN_STATIC_PATHS = new Set(['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png'])
const HOMEPAGE_TRACKED_PATHS = ['/uptime', '/favicon', '/hitokoto']

export const routes = [
    { method: 'GET', path: '/', handler: (c) => c.html(getHomepageHtml(getHomepageMetadata())), description: '主页' },
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

function getHomepageMetadata() {
    const apiRoutes = routes
        .filter((route) => !HOMEPAGE_EXCLUDED_PATHS.has(route.path) && !HOMEPAGE_HIDDEN_STATIC_PATHS.has(route.path))
        .map(({ method, path, description }) => ({ method, path, description }))

    return {
        apiRoutes,
        trackedPaths: HOMEPAGE_TRACKED_PATHS
    }
}

function registerRoute(app, route) {
    const method = route.method.toLowerCase()
    if (typeof app[method] === 'function') {
        app[method](route.path, route.handler)
    }
}

function createNotFoundHandler() {
    return (c) => c.json({ error: 'Not Found' }, 404)
}

function createErrorHandler() {
    return (err, c) => {
        console.error('❌ 应用错误:', err.stack || err.message)
        const status = err.status || 500
        return c.json({
            error: status === 504 ? 'Gateway Timeout' : 'Internal Server Error'
        }, status)
    }
}

/**
 * 注册所有路由
 * @param {Hono} app - Hono 应用实例
 */
export function registerRoutes(app) {
    routes.forEach((route) => registerRoute(app, route))
    app.notFound(createNotFoundHandler())
    app.onError(createErrorHandler())
}
