/**
 * 中间件配置
 * 提取公共的中间件配置，便于统一管理
 */

import { config } from "../config.js";

// 日志中间件配置
export const loggerConfig = {
  enable: true,
  level: config.LOG_LEVEL,
};

// 限流中间件配置
export const rateLimiterConfig = {
  global: config.RATE_LIMIT.global,
  favicon: config.RATE_LIMIT.favicon,
  uptime: config.RATE_LIMIT.uptime,
};

// 请求计数中间件配置
export const requestCounterConfig = {
  enable: true,
  maxTrackedPaths: 100,
};

// 请求ID中间件配置
export const requestIdConfig = {
  enable: true,
};

// 压缩中间件配置
export const compressConfig = {
  enable: true,
};

// ETag中间件配置
export const etagConfig = {
  enable: true,
  weak: true,
};

// 超时中间件配置
export const timeoutConfig = {
  enable: true,
  timeout: config.TIMEOUT,
};

// 安全头中间件配置
export const secureHeadersConfig = {
  enable: true,
};

// CORS中间件配置
export const corsConfig = {
  enable: true,
  options: config.CORS,
};

// 尾部斜杠中间件配置
export const trimTrailingSlashConfig = {
  enable: true,
};
