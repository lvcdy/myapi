/**
 * 配置管理模块
 * 根据当前环境选择对应的配置
 */

import { developmentConfig } from "./development.js";
import { productionConfig } from "./production.js";
import { testConfig } from "./test.js";
import { validateConfig } from "../utils/configValidator.js";

const NODE_ENV = process.env.NODE_ENV || "development";

let envConfig;

switch (NODE_ENV) {
  case "production":
    envConfig = productionConfig;
    break;
  case "test":
    envConfig = testConfig;
    break;
  case "development":
  default:
    envConfig = developmentConfig;
    break;
}

// 验证配置
export const config = validateConfig(envConfig);

// 导出环境信息
export { NODE_ENV };
