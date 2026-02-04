FROM node:20-alpine

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖文件并安装
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile

# 复制源码
COPY . .

EXPOSE 3000
CMD ["pnpm", "start"]