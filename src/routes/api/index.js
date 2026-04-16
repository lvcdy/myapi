import {
  handleHitokoto,
  handleHitokotoTypes,
} from "../../handlers/hitokotoHandler.js";
import { handleStats } from "../../handlers/statsHandler.js";

export const apiRoutes = [
  {
    method: "GET",
    path: "/stats",
    handler: handleStats,
    description: "统计（需认证）",
  },
  {
    method: "GET",
    path: "/hitokoto",
    handler: handleHitokoto,
    description: "一言",
  },
  {
    method: "GET",
    path: "/hitokoto/types",
    handler: handleHitokotoTypes,
    description: "一言类型",
  },
];
