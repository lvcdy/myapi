/**
 * 日志中间件 - 轻量级版本
 */

import { NODE_ENV } from "../config.js";
import { loggerConfig } from "./config.js";

/**
 * 创建请求日志中间件
 * @returns {Function} 中间件函数
 */
export function createLogger() {
  const isDev = NODE_ENV !== "production";
  const level = loggerConfig.level;

  return async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    if (isDev) {
      // 开发环境：记录所有请求
      const status = c.res.status;
      const level = status >= 400 ? "❌" : "ℹ️";
      console.log(
        `${level} ${c.req.method} ${c.req.path} [${status}] ${duration}ms`
      );
    } else if (c.res.status >= 500 || (c.res.status >= 400 && duration >= 5)) {
      // 生产环境：记录 5xx 和耗时较长的 4xx（跳过缓存命中等极快响应）
      console.error(
        `${c.req.method} ${c.req.path} [${c.res.status}] ${duration}ms`
      );
    }
  };
}
