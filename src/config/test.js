/**
 * 测试环境配置
 * 包含测试环境特有的配置
 */

import { baseConfig } from "./base.js";

export const testConfig = {
  ...baseConfig,

  // 测试环境特有的配置
  PORT: parseInt(process.env.PORT || "3001", 10),
  LOG_LEVEL: process.env.LOG_LEVEL || "error",

  // 测试环境的限流配置（禁用）
  RATE_LIMIT: {
    ...baseConfig.RATE_LIMIT,
    global: {
      windowMs: 60_000,
      max: 10000,
    },
  },
};
