/**
 * 开发环境配置
 * 包含开发环境特有的配置
 */

import { baseConfig } from "./base.js";

export const developmentConfig = {
  ...baseConfig,

  // 开发环境特有的配置
  PORT: parseInt(process.env.PORT || "3000", 10),
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",

  // 开发环境的限流配置（更宽松）
  RATE_LIMIT: {
    ...baseConfig.RATE_LIMIT,
    global: {
      windowMs: 60_000,
      max: 1000,
    },
  },
};
