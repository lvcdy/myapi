# MyAPI Dockerfile - 版本 1.1.0
# 优化版Dockerfile - 减小镜像大小，提高安全性

# 第一阶段：依赖构建
FROM node:25-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制依赖声明文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖，使用严格的冻结锁文件
RUN pnpm install --prod --frozen-lockfile --ignore-scripts && \
    pnpm store prune && \
    rm -rf /root/.local/share/pnpm

# 第二阶段：最终运行时
FROM node:25-alpine

# 设置环境变量与安全加固
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=128 --disable-warning=ExperimentalWarning" \
    NODE_NO_WARNINGS=1

WORKDIR /app

# 创建非 root 用户并设置文件权限
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 从构建阶段复制优化后的依赖
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# 复制应用源代码
COPY --chown=nodejs:nodejs index.js ./index.js
COPY --chown=nodejs:nodejs src ./src/
COPY --chown=nodejs:nodejs public ./public/

# 创建必要的目录
RUN mkdir -p /app/logs && \
    chown -R nodejs:nodejs /app

# 切换到非 root 用户
USER nodejs

EXPOSE 3000

# 标签镜像版本
LABEL version="1.1.0"
LABEL maintainer="myapi"
LABEL description="一言 API - 提供随机句子和可用性检测"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 启动应用
CMD ["node", "index.js"]