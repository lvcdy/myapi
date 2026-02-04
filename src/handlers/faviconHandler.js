/**
 * 网站图标获取处理器
 */

import { isValidUrl, extractDomain } from '../utils/validators.js'
import { config } from '../config.js'

/**
 * 处理网站图标获取请求
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export function handleFavicon(c) {
    const url = c.req.query('url')

    // 参数验证
    if (!url) {
        return c.json({ error: 'url is required' }, 400)
    }

    if (!isValidUrl(url)) {
        return c.json({ error: 'invalid url format' }, 400)
    }

    try {
        const domain = extractDomain(url)
        const faviconUrl = `${config.FAVICON_API}?domain=${domain}&sz=${config.FAVICON_SIZE}`
        return c.redirect(faviconUrl)
    } catch {
        return c.json({ error: 'invalid url' }, 400)
    }
}
