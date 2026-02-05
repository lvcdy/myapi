/**
 * 项目 Favicon 处理器
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public')
const CACHE_TIME = 'public, max-age=86400'
const DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#6366f1" width="100" height="100"/><text x="50" y="70" font-size="60" font-weight="bold" fill="white" text-anchor="middle">Y</text></svg>'

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
export const handleAppleTouchIcon = serveFavicon('image/svg+xml; charset=utf-8')
