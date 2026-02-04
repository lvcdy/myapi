/**
 * 应用配置模块
 */

export const config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    TIMEOUT: parseInt(process.env.TIMEOUT || '8000', 10),
    FAVICON_SIZE: 128,
    FAVICON_API: 'https://www.google.com/s2/favicons'
}
