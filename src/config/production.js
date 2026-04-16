/**
 * 生产环境配置
 * 包含生产环境特有的配置
 */

import { baseConfig } from "./base.js";

export const productionConfig = {
  ...baseConfig,

  // 生产环境特有的配置
  PORT: parseInt(process.env.PORT || "8080", 10),
  LOG_LEVEL: process.env.LOG_LEVEL || "warn",

  // 生产环境的限流配置（更严格）
  RATE_LIMIT: {
    ...baseConfig.RATE_LIMIT,
    global: {
      windowMs: 60_000,
      max: 200,
    },
  },
};
