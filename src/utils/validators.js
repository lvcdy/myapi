/**
 * 校验 URL 格式，仅允许 http/https 协议
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

/**
 * 私有/内网 IP 段正则
 */
const PRIVATE_IP_PATTERNS = [
    /^127\./,                          // loopback
    /^10\./,                           // 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\./,      // 172.16.0.0/12
    /^192\.168\./,                      // 192.168.0.0/16
    /^169\.254\./,                      // link-local
    /^0\./,                            // 0.0.0.0/8
    /^\[?::1\]?$/,                     // IPv6 loopback
    /^\[?fe80:/i,                      // IPv6 link-local
    /^\[?fc00:/i,                      // IPv6 unique local
    /^\[?fd/i,                         // IPv6 unique local
]

/**
 * 检查 URL 是否指向私有/内网地址
 * @param {string} url - 要检查的 URL
 * @returns {boolean} 是否为私有地址
 */
export function isPrivateUrl(url) {
    try {
        const { hostname } = new URL(url)
        const host = hostname.toLowerCase()
        if (host === 'localhost' || host === '[::1]') return true
        return PRIVATE_IP_PATTERNS.some(pattern => pattern.test(host))
    } catch {
        return false
    }
}
