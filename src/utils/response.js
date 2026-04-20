/**
 * 响应工具 - 统一响应格式
 */

import { ERROR_CODE_MAP } from "../constants/index.js";

function createBaseResponse(success, code) {
  return {
    success,
    code,
    timestamp: new Date().toISOString(),
  };
}

function normalizeErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  if (
    error &&
    typeof error === "object" &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }
  return "Internal Server Error";
}

/**
 * 构建成功响应
 * @param {any} data - 响应数据
 * @param {number} code - HTTP 状态码
 * @returns {Object} 响应对象
 */
export function successResponse(data, code = 200) {
  return {
    ...createBaseResponse(true, code),
    data,
  };
}

/**
 * 构建错误响应
 * @param {string|Error} error - 错误信息或错误对象
 * @param {number} code - HTTP 状态码
 * @returns {Object} 响应对象
 */
export function errorResponse(error, code = 500) {
  return {
    ...createBaseResponse(false, code),
    error: normalizeErrorMessage(error),
  };
}

/**
 * 根据错误类型映射响应
 * @param {Error} error - 错误对象
 * @param {Object} context - 上下文信息
 * @returns {Object} 响应对象
 */
export function mapErrorResponse(error, context = {}) {
  const errorCode =
    error && typeof error === "object" ? error.code : undefined;

  // 检查错误码映射
  if (errorCode && ERROR_CODE_MAP[errorCode]) {
    const { code, message } = ERROR_CODE_MAP[errorCode];
    return {
      ...errorResponse(message, code),
      ...context,
    };
  }

  // 检查 HTTP 响应错误
  if (error.response?.status) {
    return {
      ...errorResponse(`HTTP ${error.response.status}`, error.response.status),
      ...context,
    };
  }

  // 默认错误
  return {
    ...errorResponse(error, 500),
    ...context,
  };
}

/**
 * 构建分页响应
 * @param {Array} data - 数据列表
 * @param {number} total - 总条数
 * @param {number} page - 当前页码
 * @param {number} pageSize - 每页大小
 * @returns {Object} 分页响应对象
 */
export function paginatedResponse(data, total, page = 1, pageSize = 10) {
  return {
    ...createBaseResponse(true, 200),
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
