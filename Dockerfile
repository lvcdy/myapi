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

# 第二阶段：最小化运行镜像
FROM node:20-alpine AS runner

# 设置环境变量
ENV NODE_ENV=production

WORKDIR /app

# 仅从构建阶段复制必要的文件
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY index.js ./

# 清理不必要的文件以减小镜像大小
RUN rm -rf /var/cache/apk/* \
    && rm -rf /tmp/* \
    && find /app/node_modules -name "*.md" -delete \
    && find /app/node_modules -name "*.ts" -delete \
    && find /app/node_modules -name "LICENSE*" -delete \
    && find /app/node_modules -name "*.map" -delete \
    && find /app/node_modules -type d -name "test" -exec rm -rf {} + 2>/dev/null || true \
    && find /app/node_modules -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true \
    && find /app/node_modules -type d -name "docs" -exec rm -rf {} + 2>/dev/null || true

# 创建非 root 用户以提升安全性
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001 -G nodejs \
    && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "index.js"]