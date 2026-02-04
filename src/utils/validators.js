/**
 * URL 验证工具
 */

/**
 * 验证 URL 格式
 * @param {string} url - 待验证的 URL
 * @returns {boolean} 是否为有效的 URL
 */
export function isValidUrl(url) {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * 从 URL 提取域名
 * @param {string} url - URL 地址
 * @returns {string} 域名
 */
export function extractDomain(url) {
    return new URL(url).hostname
}
