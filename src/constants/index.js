/**
 * 应用常量配置
 */

// HTTP 配置
export const HTTP_CONFIG = {
    USER_AGENT: 'Mozilla/5.0 (compatible; WebToolsAPI/1.0)',
    MAX_REDIRECTS: 5,
    DEFAULT_TIMEOUT: 8000
}

// CORS 配置
export const CORS_CONFIG = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type']
}

// 日志配置
export const LOG_LEVELS = {
    INFO: 'ℹ️',
    SUCCESS: '✅',
    WARN: '⚠️',
    ERROR: '❌'
}

// 错误码映射
export const ERROR_CODE_MAP = {
    ENOTFOUND: { code: 400, message: 'DNS resolution failed' },
    ECONNREFUSED: { code: 503, message: 'Connection refused' },
    ECONNABORTED: { code: 504, message: 'Request timeout' }
}

// HTTP 状态码描述
export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVICE_UNAVAILABLE: 503,
    INTERNAL_SERVER_ERROR: 500
}

// MIME 类型映射
export const MIME_TYPES = {
    ico: 'image/x-icon',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    json: 'application/json'
}

// 返回响应消息
export const RESPONSE_MESSAGES = {
    NOT_FOUND: 'Not Found',
    INTERNAL_ERROR: 'Internal Server Error',
    INVALID_URL: 'invalid url format',
    URL_REQUIRED: 'url is required',
    NO_DATA: 'no data available'
}
