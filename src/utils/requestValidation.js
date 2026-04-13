/**
 * 请求参数校验工具
 */

import { isValidUrl, isPrivateUrl } from './validators.js'
import { RESPONSE_MESSAGES } from '../constants/index.js'

/**
 * 校验 URL 查询参数并确保其为公网地址
 * @param {Context} c - Hono 上下文
 * @param {string} paramName - 查询参数名
 * @returns {{url?: string, response?: Response}}
 */
export function validatePublicUrlParam(c, paramName = 'url') {
    const url = c.req.query(paramName)

    if (!url) {
        return {
            response: c.json({ error: RESPONSE_MESSAGES.URL_REQUIRED }, 400)
        }
    }

    if (!isValidUrl(url)) {
        return {
            response: c.json({ error: RESPONSE_MESSAGES.INVALID_URL }, 400)
        }
    }

    if (isPrivateUrl(url)) {
        return {
            response: c.json({ error: RESPONSE_MESSAGES.PRIVATE_URL_NOT_ALLOWED }, 403)
        }
    }

    return { url }
}
