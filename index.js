/**
 * 应用启动入口
 */

import { serve } from '@hono/node-server'
import { createApp } from './src/app.js'
import { config } from './src/config.js'
import { validateConfig, printConfig } from './src/utils/configValidator.js'

// 验证配置
validateConfig(config)

// 打印配置信息
printConfig(config)

const app = createApp()

serve({ fetch: app.fetch, port: config.PORT }, (info) => {
    console.log(`🚀 API 运行在 http://localhost:${info.port}`)
    console.log(`📚 访问 http://localhost:${info.port} 查看 API 文档\n`)
})