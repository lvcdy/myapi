/**
 * Request ID 辅助工具
 * 中间件已由 Hono 内置 requestId 接管（见 app.js），此处仅保留读取函数
 */
export const getRequestId = (c) => c.get('requestId') || 'unknown'
