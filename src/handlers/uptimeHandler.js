/**
 * 网站可用性检测处理器
 */

import axios from 'axios'
import { isValidUrl } from '../utils/validators.js'
import { mapErrorToResponse } from '../utils/errorHandler.js'
import { config } from '../config.js'

/**
 * 处理网站可用性检测请求
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export async function handleUptime(c) {
    const url = c.req.query('url')

    // 参数验证
    if (!url) {
        return c.json({ error: 'url is required' }, 400)
    }

    if (!isValidUrl(url)) {
        return c.json({ error: 'invalid url format' }, 400)
    }

    const start = Date.now()

    try {
        const res = await axios.get(url, { timeout: config.TIMEOUT })
        const ms = Date.now() - start
        return c.json({ status: 'up', code: res.status, ms }, 200)
    } catch (err) {
        const ms = Date.now() - start
        const errorResponse = mapErrorToResponse(err, ms)
        return c.json(errorResponse, errorResponse.code)
    }
}
