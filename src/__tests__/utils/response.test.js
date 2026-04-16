import { describe, it, expect } from "vitest";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../../utils/response.js";

describe("响应工具函数测试", () => {
  describe("successResponse", () => {
    it("应该返回正确的成功响应格式", () => {
      const data = { message: "Hello World" };
      const response = successResponse(data);

      expect(response).toHaveProperty("success", true);
      expect(response).toHaveProperty("data", data);
      expect(response).toHaveProperty("code", 200);
      expect(response).toHaveProperty("timestamp");
    });

    it("应该支持自定义状态码", () => {
      const data = { message: "Created" };
      const response = successResponse(data, 201);

      expect(response.code).toBe(201);
    });
  });

  describe("errorResponse", () => {
    it("应该返回正确的错误响应格式", () => {
      const errorMessage = "Something went wrong";
      const response = errorResponse(errorMessage);

      expect(response).toHaveProperty("success", false);
      expect(response).toHaveProperty("error", errorMessage);
      expect(response).toHaveProperty("code", 500);
      expect(response).toHaveProperty("timestamp");
    });

    it("应该支持自定义状态码", () => {
      const errorMessage = "Not found";
      const response = errorResponse(errorMessage, 404);

      expect(response.code).toBe(404);
    });

    it("应该处理Error对象", () => {
      const error = new Error("Test error");
      const response = errorResponse(error);

      expect(response.error).toBe("Test error");
    });
  });

  describe("paginatedResponse", () => {
    it("应该返回正确的分页响应格式", () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const total = 10;
      const page = 1;
      const pageSize = 3;

      const response = paginatedResponse(data, total, page, pageSize);

      expect(response).toHaveProperty("success", true);
      expect(response).toHaveProperty("data", data);
      expect(response).toHaveProperty("pagination");
      expect(response.pagination).toHaveProperty("total", total);
      expect(response.pagination).toHaveProperty("page", page);
      expect(response.pagination).toHaveProperty("pageSize", pageSize);
      expect(response.pagination).toHaveProperty("totalPages", 4);
      expect(response).toHaveProperty("timestamp");
    });

    it("应该使用默认值", () => {
      const data = [];
      const total = 0;

      const response = paginatedResponse(data, total);

      expect(response.pagination.page).toBe(1);
      expect(response.pagination.pageSize).toBe(10);
    });
  });
});
