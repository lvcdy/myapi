/**
 * 日志中间件 - 轻量级版本
 */

/**
 * 创建请求日志中间件
 * @returns {Function} 中间件函数
 */
export function createLogger() {
    const isDev = process.env.NODE_ENV !== 'production'

    return async (c, next) => {
        const start = Date.now()
        await next()
        const duration = Date.now() - start

        if (isDev) {
            // 开发环境：记录所有请求
            const status = c.res.status
            const level = status >= 400 ? '❌' : 'ℹ️'
            console.log(`${level} ${c.req.method} ${c.req.path} [${status}] ${duration}ms`)
        } else if (c.res.status >= 400) {
            // 生产环境：仅记录错误请求
            console.error(`${c.req.method} ${c.req.path} [${c.res.status}] ${duration}ms`)
        }
    }
}
