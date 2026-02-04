/**
 * 网站可用性检测处理器
 */

import axios from 'axios'
import { isValidUrl } from '../utils/validators.js'
import { mapErrorToResponse } from '../utils/errorHandler.js'
import { config } from '../config.js'

// HTTP 请求通用配置
const HTTP_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebToolsAPI/1.0)'
    },
    maxRedirects: 5,
    validateStatus: () => true // 不抛出 HTTP 错误，自行处理状态码
}

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
        const res = await axios.get(url, {
            ...HTTP_OPTIONS,
            timeout: config.TIMEOUT
        })
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
        const errorResponse = mapErrorToResponse(err, ms)
        return c.json(errorResponse, 200) // 返回 200，错误信息在 body 中
    }
}
