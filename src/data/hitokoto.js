/**
 * 一言数据加载器 - 使用本地语句包
 * 数据来源: https://github.com/hitokoto-osc/sentences-bundle
 */

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SENTENCES_DIR = join(__dirname, 'sentences')

// 类型定义
export const hitokotoTypes = {
    'a': '动画',
    'b': '漫画',
    'c': '游戏',
    'd': '文学',
    'e': '原创',
    'f': '网络',
    'g': '其他',
    'h': '影视',
    'i': '诗词',
    'j': '网易云',
    'k': '哲学',
    'l': '抖机灵'
}

// 数据缓存
let hitokotoCache = {
    data: [],        // 所有数据
    byType: {},      // 按类型分组
    loaded: false
}

/**
 * 加载所有一言数据（同步加载，启动时执行）
 */
function loadAllData() {
    if (hitokotoCache.loaded) return

    console.log('📥 正在加载本地一言数据...')

    const allData = []
    const byType = {}

    for (const type of Object.keys(hitokotoTypes)) {
        try {
            const filePath = join(SENTENCES_DIR, `${type}.json`)
            const content = readFileSync(filePath, 'utf-8')
            const data = JSON.parse(content)
            byType[type] = data
            allData.push(...data)
        } catch (err) {
            console.warn(`⚠️ 加载类型 ${type} 失败:`, err.message)
            byType[type] = []
        }
    }

    hitokotoCache = {
        data: allData,
        byType,
        loaded: true
    }

    console.log(`✅ 一言数据加载完成，共 ${allData.length} 条`)
}

// 启动时加载数据
loadAllData()

/**
 * 确保数据已加载
 */
export function ensureLoaded() {
    if (!hitokotoCache.loaded) {
        loadAllData()
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
    const { types, minLength = 0, maxLength = Infinity } = options

    let candidates = []

    // 处理类型筛选
    if (types && types.length > 0) {
        const typeArray = Array.isArray(types) ? types : [types]
        for (const type of typeArray) {
            if (hitokotoCache.byType[type]) {
                candidates.push(...hitokotoCache.byType[type])
            }
        }
    } else {
        candidates = hitokotoCache.data
    }

    // 应用长度筛选
    if (minLength > 0 || maxLength < Infinity) {
        candidates = candidates.filter(item => {
            const len = item.length || item.hitokoto?.length || 0
            return len >= minLength && len <= maxLength
        })
    }

    if (candidates.length === 0) {
        return null
    }

    return candidates[Math.floor(Math.random() * candidates.length)]
}

/**
 * 获取统计信息
 * @returns {Object}
 */
export function getStats() {
    const types = Object.entries(hitokotoTypes).map(([key, name]) => ({
        key,
        name,
        count: hitokotoCache.byType[key]?.length || 0
    }))

    return {
        total: hitokotoCache.data.length,
        types
    }
}
