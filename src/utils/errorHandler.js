/**
 * 错误处理工具
 */

/**
 * 将错误转换为 API 响应
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
    switch (err.code) {
        case 'ENOTFOUND':
            response.code = 400
            response.error = 'DNS resolution failed'
            break
        case 'ECONNREFUSED':
            response.code = 503
            response.error = 'Connection refused'
            break
        case 'ECONNABORTED':
            response.code = 504
            response.error = 'Request timeout'
            break
        default:
            if (err.response?.status) {
                response.status = 'error'
                response.code = err.response.status
                response.error = `HTTP ${err.response.status}`
            }
    }

    return response
}
