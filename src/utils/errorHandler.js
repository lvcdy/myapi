/**
 * @deprecated 使用 src/utils/response.js 中的 mapErrorResponse 代替
 * 
 * 错误处理工具（向后兼容）
 */

import { ERROR_CODE_MAP } from '../constants/index.js'

/**
 * 将错误转换为 API 响应
 * @deprecated 使用 mapErrorResponse 代替
 * @param {Error} err - 错误对象
 * @param {number} ms - 请求耗时（毫秒）
 * @returns {Object} API 响应对象
 */
export function mapErrorToResponse(err, ms) {
    const response = {
        status: 'down',
        code: 500,
        ms,
        error: err.message
    }

    // 根据错误类型设置相应的状态码和错误信息
    if (err.code && ERROR_CODE_MAP[err.code]) {
        const { code, message } = ERROR_CODE_MAP[err.code]
        response.code = code
        response.error = message
    } else if (err.response?.status) {
        response.status = 'error'
        response.code = err.response.status
        response.error = `HTTP ${err.response.status}`
    }

    return response
}
