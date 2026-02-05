/**
 * 网站图标获取处理器 - 本地抓取模式
 */

import axios from 'axios'
import { isValidUrl } from '../utils/validators.js'
import { createHttpConfig, createImageHttpConfig, getMimeTypeFromUrl, isImageResponse } from '../utils/httpClient.js'
import { config } from '../config.js'
import { RESPONSE_MESSAGES } from '../constants/index.js'

/**
 * 从 HTML 中提取 favicon URL
 * @param {string} html - HTML 内容
 * @param {string} baseUrl - 基础 URL
 * @returns {string|null} favicon URL
 */
function extractFaviconFromHtml(html, baseUrl) {
    const base = new URL(baseUrl)

    // 匹配各种 favicon 声明方式
    const patterns = [
        /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
        /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
        /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']+)["']/i,
        /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon(?:-precomposed)?["']/i,
    ]

    for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
            const href = match[1]
            // 处理相对路径
            if (href.startsWith('//')) {
                return `${base.protocol}${href}`
            } else if (href.startsWith('/')) {
                return `${base.origin}${href}`
            } else if (href.startsWith('http')) {
                return href
            } else {
                return `${base.origin}/${href}`
            }
        }
    }

    return null
}

/**
 * 下载并返回图片
 * @param {string} url - 图片 URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<{data: Buffer, contentType: string}|null>}
 */
async function downloadImage(url, timeout) {
    try {
        const response = await axios.get(url, createImageHttpConfig({ timeout }))

        if (!isImageResponse(response)) {
            return null
        }

        const contentType = response.headers['content-type'] || getMimeTypeFromUrl(url)
        return {
            data: Buffer.from(response.data),
            contentType
        }
    } catch {
        return null
    }
}

/**
 * 处理网站图标获取请求
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export async function handleFavicon(c) {
    const url = c.req.query('url')

    if (!url) {
        return c.json({ error: RESPONSE_MESSAGES.URL_REQUIRED }, 400)
    }

    if (!isValidUrl(url)) {
        return c.json({ error: RESPONSE_MESSAGES.INVALID_URL }, 400)
    }

    try {
        const base = new URL(url)
        const timeout = config.TIMEOUT

        // 策略 1: 从 HTML 页面解析 favicon 链接
        try {
            const htmlResponse = await axios.get(url, createHttpConfig({
                timeout,
                headers: { 'Accept': 'text/html,*/*' }
            }))

            const faviconUrl = extractFaviconFromHtml(htmlResponse.data, url)
            if (faviconUrl) {
                const image = await downloadImage(faviconUrl, timeout)
                if (image) {
                    return new Response(image.data, {
                        status: 200,
                        headers: {
                            'Content-Type': image.contentType,
                            'Cache-Control': 'public, max-age=86400'
                        }
                    })
                }
            }
        } catch {
            // HTML 解析失败，继续尝试其他策略
        }

        // 策略 2: 尝试默认的 /favicon.ico 路径
        const defaultFaviconUrl = `${base.origin}/favicon.ico`
        const image = await downloadImage(defaultFaviconUrl, timeout)
        if (image) {
            return new Response(image.data, {
                status: 200,
                headers: {
                    'Content-Type': image.contentType,
                    'Cache-Control': 'public, max-age=86400'
                }
            })
        }

        return c.json({ error: 'favicon not found' }, 404)
    } catch (err) {
        return c.json({ error: 'failed to fetch favicon', message: err.message }, 500)
    }
}
