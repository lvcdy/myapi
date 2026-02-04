/**
 * 应用启动入口
 */

import { serve } from '@hono/node-server'
import { createApp } from './src/app.js'
import { config } from './src/config.js'

const app = createApp()

serve({ fetch: app.fetch, port: config.PORT }, (info) => {
    console.log(`🚀 API 运行在 http://localhost:${info.port}`)
    console.log(`⏱️  请求超时设置: ${config.TIMEOUT}ms`)
})