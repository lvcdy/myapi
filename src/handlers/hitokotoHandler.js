/**
 * 一言处理器
 * API 兼容 hitokoto.cn 官方接口
 * 文档: https://developer.hitokoto.cn/sentence/
 */

import { ensureLoaded, getRandomHitokoto, getStats, hitokotoTypes } from '../data/hitokoto.js'

/**
 * 处理一言请求
 * 支持参数:
 * - c: 句子类型，支持多个 (?c=a&c=c)
 * - encode: 返回编码 (json/text/js)
 * - charset: 字符集 (utf-8/gbk，目前仅支持 utf-8)
 * - callback: JSONP 回调函数名
 * - select: JS 选择器（配合 encode=js）
 * - min_length: 最小长度
 * - max_length: 最大长度
 * 
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export function handleHitokoto(c) {
    // 确保数据已加载
    ensureLoaded()

    // 获取类型参数（支持多个: ?c=a&c=c）
    const types = c.req.queries('c') || []
    const encode = c.req.query('encode') || 'json'
    const callback = c.req.query('callback')
    const select = c.req.query('select') || '.hitokoto'
    const minLength = parseInt(c.req.query('min_length')) || 0
    const maxLength = parseInt(c.req.query('max_length')) || Infinity

    // 验证类型参数
    for (const type of types) {
        if (!hitokotoTypes[type]) {
            // 按官方文档，无效类型作为动画(a)处理
            // 这里我们选择忽略无效类型
        }
    }

    // 过滤有效类型
    const validTypes = types.filter(t => hitokotoTypes[t])

    // 获取随机一言
    const item = getRandomHitokoto({
        types: validTypes.length > 0 ? validTypes : null,
        minLength,
        maxLength: isNaN(maxLength) ? Infinity : maxLength
    })

    if (!item) {
        return c.json({
            error: 'no data available',
            message: '无法找到符合条件的句子',
            parameters: {
                types: validTypes.length > 0 ? validTypes : '全部',
                minLength,
                maxLength: isNaN(maxLength) ? '无限制' : maxLength
            },
            hint: '请检查参数是否过于严格（如 min_length/max_length），或类型参数是否正确'
        }, 503)
    }

    // 根据编码格式返回
    switch (encode) {
        case 'text':
            return c.text(item.hitokoto, 200, {
                'Content-Type': 'text/plain; charset=utf-8'
            })

        case 'js':
            if (callback) {
                // JSONP 模式
                return c.text(`${callback}(${JSON.stringify(item)});`, 200, {
                    'Content-Type': 'application/javascript; charset=utf-8'
                })
            } else {
                // 同步 DOM 操作模式
                const jsCode = `(function(){var e=document.querySelector('${select}');if(e){e.innerText='${item.hitokoto.replace(/'/g, "\\'")}';}})()`
                return c.text(jsCode, 200, {
                    'Content-Type': 'application/javascript; charset=utf-8'
                })
            }

        default:
            return c.json(item)
    }
}

/**
 * 获取一言类型列表
 * @param {Context} c - Hono 上下文对象
 * @returns {Response} API 响应
 */
export function handleHitokotoTypes(c) {
    ensureLoaded()
    return c.json(getStats())
}
