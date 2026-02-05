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

/**
 * 尝试启动服务器，如果端口被占用则尝试下一个端口
 */
function startServer(port = config.PORT, maxAttempts = 10) {
    try {
        const server = serve({
            fetch: app.fetch,
            port: port
        }, (info) => {
            console.log(`🚀 API 运行在 http://localhost:${info.port}`)
            console.log(`📚 访问 http://localhost:${info.port} 查看 API 文档\n`)
        })

        // 处理服务器错误
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                if (maxAttempts > 0) {
                    console.warn(`⚠️  端口 ${port} 已被占用，尝试端口 ${port + 1}...`)
                    server.close(() => startServer(port + 1, maxAttempts - 1))
                } else {
                    console.error(`❌ 无法找到可用端口 (已尝试 ${config.PORT} 到 ${port})`)
                    console.error(`💡 解决方案:`)
                    console.error(`   1. 使用不同的端口: PORT=3001 pnpm dev`)
                    console.error(`   2. 关闭占用端口的进程: lsof -i :${config.PORT} -t | xargs kill -9`)
                    process.exit(1)
                }
            } else {
                console.error('❌ 服务器错误:', err)
                process.exit(1)
            }
        })

        return server
    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            if (maxAttempts > 0) {
                console.warn(`⚠️  端口 ${port} 已被占用，尝试端口 ${port + 1}...`)
                return startServer(port + 1, maxAttempts - 1)
            } else {
                console.error(`❌ 无法找到可用端口 (已尝试 ${config.PORT} 到 ${port})`)
                process.exit(1)
            }
        } else {
            throw err
        }
    }
}

// 启动服务器
startServer()