# MyAPI - Web Tools API

一个自托管的现代化网站工具箱，提供可用性检测、图标抓取和一言服务。

## 功能

- 网站可用性检测
- 网站图标获取
- 一言 API
- 健康检查
- 运行统计
- Docker 部署

## 技术栈

- Node.js 18+
- Hono
- Axios
- pnpm
- Docker

## 快速开始

### 本地运行

```bash
pnpm install
pnpm dev
```

### 生产运行

```bash
pnpm start
```

### Docker

```bash
docker build -t myapi:latest .
docker run -d -p 3000:3000 --name myapi myapi:latest
```

### Docker Compose

```bash
docker compose up -d
```

## API

### 健康检查

```http
GET /health
```

### 可用性检测

```http
GET /uptime?url=https://example.com
```

### 网站图标获取

```http
GET /favicon?url=https://github.com
GET /favicon?url=https://github.com&strict=1
```

### 一言

```http
GET /hitokoto
GET /hitokoto?c=a&encode=json
GET /hitokoto?encode=text
GET /hitokoto?encode=js&select=.hitokoto
```

### 一言类型

```http
GET /hitokoto/types
```

### 运行统计

```http
GET /stats
```

说明：
- 如果未设置 `STATS_TOKEN`，`/stats` 可直接访问。
- 如果设置了 `STATS_TOKEN`，请求 `Authorization: Bearer <token>`。

## 环境变量

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `3000` | 服务监听端口 |
| `TIMEOUT` | `8000` | 请求超时时间，毫秒 |
| `STATS_TOKEN` | 空 | 统计接口的 Bearer Token |
| `LOG_LEVEL` | `info` | 日志级别 |

## 版本

当前版本：`1.11.0`

## 说明

- 项目使用 `pnpm` 作为默认包管理器，仓库已配置 `packageManager`。
- Docker 镜像使用 `node:alpine` 和固定版本的 `pnpm`。

## 致谢

- 数据来源于 [hitokoto.cn](https://hitokoto.cn)
- Web 框架使用 [Hono](https://hono.dev)
