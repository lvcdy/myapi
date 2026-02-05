/**
 * 响应工具 - 统一响应格式
 */

import { LOG_LEVELS, ERROR_CODE_MAP, RESPONSE_MESSAGES } from '../constants/index.js'

/**
 * 构建成功响应
 * @param {Object} data - 响应数据
 * @param {number} code - HTTP 状态码
 * @returns {Object} 响应对象
 */
export function successResponse(data, code = 200) {
    return {
        data,
        code,
        timestamp: new Date().toISOString()
    }
}

/**
 * 构建错误响应
 * @param {string|Error} error - 错误信息或错误对象
 * @param {number} code - HTTP 状态码
 * @returns {Object} 响应对象
 */
export function errorResponse(error, code = 500) {
    const message = error instanceof Error ? error.message : error
    return {
        error: message,
        code,
        timestamp: new Date().toISOString()
    }
}

/**
 * 根据错误类型映射响应
 * @param {Error} error - 错误对象
 * @param {Object} context - 上下文信息
 * @returns {Object} 响应对象
 */
export function mapErrorResponse(error, context = {}) {
    const { code: errorCode, message: defaultMessage } = error

    // 检查错误码映射
    if (errorCode && ERROR_CODE_MAP[errorCode]) {
        const { code, message } = ERROR_CODE_MAP[errorCode]
        return {
            ...errorResponse(message, code),
            ...context
        }
    }

    // 检查 HTTP 响应错误
    if (error.response?.status) {
        return {
            ...errorResponse(`HTTP ${error.response.status}`, error.response.status),
            ...context
        }
    }

    // 默认错误
    return {
        ...errorResponse(error.message || defaultMessage, 500),
        ...context
    }
}

/**
 * 打印日志
 * @param {string} level - 日志级别
 * @param {string} message - 消息
 * @param {any} data - 附加数据
 */
export function log(level, message, data = null) {
    const icon = LOG_LEVELS[level] || '📌'
    if (data) {
        console.log(`${icon} ${message}`, data)
    } else {
        console.log(`${icon} ${message}`)
    }
}
