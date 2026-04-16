import { getHomepageHtml } from "../views/homepage.js";
import { healthRoutes } from "./health/index.js";
import { staticRoutes } from "./static/index.js";
import { apiRoutes } from "./api/index.js";
import { errorResponse } from "../utils/response.js";

const HOMEPAGE_EXCLUDED_PATHS = new Set(["/"]);
const HOMEPAGE_HIDDEN_STATIC_PATHS = new Set([
  "/favicon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
]);
const HOMEPAGE_TRACKED_PATHS = ["/uptime", "/favicon", "/hitokoto"];

const homepageRoute = {
  method: "GET",
  path: "/",
  handler: (c) => c.html(getHomepageHtml(getHomepageMetadata())),
  description: "主页",
};

export const routes = [
  homepageRoute,
  ...healthRoutes,
  ...staticRoutes,
  ...apiRoutes,
];

function getHomepageMetadata() {
  const apiRoutes = routes
    .filter(
      (route) =>
        !HOMEPAGE_EXCLUDED_PATHS.has(route.path) &&
        !HOMEPAGE_HIDDEN_STATIC_PATHS.has(route.path)
    )
    .map(({ method, path, description }) => ({ method, path, description }));

  return {
    apiRoutes,
    trackedPaths: HOMEPAGE_TRACKED_PATHS,
  };
}

function registerRoute(app, route) {
  const method = route.method.toLowerCase();
  if (typeof app[method] === "function") {
    app[method](route.path, route.handler);
  }
}

function createNotFoundHandler() {
  return (c) => c.json(errorResponse("Not Found", 404), 404);
}

function createErrorHandler() {
  return (err, c) => {
    console.error("❌ 应用错误:", err.stack || err.message);
    const status = err.status || 500;
    const message =
      status === 504 ? "Gateway Timeout" : "Internal Server Error";
    return c.json(errorResponse(message, status), status);
  };
}

/**
 * 注册所有路由
 * @param {Hono} app - Hono 应用实例
 */
export function registerRoutes(app) {
  routes.forEach((route) => registerRoute(app, route));
  app.notFound(createNotFoundHandler());
  app.onError(createErrorHandler());
}
