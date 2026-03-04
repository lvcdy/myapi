/**
 * 一言处理器
 * API 兼容 hitokoto.cn 官方接口
 * 文档: https://developer.hitokoto.cn/sentence/
 */

import { ensureLoaded, getRandomHitokoto, getStats, hitokotoTypes } from '../data/hitokoto.js'

/**
 * 验证 JSONP 回调函数名是否安全
 * @param {string} name - 回调函数名
 * @returns {boolean}
 */
function isSafeCallbackName(name) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(name)
}

/**
 * 转义用于 JS 字符串的特殊字符，防止 XSS
 * @param {string} str - 原始字符串
 * @returns {string}
 */
function escapeForJs(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        .replace(/</g, '\\x3c').replace(/>/g, '\\x3e')
}

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
    const rawMaxLength = parseInt(c.req.query('max_length'))
    const maxLength = isNaN(rawMaxLength) ? Infinity : rawMaxLength

    // 过滤有效类型
    const validTypes = types.filter(t => hitokotoTypes[t])

    // 获取随机一言
    const item = getRandomHitokoto({
        types: validTypes.length > 0 ? validTypes : null,
        minLength,
        maxLength
    })

    if (!item) {
        return c.json({
            error: 'no data available',
            message: '无法找到符合条件的句子',
            parameters: {
                types: validTypes.length > 0 ? validTypes : '全部',
                minLength,
                maxLength: maxLength === Infinity ? '无限制' : maxLength
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
                // JSONP 模式 - 验证回调函数名防止 XSS
                if (!isSafeCallbackName(callback)) {
                    return c.json({ error: 'invalid callback name' }, 400)
                }
                return c.text(`${callback}(${JSON.stringify(item)});`, 200, {
                    'Content-Type': 'application/javascript; charset=utf-8'
                })
            } else {
                // 同步 DOM 操作模式 - 转义内容防止 XSS
                const safeSelect = escapeForJs(select)
                const safeText = escapeForJs(item.hitokoto)
                const jsCode = `(function(){var e=document.querySelector('${safeSelect}');if(e){e.innerText='${safeText}';}})()`
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
