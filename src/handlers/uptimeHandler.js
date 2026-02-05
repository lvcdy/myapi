/**
 * 网站可用性检测处理器
 */

import axios from 'axios'
import { isValidUrl } from '../utils/validators.js'
import { mapErrorResponse } from '../utils/response.js'
import { createHttpConfig } from '../utils/httpClient.js'
import { config } from '../config.js'
import { RESPONSE_MESSAGES } from '../constants/index.js'

/**
 * 处理网站可用性检测请求
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export async function handleUptime(c) {
    const url = c.req.query('url')

    // 参数验证
    if (!url) {
        return c.json({ error: RESPONSE_MESSAGES.URL_REQUIRED }, 400)
    }

    if (!isValidUrl(url)) {
        return c.json({ error: RESPONSE_MESSAGES.INVALID_URL }, 400)
    }

    const start = Date.now()

    try {
        const res = await axios.get(url, createHttpConfig({
            timeout: config.TIMEOUT
        }))
        const ms = Date.now() - start

        // 根据状态码判断网站状态
        const isUp = res.status >= 200 && res.status < 400
        return c.json({
            status: isUp ? 'up' : 'error',
            code: res.status,
            ms
        }, 200)
    } catch (err) {
        const ms = Date.now() - start
        const errorResponse = mapErrorResponse(err, { ms })
        return c.json(errorResponse, 200) // 返回 200，错误信息在 body 中
    }
}
