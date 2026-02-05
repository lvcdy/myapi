/**
 * HTTP 客户端工具
 */

import axios from 'axios'
import { HTTP_CONFIG, MIME_TYPES } from '../constants/index.js'

/**
 * 创建 HTTP 请求配置
 * @param {Object} options - 额外选项
 * @returns {Object} axios 配置
 */
export function createHttpConfig(options = {}) {
    return {
        headers: {
            'User-Agent': HTTP_CONFIG.USER_AGENT,
            ...options.headers
        },
        maxRedirects: HTTP_CONFIG.MAX_REDIRECTS,
        validateStatus: () => true, // 不自动抛出 HTTP 错误
        ...options
    }
}

/**
 * 创建图片请求配置
 * @param {Object} options - 额外选项
 * @returns {Object} axios 配置
 */
export function createImageHttpConfig(options = {}) {
    return createHttpConfig({
        responseType: 'arraybuffer',
        headers: {
            'Accept': 'image/*,*/*'
        },
        ...options
    })
}

/**
 * 根据 URL 获取 MIME 类型
 * @param {string} url - URL 或文件路径
 * @returns {string} MIME 类型
 */
export function getMimeTypeFromUrl(url) {
    const ext = url.split('.').pop()?.toLowerCase().split('?')[0]
    return MIME_TYPES[ext] || 'application/octet-stream'
}

/**
 * 验证响应是否为图片
 * @param {Object} response - axios 响应对象
 * @returns {boolean}
 */
export function isImageResponse(response) {
    const contentType = response.headers['content-type'] || ''
    return contentType.startsWith('image/') || contentType.includes('icon')
}
