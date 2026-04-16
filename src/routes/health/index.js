import { handleHealth } from "../../handlers/healthHandler.js";
import { handleUptime } from "../../handlers/uptimeHandler.js";

export const healthRoutes = [
  {
    method: "GET",
    path: "/health",
    handler: handleHealth,
    description: "健康检查",
  },
  {
    method: "GET",
    path: "/uptime",
    handler: handleUptime,
    description: "可用性检测",
  },
];
