/**
 * 日志中间件 - 轻量级版本
 */

/**
 * 创建请求日志中间件
 * @returns {Function} 中间件函数
 */
export function createLogger() {
    return async (c, next) => {
        const start = Date.now()
        await next()

        // 仅在生产环境的错误状态下记录
        if (process.env.NODE_ENV === 'production' && c.res.status >= 400) {
            const duration = Date.now() - start
            console.error(`${c.req.method} ${c.req.path} [${c.res.status}] ${duration}ms`)
        }
    }
}
