/**
 * 项目 Favicon 处理器
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public')
const CACHE_TIME = 'public, max-age=86400'
const DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#67e8f9"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs><rect width="256" height="256" fill="url(#bg)" rx="48"/><path d="M52 128L92 88v14L66 128l26 26v14Z" fill="url(#a)" opacity=".9"/><path d="M204 128l-40-40v14l26 26-26 26v14Z" fill="url(#a)" opacity=".9"/><path d="M140 72l-28 60h20l-16 52 36-66h-22Z" fill="url(#b)"/></svg>'

let faviconCache = null

function getFavicon() {
    if (!faviconCache) {
        try {
            faviconCache = fs.readFileSync(path.join(publicDir, 'favicon.svg'))
        } catch (err) {
            console.error('读取 favicon.svg 失败:', err.message)
            faviconCache = Buffer.from(DEFAULT_SVG)
        }
    }
    return faviconCache
}

const serveFavicon = (contentType) => (c) => c.body(getFavicon(), 200, {
    'Content-Type': contentType,
    'Cache-Control': CACHE_TIME
})

export const handleFaviconSvg = serveFavicon('image/svg+xml; charset=utf-8')
export const handleFaviconIco = serveFavicon('image/x-icon')
export const handleAppleTouchIcon = serveFavicon('image/png')
