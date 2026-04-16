# MyAPI - Web Tools API

一个自托管的现代化网站工具箱，提供网站检测、图标获取、一言等实用功能。

## 🚀 功能特性

- **网站可用性检测** - 实时监测网站在线状态和响应时间
- **网站图标获取** - 智能提取网站Favicon图标
- **一言API** - 随机语录，支持12种内容类型
- **健康检查** - 服务状态监控
- **CORS支持** - 跨域资源共享
- **Docker就绪** - 容器化部署支持

## 📦 技术栈

- **Node.js** (>=18.0.0)
- **Hono** - 高性能Web框架
- **Axios** - HTTP客户端
- **ES Modules** - 现代JavaScript模块系统
- **Docker** - 容器化部署

## 🔧 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产模式启动
pnpm start
```

### Docker部署

```bash
# 构建镜像
docker build -t myapi:latest .

# 运行容器
docker run -d -p 3000:3000 --name myapi myapi:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## 🌐 API接口

### 健康检查

```
GET /health
```

### 网站可用性检测

```
GET /uptime?url=https://example.com
```

### 网站图标获取

```
GET /favicon?url=https://github.com
# 严格 API 模式（失败返回 404 JSON，而不是兜底图标）
GET /favicon?url=https://github.com&strict=1
```

### 一言API

```
GET /hitokoto
GET /hitokoto?c=a&encode=json
```

## ⚙️ 环境变量

| 变量名  | 默认值 | 描述               |
| ------- | ------ | ------------------ |
| PORT    | 3000   | 服务监听端口       |
| TIMEOUT | 8000   | 请求超时时间(毫秒) |

## 📈 版本历史

### v1.0.1 (最新)

- 移除主页随机背景壁纸功能
- 优化Docker镜像构建流程
- 更新版本标签和元数据

### v1.0.0

- 初始版本发布
- 核心功能实现

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 🙏 致谢

- 数据来源于 [hitokoto.cn](https://hitokoto.cn)
- 使用 [Hono](https://hono.dev) Web框架
