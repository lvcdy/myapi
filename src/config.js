/**
 * 应用配置模块
 */

export const config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    TIMEOUT: parseInt(process.env.TIMEOUT || '8000', 10)
}
