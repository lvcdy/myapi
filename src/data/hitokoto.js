/**
 * 一言数据加载器 - 使用本地语句包
 * 数据来源: https://github.com/hitokoto-osc/sentences-bundle
 *
 * 支持两种加载模式:
 * 1. compact 模式: 从 sentences.compact.json 单文件加载（容器/生产环境，更快）
 * 2. 分文件模式: 从 sentences/*.json 逐个加载（开发环境回退）
 */

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPACT_FILE = join(__dirname, "sentences.compact.json");
const SENTENCES_DIR = join(__dirname, "sentences");

// compact 字段 → 标准字段映射
const FIELD_MAP = {
  i: "id",
  u: "uuid",
  h: "hitokoto",
  t: "type",
  f: "from",
  w: "from_who",
  c: "creator",
  l: "length",
};

// 类型定义
export const hitokotoTypes = {
  a: "动画",
  b: "漫画",
  c: "游戏",
  d: "文学",
  e: "原创",
  f: "网络",
  g: "其他",
  h: "影视",
  i: "诗词",
  j: "网易云",
  k: "哲学",
  l: "抖机灵",
};

// 数据缓存
let hitokotoCache = {
  data: [], // 所有数据
  byType: {}, // 按类型分组
  loaded: false,
};

/**
 * 将 compact 格式记录展开为标准格式
 */
function expandCompact(item) {
  const result = {};
  for (const [short, full] of Object.entries(FIELD_MAP)) {
    result[full] = item[short] ?? null;
  }
  return result;
}

/**
 * 从 compact 单文件加载（更快，单次 IO + 单次 JSON.parse）
 */
function loadFromCompact() {
  const content = readFileSync(COMPACT_FILE, "utf-8");
  const { sentences } = JSON.parse(content);

  const allData = [];
  const byType = {};

  // 预初始化类型桶
  for (const type of Object.keys(hitokotoTypes)) {
    byType[type] = [];
  }

  for (const raw of sentences) {
    const item = expandCompact(raw);
    allData.push(item);
    if (byType[item.type]) {
      byType[item.type].push(item);
    }
  }

  return { allData, byType };
}

/**
 * 从分散的 JSON 文件逐个加载（回退方案）
 */
function loadFromFiles() {
  const allData = [];
  const byType = {};

  for (const type of Object.keys(hitokotoTypes)) {
    try {
      const filePath = join(SENTENCES_DIR, `${type}.json`);
      const content = readFileSync(filePath, "utf-8");
      const data = JSON.parse(content);
      byType[type] = data;
      allData.push(...data);
    } catch (err) {
      console.warn(`⚠️ 加载类型 ${type} 失败:`, err.message);
      byType[type] = [];
    }
  }

  return { allData, byType };
}

/**
 * 加载所有一言数据（同步加载，启动时执行）
 */
function loadAllData() {
  if (hitokotoCache.loaded) return;

  const start = performance.now();
  console.log("📥 正在加载本地一言数据...");

  // 优先使用 compact 模式（单文件 IO，启动更快）
  const useCompact = existsSync(COMPACT_FILE);
  const { allData, byType } = useCompact ? loadFromCompact() : loadFromFiles();

  hitokotoCache = { data: allData, byType, loaded: true };

  const ms = (performance.now() - start).toFixed(1);
  console.log(
    `✅ 一言数据加载完成，共 ${allData.length} 条 (${useCompact ? "compact" : "files"} 模式, ${ms}ms)`
  );
}

// 延迟加载数据，首次请求时加载
// 启动时不立即加载，而是在首次调用ensureLoaded时加载

/**
 * 确保数据已加载
 */
export function ensureLoaded() {
  if (!hitokotoCache.loaded) {
    loadAllData();
  }
}

/**
 * 获取随机一言
 * @param {Object} options - 筛选选项
 * @param {string|string[]} options.types - 类型筛选（支持多个）
 * @param {number} options.minLength - 最小长度
 * @param {number} options.maxLength - 最大长度
 * @returns {Object|null}
 */
export function getRandomHitokoto(options = {}) {
  const { types, minLength = 0, maxLength = Infinity } = options;

  let candidates = [];

  // 处理类型筛选
  if (types && types.length > 0) {
    const typeArray = Array.isArray(types) ? types : [types];
    for (const type of typeArray) {
      if (hitokotoCache.byType[type]) {
        candidates.push(...hitokotoCache.byType[type]);
      }
    }
  } else {
    candidates = hitokotoCache.data;
  }

  // 应用长度筛选
  if (minLength > 0 || maxLength < Infinity) {
    candidates = candidates.filter((item) => {
      const len = item.length || item.hitokoto?.length || 0;
      return len >= minLength && len <= maxLength;
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * 获取统计信息
 * @returns {Object}
 */
export function getStats() {
  const types = Object.entries(hitokotoTypes).map(([key, name]) => ({
    key,
    name,
    count: hitokotoCache.byType[key]?.length || 0,
  }));

  return {
    total: hitokotoCache.data.length,
    types,
  };
}
