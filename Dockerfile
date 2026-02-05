# 优化版Dockerfile - 减小镜像大小
# 使用更精简的基础镜像和优化的构建流程

# 第一阶段：依赖构建（使用更小的基础镜像）
FROM node:20-alpine AS builder

# 启用 corepack 并准备 pnpm
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    # 清理apk缓存
    rm -rf /var/cache/apk/*

WORKDIR /app

# 复制依赖声明文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖，跳过脚本执行，使用更多优化选项
RUN pnpm install --prod --frozen-lockfile --ignore-scripts \
    --no-optional \
    --prefer-offline \
    && pnpm store prune \
    # 清理pnpm缓存和临时文件
    && rm -rf /root/.local/share/pnpm \
    && npm cache clean --force

# 第二阶段：数据处理（合并到同一阶段减少层数）
FROM alpine:3.18 AS data-processor

# 安装必要工具并立即清理缓存
RUN apk add --no-cache tar gzip \
    && rm -rf /var/cache/apk/*

WORKDIR /data
COPY src/data/sentences.tar.gz ./
# 解压后立即删除压缩文件
RUN tar -xzf sentences.tar.gz \
    && rm sentences.tar.gz

# 第三阶段：最终运行时（使用标准Node.js Alpine镜像）
FROM node:20-alpine

# 设置环境变量
ENV NODE_ENV=production \
    # 减少Node.js内存使用
    NODE_OPTIONS="--max-old-space-size=128"

WORKDIR /app

# 从构建阶段复制优化后的依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=data-processor /data/src/data/sentences ./src/data/sentences

# 复制应用源代码
COPY index.js ./index.js
COPY src ./src/

# 创建必要的目录
RUN mkdir -p /app/logs

EXPOSE 3000

# 启动应用
CMD ["node", "index.js"]