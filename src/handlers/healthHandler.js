/**
 * 健康检查处理器
 */

/**
 * 处理健康检查请求
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export function handleHealth(c) {
    return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }, 200)
}
