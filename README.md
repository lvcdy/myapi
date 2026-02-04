# 🛠️ Web Tools API

自托管的简易网站工具箱，已封装为 Docker 镜像。

## 功能特性

- **网站可用性检测** - 检查目标网站在线状态及响应延迟
- **网站图标获取** - 自动提取网站的 Favicon
- **跨域支持** - 已启用 CORS，支持跨域请求
- **灵活配置** - 支持通过环境变量自定义端口和超时时间
- **详细错误处理** - 区分不同类型的请求失败原因

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
npm run dev
```

自动监听文件变化并重启服务。

### 生产模式

```bash
npm start
```

## 环境变量

| 变量 | 默认值 | 说明 |
|-----|------|------|
| PORT | 3000 | 服务器监听端口 |
| TIMEOUT | 8000 | 请求超时时间（毫秒） |

**配置示例：**
```bash
PORT=8080 TIMEOUT=5000 npm start
```

## API 文档

### 主页
```
GET /
```
返回 API 说明文档，包含所有可用端点的使用方法。

### 网站可用性检测
```
GET /uptime?url=<url>
```

**参数：**
- `url` (必须) - 目标网站 URL，需包含协议（http/https）

**响应示例（成功）：**
```json
{
  "status": "up",
  "code": 200,
  "ms": 234
}
```

**响应示例（失败）：**
```json
{
  "status": "down",
  "code": 504,
  "ms": 8001,
  "error": "Request timeout"
}
```

**错误码说明：**
| 状态码 | 说明 |
|------|------|
| 200 | 网站在线 |
| 400 | URL 格式错误或 DNS 解析失败 |
| 503 | 连接被拒绝 |
| 504 | 请求超时 |
| 5xx | 其他错误 |

### 网站图标获取
```
GET /favicon?url=<url>
```

**参数：**
- `url` (必须) - 目标网站 URL，需包含协议（http/https）

**功能：**
- 自动提取网站域名并通过 Google Favicon API 获取图标
- 返回 128×128 像素的 PNG 图标
- 若 URL 格式错误则返回 400 错误

## Docker 使用

```bash
# 构建镜像
docker build -t myapi .

# 运行容器
docker run -p 3000:3000 myapi

# 使用自定义端口和超时时间
docker run -p 8080:3000 -e PORT=8080 -e TIMEOUT=5000 myapi
```

## 请求示例

### 使用 cURL

```bash
# 检测 Google 在线状态
curl "http://localhost:3000/uptime?url=https://google.com"

# 获取 GitHub 的 Favicon
curl "http://localhost:3000/favicon?url=https://github.com"
```

### 使用 JavaScript

```javascript
// 检测网站可用性
const response = await fetch('/uptime?url=https://example.com');
const data = await response.json();
console.log(data);

// 获取网站图标
const iconUrl = await fetch('/favicon?url=https://example.com')
  .then(r => r.url); // 获取重定向后的真实 URL
```

## 依赖

- **Hono** - 轻量级 Web 框架
- **@hono/node-server** - Node.js 服务器适配器
- **axios** - HTTP 请求库

## 技术栈

- Node.js (ES Module)
- Hono 4.6.14+
- Tailwind CSS (UI)

## 许可证

MIT
