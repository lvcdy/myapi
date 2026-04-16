/**
 * 应用启动入口
 */

import { serve } from "@hono/node-server";
import { createApp } from "./src/app.js";
import { config } from "./src/config.js";

const app = createApp();

function startServer(port = config.PORT, maxAttempts = 5) {
  const server = serve(
    {
      fetch: app.fetch,
      port: port,
    },
    (info) => {
      console.log(`🚀 Server running at http://localhost:${info.port}`);
    }
  );

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && maxAttempts > 0) {
      server.close(() => startServer(port + 1, maxAttempts - 1));
    } else {
      console.error("❌ Server error:", err.message);
      process.exit(1);
    }
  });

  // 优雅关停 — 收到终止信号后停止接受新连接，等待进行中请求完成
  const shutdown = (signal) => {
    console.log(`\n🛑 收到 ${signal}，正在优雅关停...`);
    server.close(() => {
      console.log("✅ 服务器已关闭");
      process.exit(0);
    });
    // 如果 5 秒内无法关闭，强制退出
    setTimeout(() => {
      console.error("⚠️ 强制退出（超时 5s）");
      process.exit(1);
    }, 5000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  return server;
}

startServer();
