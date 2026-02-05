import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'
import { secureHeaders } from 'hono/secure-headers'
import { createLogger } from './middleware/logger.js'
import { createRequestCounter } from './middleware/requestCounter.js'
import { createRequestIdMiddleware } from './middleware/requestId.js'
import { registerRoutes } from './routes/index.js'
import { CORS_CONFIG } from './constants/index.js'

export const createApp = () => {
    const app = new Hono()
    app.use(secureHeaders())
    app.use(compress())
    app.use(createRequestIdMiddleware())
    app.use(createRequestCounter())
    app.use(createLogger())
    app.use(cors(CORS_CONFIG))
    registerRoutes(app)
    return app
}
