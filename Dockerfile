# MyAPI Dockerfile - 版本 2.0.0
# 超轻量级优化版 - 最小化镜像大小和启动时间

# ── 构建阶段: 仅安装生产依赖 ──
FROM node:25-alpine AS builder

WORKDIR /app

# 安装 pnpm 并清理 npm 缓存
RUN npm install -g pnpm --no-fund --no-audit && npm cache clean --force

COPY package.json pnpm-lock.yaml ./

# 安装生产依赖，跳过脚本和可选依赖
RUN pnpm install --prod --frozen-lockfile --ignore-scripts && \
    pnpm store prune && \
    rm -rf /root/.cache /root/.local/share/pnpm/store

# ── 运行时阶段: 极简镜像 ──
FROM node:25-alpine

ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=64" \
    NODE_NO_WARNINGS=1

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# 复制生产依赖
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# 复制应用代码
COPY --chown=nodejs:nodejs index.js ./
COPY --chown=nodejs:nodejs public ./public/

# 复制 src（.dockerignore 已排除 src/data/sentences/，仅含 compact 格式）
COPY --chown=nodejs:nodejs src ./src/

USER nodejs

EXPOSE 3000

LABEL version="2.0.0" \
    maintainer="myapi" \
    description="一言 API - 提供随机句子和可用性检测"

# 健康检查: 使用 wget 替代 node（避免为检查启动额外 Node 进程）
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO /dev/null http://localhost:3000/health || exit 1

CMD ["node", "index.js"]