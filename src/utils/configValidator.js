/**
 * 配置验证工具
 */

export function validateConfig(config) {
    if (!Number.isInteger(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
        throw new Error(`Invalid PORT: ${config.PORT}`)
    }
    if (!Number.isInteger(config.TIMEOUT) || config.TIMEOUT < 1000 || config.TIMEOUT > 60000) {
        throw new Error(`Invalid TIMEOUT: ${config.TIMEOUT} (must be 1000-60000ms)`)
    }
    return config
}
