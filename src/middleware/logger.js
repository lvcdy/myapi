/**
 * 日志中间件
 */

/**
 * 创建请求日志中间件
 * @returns {Function} 中间件函数
 */
export function createLogger() {
    return async (c, next) => {
        const start = Date.now()
        const method = c.req.method
        const path = c.req.path
        const query = c.req.query('url') ? `?url=${encodeURIComponent(c.req.query('url'))}` : ''

        try {
            await next()
            const duration = Date.now() - start
            const status = c.res.status
            console.log(`[${new Date().toISOString()}] ${method} ${path}${query} ${status} ${duration}ms`)
        } catch (err) {
            const duration = Date.now() - start
            console.error(`[${new Date().toISOString()}] ${method} ${path}${query} ERROR ${duration}ms`, err.message)
            throw err
        }
    }
}
