/**
 * 网站图标获取处理器 - 本地抓取模式
 */

import axios from 'axios'
import { isValidUrl } from '../utils/validators.js'
import { config } from '../config.js'

// HTTP 请求通用配置
const HTTP_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebToolsAPI/1.0)'
    },
    maxRedirects: 5
}

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
        // <link rel="icon" href="...">
        /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
        // <link href="..." rel="icon">
        /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
        // <link rel="apple-touch-icon" href="...">
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
 * 获取内容类型
 * @param {string} url - URL
 * @returns {string} MIME 类型
 */
function getMimeType(url) {
    const ext = url.split('.').pop()?.toLowerCase().split('?')[0]
    const mimeTypes = {
        'ico': 'image/x-icon',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp'
    }
    return mimeTypes[ext] || 'image/x-icon'
}

/**
 * 下载并返回图片
 * @param {string} url - 图片 URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<{data: Buffer, contentType: string}|null>}
 */
async function downloadImage(url, timeout) {
    try {
        const response = await axios.get(url, {
            ...HTTP_OPTIONS,
            timeout,
            responseType: 'arraybuffer',
            headers: {
                ...HTTP_OPTIONS.headers,
                'Accept': 'image/*,*/*'
            }
        })

        const contentType = response.headers['content-type'] || getMimeType(url)

        // 验证是否为图片
        if (!contentType.startsWith('image/') && !contentType.includes('icon')) {
            return null
        }

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

    // 参数验证
    if (!url) {
        return c.json({ error: 'url is required' }, 400)
    }

    if (!isValidUrl(url)) {
        return c.json({ error: 'invalid url format' }, 400)
    }

    try {
        const base = new URL(url)
        const timeout = config.TIMEOUT

        // 策略 1: 从 HTML 页面解析 favicon 链接
        try {
            const htmlResponse = await axios.get(url, {
                ...HTTP_OPTIONS,
                timeout,
                headers: {
                    ...HTTP_OPTIONS.headers,
                    'Accept': 'text/html,*/*'
                }
            })

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

        // 所有策略都失败
        return c.json({ error: 'favicon not found' }, 404)

    } catch (err) {
        return c.json({ error: 'failed to fetch favicon', message: err.message }, 500)
    }
}
