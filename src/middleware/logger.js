/**
 * 日志中间件
 */

import { log } from '../utils/response.js'
import { getRequestId } from './requestId.js'

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
        const requestId = getRequestId(c)

        try {
            await next()
            const duration = Date.now() - start
            const status = c.res.status
            const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '⚠️' : '📌'
            log('INFO', `[${requestId}] ${statusEmoji} ${method} ${path}${query} [${status}] ${duration}ms`)
        } catch (err) {
            const duration = Date.now() - start
            log('ERROR', `[${requestId}] ${method} ${path}${query} [ERROR] ${duration}ms - ${err.message}`)
            throw err
        }
    }
}
