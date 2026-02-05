/**
 * 应用常量配置
 */

export const HTTP_CONFIG = {
    USER_AGENT: 'Mozilla/5.0 (compatible; WebToolsAPI/1.0)',
    MAX_REDIRECTS: 5,
    DEFAULT_TIMEOUT: 8000
}

export const CORS_CONFIG = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type']
}

export const LOG_LEVELS = {
    INFO: 'ℹ️',
    ERROR: '❌'
}

export const ERROR_CODE_MAP = {
    ENOTFOUND: { code: 400, message: 'DNS resolution failed' },
    ECONNREFUSED: { code: 503, message: 'Connection refused' },
    ECONNABORTED: { code: 504, message: 'Request timeout' }
}

export const MIME_TYPES = {
    ico: 'image/x-icon',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp'
}

export const RESPONSE_MESSAGES = {
    INVALID_URL: 'invalid url format',
    URL_REQUIRED: 'url is required'
}
