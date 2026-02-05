import { randomUUID } from 'crypto'

const HEADER = 'X-Request-ID'

export const createRequestIdMiddleware = () => async (c, next) => {
    const id = c.req.header(HEADER) || randomUUID()
    c.set(HEADER, id)
    c.header(HEADER, id)
    await next()
}

export const getRequestId = (c) => c.get(HEADER) || 'unknown'
