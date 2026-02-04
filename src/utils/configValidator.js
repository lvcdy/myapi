/**
 * 配置验证工具
 */

/**
 * 验证和初始化配置
 * @param {Object} config - 配置对象
 * @returns {Object} 验证后的配置
 */
export function validateConfig(config) {
    const errors = []

    // 验证端口
    if (!Number.isInteger(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
        errors.push(`PORT must be between 1 and 65535, got: ${config.PORT}`)
    }

    // 验证超时时间
    if (!Number.isInteger(config.TIMEOUT) || config.TIMEOUT < 1000 || config.TIMEOUT > 60000) {
        errors.push(`TIMEOUT must be between 1000 and 60000 ms, got: ${config.TIMEOUT}`)
    }

    if (errors.length > 0) {
        console.error('❌ 配置验证失败:')
        errors.forEach(err => console.error(`  - ${err}`))
        process.exit(1)
    }

    return config
}

/**
 * 打印配置信息
 * @param {Object} config - 配置对象
 */
export function printConfig(config) {
    console.log('\n📋 应用配置:')
    console.log(`  PORT: ${config.PORT}`)
    console.log(`  TIMEOUT: ${config.TIMEOUT}ms`)
    console.log(`  FAVICON_SIZE: ${config.FAVICON_SIZE}px\n`)
}
