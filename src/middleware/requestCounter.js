/**
 * 请求计数中间件
 * 统计API请求的数量、类型和分布
 */

let stats = {
    totalRequests: 0,
    requestsByMethod: {},
    requestsByPath: {},
    requestsByStatus: {},
    startTime: Date.now()
}

/**
 * 创建请求计数中间件
 * @returns {Function} 中间件函数
 */
export function createRequestCounter() {
    return async (c, next) => {
        const path = c.req.path

        // 跳过 /stats 端点的统计
        if (path === '/stats') {
            await next()
            return
        }

        const method = c.req.method

        // 统计总请求数
        stats.totalRequests++

        // 统计请求方法
        stats.requestsByMethod[method] = (stats.requestsByMethod[method] || 0) + 1

        // 统计请求路径
        stats.requestsByPath[path] = (stats.requestsByPath[path] || 0) + 1

        await next()

        // 统计响应状态码
        const status = c.res.status
        stats.requestsByStatus[status] = (stats.requestsByStatus[status] || 0) + 1
    }
}

/**
 * 获取统计数据
 * @returns {Object} 统计信息
 */
export function getRequestStats() {
    const uptime = Date.now() - stats.startTime
    const avgRequestsPerSecond = (stats.totalRequests / (uptime / 1000)).toFixed(2)

    return {
        totalRequests: stats.totalRequests,
        uptime: `${(uptime / 1000).toFixed(2)}s`,
        averageRequestsPerSecond: parseFloat(avgRequestsPerSecond),
        requestsByMethod: stats.requestsByMethod,
        requestsByPath: stats.requestsByPath,
        requestsByStatus: stats.requestsByStatus,
        timestamp: new Date().toISOString()
    }
}

/**
 * 重置统计数据
 */
export function resetRequestStats() {
    stats = {
        totalRequests: 0,
        requestsByMethod: {},
        requestsByPath: {},
        requestsByStatus: {},
        startTime: Date.now()
    }
}
