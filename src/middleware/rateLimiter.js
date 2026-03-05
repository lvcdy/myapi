/**
 * 内存限流中间件 - 滑动窗口计数器
 * 针对向外发起请求的端点（/favicon, /uptime）做更严格的限制
 */

/**
 * 创建限流器实例
 * @param {Object} options
 * @param {number} options.windowMs - 时间窗口（毫秒）
 * @param {number} options.max - 窗口内最大请求数
 * @param {number} options.cleanupInterval - 过期记录清理间隔（毫秒）
 * @returns {Function} Hono 中间件
 */
export function createRateLimiter({ windowMs = 60_000, max = 60, cleanupInterval = 60_000 } = {}) {
    const hits = new Map() // key → { count, resetTime }

    // 定时清理过期记录，防止内存泄漏
    const timer = setInterval(() => {
        const now = Date.now()
        for (const [key, entry] of hits) {
            if (now >= entry.resetTime) hits.delete(key)
        }
    }, cleanupInterval)
    // 不阻止进程退出
    if (timer.unref) timer.unref()

    return async (c, next) => {
        const key = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
            || c.req.header('x-real-ip')
            || 'unknown'

        const now = Date.now()
        let entry = hits.get(key)

        if (!entry || now >= entry.resetTime) {
            entry = { count: 0, resetTime: now + windowMs }
            hits.set(key, entry)
        }

        entry.count++

        // 设置标准限流头
        const remaining = Math.max(0, max - entry.count)
        c.header('X-RateLimit-Limit', String(max))
        c.header('X-RateLimit-Remaining', String(remaining))
        c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)))

        if (entry.count > max) {
            c.header('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)))
            return c.json({ error: 'Too Many Requests' }, 429)
        }

        await next()
    }
}
