import { describe, it, expect, vi } from "vitest";
import { createLogger } from "../../middleware/logger.js";

describe("日志中间件测试", () => {
  it("应该创建日志中间件函数", () => {
    const loggerMiddleware = createLogger();
    expect(typeof loggerMiddleware).toBe("function");
  });

  it("应该记录请求信息", async () => {
    // 模拟console.log
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // 创建中间件
    const loggerMiddleware = createLogger();

    // 模拟上下文
    const c = {
      req: {
        method: "GET",
        path: "/test",
      },
      res: {
        status: 200,
      },
    };

    // 模拟next函数
    const next = vi.fn().mockResolvedValue(undefined);

    // 执行中间件
    await loggerMiddleware(c, next);

    // 验证next被调用
    expect(next).toHaveBeenCalled();

    // 验证console.log被调用
    expect(consoleLogSpy).toHaveBeenCalled();

    // 恢复console.log
    consoleLogSpy.mockRestore();
  });

  it("应该记录错误状态码的请求", async () => {
    // 模拟console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // 创建中间件
    const loggerMiddleware = createLogger();

    // 模拟上下文
    const c = {
      req: {
        method: "GET",
        path: "/test",
      },
      res: {
        status: 500,
      },
    };

    // 模拟next函数
    const next = vi.fn().mockResolvedValue(undefined);

    // 执行中间件
    await loggerMiddleware(c, next);

    // 验证next被调用
    expect(next).toHaveBeenCalled();

    // 恢复console.error
    consoleErrorSpy.mockRestore();
  });
});
