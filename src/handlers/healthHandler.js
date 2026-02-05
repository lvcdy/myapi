export const handleHealth = (c) => c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
}, 200)
