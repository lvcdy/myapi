/**
 * 应用启动入口
 */

import { serve } from '@hono/node-server'
import { createApp } from './src/app.js'
import { config } from './src/config.js'

const app = createApp()

function startServer(port = config.PORT, maxAttempts = 5) {
    const server = serve({
        fetch: app.fetch,
        port: port
    }, (info) => {
        console.log(`🚀 Server running at http://localhost:${info.port}`)
    })

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
            server.close(() => startServer(port + 1, maxAttempts - 1))
        } else {
            console.error('❌ Server error:', err.message)
            process.exit(1)
        }
    })

    return server
}

startServer()