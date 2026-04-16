import { describe, it, expect } from "vitest";
import { createApp } from "../app.js";

describe("应用基础测试", () => {
  const app = createApp();

  it("应用应该成功创建", () => {
    expect(app).toBeDefined();
    expect(app.fetch).toBeDefined();
  });

  it("GET / 应该返回200", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("GET /health 应该返回健康状态", async () => {
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeDefined();
  });

  it("GET /uptime?url=https://example.com 应该返回服务器运行时间", async () => {
    const res = await app.fetch(
      new Request("http://localhost/uptime?url=https://example.com")
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status || data.code).toBeDefined();
  });

  it("GET /stats 无认证应该返回统计（开发环境）", async () => {
    const res = await app.fetch(new Request("http://localhost/stats"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.totalRequests).toBeDefined();
    expect(data.uptime).toBeDefined();
    expect(data.averageRequestsPerSecond).toBeDefined();
    expect(data.requestsByMethod).toBeDefined();
    expect(data.requestsByPath).toBeDefined();
    expect(data.requestsByStatus).toBeDefined();
  });

  it("404 未找到的路由应该返回404", async () => {
    const res = await app.fetch(new Request("http://localhost/notfound"));
    expect(res.status).toBe(404);
  });

  it("尾部斜杠应该 301 重定向到无斜杠路径", async () => {
    const res = await app.fetch(new Request("http://localhost/health/"), {
      redirect: "manual",
    });
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toContain("/health");
  });

  it("响应应该包含 ETag 头", async () => {
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.headers.get("etag")).toBeDefined();
  });

  it("响应应该包含 X-Request-Id 头", async () => {
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.headers.get("x-request-id")).toBeTruthy();
  });

  it("响应应该包含安全头", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("strict-transport-security")).toBeDefined();
    expect(res.headers.get("cross-origin-resource-policy")).toBeDefined();
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("响应应该包含限流头", async () => {
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.headers.get("x-ratelimit-limit")).toBeDefined();
    expect(res.headers.get("x-ratelimit-remaining")).toBeDefined();
    expect(res.headers.get("x-ratelimit-reset")).toBeDefined();
  });

  it("全局错误处理不应泄露内部信息", async () => {
    const res = await app.fetch(new Request("http://localhost/notfound"));
    const data = await res.json();
    expect(data.error).toBe("Not Found");
    expect(data.message).toBeUndefined();
    expect(data.stack).toBeUndefined();
  });
});
