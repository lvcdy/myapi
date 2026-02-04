# 第一阶段：依赖构建
FROM node:20-alpine AS builder

# 启用 corepack 并准备 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖声明文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 清理 pnpm 缓存
RUN pnpm store prune

# 第二阶段：运行镜像
FROM node:20-alpine

# 启用 corepack
RUN corepack enable

WORKDIR /app

# 仅从构建阶段复制必要的文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 复制源码
COPY src ./src
COPY index.js ./

# 创建非 root 用户以提升安全性
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "index.js"]