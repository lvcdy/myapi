/**
 * 请求统计处理器
 * 返回API请求数和统计信息
 */

import { getRequestStats } from '../middleware/requestCounter.js'

/**
 * 处理请求统计查询
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} 统计数据
 */
export function handleStats(c) {
    const stats = getRequestStats()
    return c.json(stats)
}
