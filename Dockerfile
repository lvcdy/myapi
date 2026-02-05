# MyAPI Dockerfile - 版本 1.0.1
# 优化版Dockerfile - 减小镜像大小

# 第一阶段：依赖构建
FROM node:20-alpine AS builder

# 启用 corepack 并准备 pnpm
RUN corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖声明文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile --ignore-scripts && \
    pnpm store prune

# 第二阶段：最终运行时
FROM node:20-alpine

# 设置环境变量
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=128"

WORKDIR /app

# 从构建阶段复制优化后的依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 复制应用源代码
COPY index.js ./index.js
COPY src ./src/

# 创建必要的目录
RUN mkdir -p /app/logs

EXPOSE 3000

# 标签镜像版本
LABEL version="1.0.1"
LABEL maintainer="myapi"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 启动应用
CMD ["node", "index.js"]