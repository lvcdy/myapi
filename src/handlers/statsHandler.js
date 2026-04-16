/**
 * 统计端点处理器 - 需要 Bearer Token 认证
 */

import { getRequestStats } from "../middleware/requestCounter.js";
import { config } from "../config.js";

/**
 * 处理统计请求
 * - 设置了 STATS_TOKEN 时需要 Bearer Token 认证
 * - 未设置 STATS_TOKEN 时允许公开访问（便于容器部署后的首页统计展示）
 * @param {Context} c - Hono 上下文对象
 */
export function handleStats(c) {
  const token = config.STATS_TOKEN;

  if (token) {
    // 有 token 配置时需要认证
    const auth = c.req.header("authorization");
    if (auth !== `Bearer ${token}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }

  return c.json(getRequestStats());
}
