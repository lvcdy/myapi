/**
 * 配置验证工具 - 已最小化
 */

export function validateConfig(config) {
    // 基本验证（可选，取决于是否需要）
    if (!Number.isInteger(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
        throw new Error(`Invalid PORT: ${config.PORT}`)
    }
    return config
}
