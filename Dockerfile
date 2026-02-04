# 第一阶段：依赖构建
FROM node:20-alpine AS builder

# 启用 corepack 并准备 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖声明文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖，跳过脚本执行
RUN pnpm install --prod --frozen-lockfile --ignore-scripts \
    && pnpm store prune \
    && rm -rf /root/.local/share/pnpm

# 第二阶段：解压数据
FROM alpine:latest AS data-extractor

RUN apk add --no-cache tar

WORKDIR /data
COPY src/data/sentences.tar.gz ./
RUN tar -xzf sentences.tar.gz && rm sentences.tar.gz

# 第三阶段：准备阶段
FROM node:20-alpine AS prepare

WORKDIR /app

# 从构建阶段复制依赖
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY index.js ./

# 从数据提取阶段复制解压后的数据
COPY --from=data-extractor /data/src/data/sentences ./src/data/sentences

# 清理不必要的文件以减小镜像大小
RUN rm -rf /var/cache/apk/* \
    && rm -rf /tmp/* \
    && find /app/node_modules -name "*.md" -delete \
    && find /app/node_modules -name "*.ts" -delete \
    && find /app/node_modules -name "LICENSE*" -delete \
    && find /app/node_modules -name "*.map" -delete \
    && find /app/node_modules -type d -name "test" -exec rm -rf {} + 2>/dev/null || true \
    && find /app/node_modules -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true \
    && find /app/node_modules -type d -name "docs" -exec rm -rf {} + 2>/dev/null || true \
    && find /app/node_modules -type d -name "example*" -exec rm -rf {} + 2>/dev/null || true

# 第四阶段：Distroless 运行时（超小镜像）
FROM gcr.io/distroless/nodejs20-debian12:nonroot

ENV NODE_ENV=production

WORKDIR /app

# 复制所有应用文件
COPY --from=prepare /app /app

EXPOSE 3000

CMD ["index.js"]