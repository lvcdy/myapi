/**
 * 应用配置模块
 */

import { validateConfig } from './utils/configValidator.js'

export const config = validateConfig({
    PORT: parseInt(process.env.PORT || '3000', 10),
    TIMEOUT: parseInt(process.env.TIMEOUT || '8000', 10)
})
