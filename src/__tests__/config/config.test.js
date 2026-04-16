import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { config, NODE_ENV } from "../../config.js";

describe("配置管理测试", () => {
  // 保存原始环境变量
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // 清除所有环境变量
    Object.keys(process.env).forEach((key) => delete process.env[key]);
  });

  afterEach(() => {
    // 恢复原始环境变量
    process.env = { ...originalEnv };
  });

  it("应该加载默认配置", () => {
    // 不设置任何环境变量
    // 重新导入配置模块
    delete require.cache[require.resolve("../../config.js")];
    const { config: testConfig } = require("../../config.js");

    expect(testConfig).toHaveProperty("PORT");
    expect(testConfig).toHaveProperty("TIMEOUT");
    expect(testConfig).toHaveProperty("STATS_TOKEN");
    expect(testConfig).toHaveProperty("CORS");
    expect(testConfig).toHaveProperty("RATE_LIMIT");
    expect(testConfig).toHaveProperty("LOG_LEVEL");
  });

  it("应该支持通过环境变量覆盖配置", () => {
    process.env.PORT = "4000";
    process.env.TIMEOUT = "5000";
    process.env.STATS_TOKEN = "test-token";
    process.env.LOG_LEVEL = "debug";

    // 重新导入配置模块
    delete require.cache[require.resolve("../../config.js")];
    const { config: testConfig } = require("../../config.js");

    expect(testConfig.PORT).toBe(4000);
    expect(testConfig.TIMEOUT).toBe(5000);
    expect(testConfig.STATS_TOKEN).toBe("test-token");
    expect(testConfig.LOG_LEVEL).toBe("debug");
  });

  it("应该根据NODE_ENV加载不同的配置", () => {
    process.env.NODE_ENV = "production";

    // 重新导入配置模块
    delete require.cache[require.resolve("../../config.js")];
    const { config: testConfig } = require("../../config.js");

    // 生产环境的默认端口应该是8080
    expect(testConfig.PORT).toBe(8080);
  });

  it("应该在测试环境中使用测试配置", () => {
    process.env.NODE_ENV = "test";

    // 重新导入配置模块
    delete require.cache[require.resolve("../../config.js")];
    const { config: testConfig } = require("../../config.js");

    // 测试环境的默认端口应该是3001
    expect(testConfig.PORT).toBe(3001);
  });

  it("应该在开发环境中使用开发配置", () => {
    process.env.NODE_ENV = "development";

    // 重新导入配置模块
    delete require.cache[require.resolve("../../config.js")];
    const { config: testConfig } = require("../../config.js");

    // 开发环境的默认端口应该是3000
    expect(testConfig.PORT).toBe(3000);
  });
});
