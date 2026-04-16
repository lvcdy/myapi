/**
 * 基础配置
 * 包含所有环境的通用配置
 */

export const baseConfig = {
  // 服务器配置
  PORT: parseInt(process.env.PORT || "3000", 10),
  TIMEOUT: parseInt(process.env.TIMEOUT || "8000", 10),

  // 安全配置
  STATS_TOKEN: process.env.STATS_TOKEN || "",

  // CORS 配置
  CORS: {
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  },

  // 限流配置
  RATE_LIMIT: {
    global: {
      windowMs: 60_000,
      max: 300,
    },
    favicon: {
      windowMs: 60_000,
      max: 300,
    },
    uptime: {
      windowMs: 60_000,
      max: 300,
    },
  },

  // 日志配置
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
