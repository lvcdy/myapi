# MyAPI Dockerfile - 版本 1.2.0
# 超轻量级优化版 - 最小化镜像大小和安全性增强

# 构建阶段
FROM node:25-alpine AS builder

ENV PNPM_HOME=/root/.pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

# 安装 pnpm 并清理 npm 缓存
RUN npm install -g pnpm && \
    npm cache clean --force

# 复制依赖声明文件
COPY package.json pnpm-lock.yaml ./

# 安装生产依赖（严格冻结模式）
RUN pnpm install --prod --frozen-lockfile --ignore-scripts && \
    pnpm store prune

# 最终运行时阶段
FROM node:25-alpine

ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=64" \
    NODE_NO_WARNINGS=1

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# 从构建阶段复制依赖和应用代码
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --chown=nodejs:nodejs index.js ./
COPY --chown=nodejs:nodejs src ./src/

# 切换到非 root 用户
USER nodejs

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if(r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "index.js"]

# 标签镜像版本
LABEL version="1.1.0"
LABEL maintainer="myapi"
LABEL description="一言 API - 提供随机句子和可用性检测"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 启动应用
CMD ["node", "index.js"]