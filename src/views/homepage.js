/**
 * 主页 HTML 视图 - 零外部依赖，纯 CSS 现代设计
 */

let cachedHtml = null

function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

export function getHomepageHtml(metadata = {}) {
    if (cachedHtml) return cachedHtml

    const defaultApiRoutes = [
        { method: 'GET', path: '/health', description: '健康检查' },
        { method: 'GET', path: '/stats', description: '统计（需认证）' },
        { method: 'GET', path: '/uptime', description: '可用性检测' },
        { method: 'GET', path: '/favicon', description: '网站图标' },
        { method: 'GET', path: '/hitokoto', description: '一言' },
        { method: 'GET', path: '/hitokoto/types', description: '一言类型' }
    ]

    const apiRoutes = Array.isArray(metadata.apiRoutes) && metadata.apiRoutes.length > 0
        ? metadata.apiRoutes
        : defaultApiRoutes
    const trackedPaths = Array.isArray(metadata.trackedPaths) && metadata.trackedPaths.length > 0
        ? metadata.trackedPaths
        : ['/uptime', '/favicon', '/hitokoto']

    const apiRowsHtml = apiRoutes.map((route) => {
        const method = escapeHtml(route.method || 'GET')
        const path = escapeHtml(route.path || '/')
        const description = escapeHtml(route.description || '-')
        return `<tr><td><span class="api-method">${method}</span></td><td><code>${path}</code></td><td>${description}</td></tr>`
    }).join('')

    const htmlStr = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Web Tools API - 一言、网站可用性检测、网站图标获取工具集">
    <meta name="theme-color" content="#0f172a">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <title>Web Tools API</title>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg-primary: #0b0f1a;
            --bg-card: rgba(15, 23, 42, 0.65);
            --bg-card-hover: rgba(15, 23, 42, 0.85);
            --border: rgba(56, 189, 248, 0.1);
            --border-hover: rgba(6, 182, 212, 0.4);
            --cyan: #22d3ee;
            --cyan-dim: #0891b2;
            --gold: #fbbf24;
            --gold-dim: #f59e0b;
            --text: #e2e8f0;
            --text-dim: #94a3b8;
            --text-bright: #f1f5f9;
            --radius: 16px;
            --radius-lg: 24px;
            --mono: 'SF Mono', 'Cascadia Code', 'Fira Code', 'JetBrains Mono', ui-monospace, monospace;
            --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: var(--sans);
            background: var(--bg-primary);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* ====== 背景效果 ====== */
        .bg-mesh {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background:
                radial-gradient(ellipse 600px 400px at 15% 20%, rgba(6, 182, 212, 0.07) 0%, transparent 70%),
                radial-gradient(ellipse 500px 500px at 85% 60%, rgba(99, 102, 241, 0.06) 0%, transparent 70%),
                radial-gradient(ellipse 400px 300px at 50% 90%, rgba(251, 191, 36, 0.04) 0%, transparent 70%);
        }
        .grid-lines {
            position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
            background-image:
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
            background-size: 60px 60px;
        }

        /* ====== 布局 ====== */
        .wrapper { position: relative; z-index: 1; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        /* ====== Header ====== */
        header { padding: 80px 0 48px; text-align: center; }
        .logo-icon {
            display: inline-block; width: 56px; height: 56px; margin-bottom: 20px;
            border-radius: 14px; overflow: hidden;
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.2);
            animation: fadeIn 0.6s ease;
        }
        .logo-icon img { width: 100%; height: 100%; display: block; }

        h1 {
            font-size: clamp(2rem, 5vw, 3.2rem);
            font-weight: 800; letter-spacing: -0.03em;
            background: linear-gradient(135deg, var(--cyan) 0%, #67e8f9 40%, var(--gold) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; line-height: 1.15;
            animation: fadeIn 0.6s ease 0.1s both;
        }
        .subtitle {
            font-size: 1.05rem; color: var(--text-dim); max-width: 520px;
            margin: 16px auto 28px; line-height: 1.7;
            animation: fadeIn 0.6s ease 0.2s both;
        }
        .badges {
            display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
            animation: fadeIn 0.6s ease 0.3s both;
        }
        .badge {
            padding: 6px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: 600;
            border: 1px solid var(--border); color: var(--cyan);
            background: rgba(6, 182, 212, 0.06);
            transition: all 0.3s ease;
        }
        .badge:hover {
            border-color: var(--border-hover);
            background: rgba(6, 182, 212, 0.12);
            box-shadow: 0 0 16px rgba(6, 182, 212, 0.15);
        }

        /* ====== Section ====== */
        .section { margin-bottom: 64px; }
        .section-title {
            font-size: 1.5rem; font-weight: 700; color: var(--text-bright);
            margin-bottom: 8px; text-align: center;
        }
        .section-desc {
            font-size: 0.9rem; color: var(--text-dim); text-align: center; margin-bottom: 40px;
        }

        /* ====== 功能卡片 ====== */
        .card-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;
        }
        .card {
            background: var(--bg-card); border: 1px solid var(--border);
            border-radius: var(--radius-lg); padding: 32px;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            backdrop-filter: blur(12px);
        }
        .card:hover {
            background: var(--bg-card-hover); border-color: var(--border-hover);
            transform: translateY(-6px);
            box-shadow: 0 20px 50px -12px rgba(6, 182, 212, 0.12);
        }
        .card-icon {
            width: 48px; height: 48px; border-radius: 12px; display: flex;
            align-items: center; justify-content: center; font-size: 1.5rem;
            margin-bottom: 20px;
        }
        .card-icon.cyan { background: rgba(6, 182, 212, 0.12); }
        .card-icon.gold { background: rgba(251, 191, 36, 0.12); }
        .card-icon.violet { background: rgba(139, 92, 246, 0.12); }

        .card h3 {
            font-size: 1.1rem; font-weight: 700; color: var(--text-bright); margin-bottom: 8px;
        }
        .card p { font-size: 0.85rem; color: var(--text-dim); margin-bottom: 16px; line-height: 1.6; }
        .card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .card-tag {
            font-size: 0.7rem; padding: 3px 10px; border-radius: 999px;
            background: rgba(255,255,255,0.04); color: var(--text-dim);
            border: 1px solid rgba(255,255,255,0.06);
        }

        /* ====== 终端风格代码块 ====== */
        .terminal {
            background: rgba(2, 6, 23, 0.7); border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px; overflow: hidden; cursor: pointer;
            transition: all 0.3s ease;
        }
        .terminal:hover {
            border-color: rgba(6, 182, 212, 0.3);
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.08);
        }
        .terminal-bar {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 12px; background: rgba(255,255,255,0.03);
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .terminal-dot {
            width: 8px; height: 8px; border-radius: 50%;
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #eab308; }
        .dot-green { background: #22c55e; }
        .terminal-body {
            padding: 12px 16px; font-family: var(--mono); font-size: 0.78rem;
        }
        .terminal-body .prompt { color: var(--cyan); }
        .terminal-body .cmd { color: #e2e8f0; }
        .copy-hint {
            float: right; font-size: 0.65rem; color: var(--text-dim);
            font-family: var(--sans); opacity: 0;
            transition: opacity 0.2s;
        }
        .terminal:hover .copy-hint { opacity: 1; }

        /* ====== 一言预览 ====== */
        .hitokoto-preview {
            background: var(--bg-card); border: 1px solid var(--border);
            border-radius: var(--radius-lg); padding: 40px 32px; text-align: center;
            backdrop-filter: blur(12px); position: relative; overflow: hidden;
        }
        .hitokoto-preview::before {
            content: '\\201C'; position: absolute; top: 12px; left: 24px;
            font-size: 4rem; color: rgba(6, 182, 212, 0.08); font-family: Georgia, serif;
            line-height: 1;
        }
        .hitokoto-text {
            font-size: 1.15rem; color: var(--text-bright); line-height: 1.8;
            max-width: 600px; margin: 0 auto 12px;
            min-height: 1.8em;
            transition: opacity 0.4s ease;
        }
        .hitokoto-from {
            font-size: 0.85rem; color: var(--cyan-dim);
        }
        .hitokoto-actions { margin-top: 20px; }
        .btn-refresh {
            padding: 8px 24px; border-radius: 999px; border: 1px solid var(--border);
            background: rgba(6, 182, 212, 0.08); color: var(--cyan);
            font-size: 0.82rem; font-weight: 600; cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-refresh:hover {
            background: rgba(6, 182, 212, 0.16); border-color: var(--border-hover);
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
        }

        /* ====== 统计面板 ====== */
        .stats-panel {
            background: var(--bg-card); border: 1px solid var(--border);
            border-radius: var(--radius-lg); padding: 40px 32px;
            backdrop-filter: blur(12px);
        }
        .stats-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;
        }
        .stat-item {
            text-align: center; padding: 20px 12px; border-radius: var(--radius);
            background: rgba(6, 182, 212, 0.04); border: 1px solid rgba(6, 182, 212, 0.08);
            transition: all 0.3s ease;
        }
        .stat-item:hover {
            border-color: rgba(6, 182, 212, 0.2);
            background: rgba(6, 182, 212, 0.08);
        }
        .stat-value {
            font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em;
            background: linear-gradient(135deg, var(--cyan), var(--gold));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .stat-label { font-size: 0.78rem; color: var(--text-dim); margin-top: 6px; }

        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .detail-box {
            padding: 20px; border-radius: var(--radius);
            background: rgba(2, 6, 23, 0.4); border: 1px solid rgba(255,255,255,0.04);
        }
        .detail-title {
            font-size: 0.82rem; font-weight: 600; color: var(--text-dim); margin-bottom: 14px;
            display: flex; align-items: center; gap: 8px;
        }
        .detail-title .dot {
            width: 6px; height: 6px; border-radius: 50%; display: inline-block;
        }
        .detail-title .dot-cyan { background: var(--cyan); }
        .detail-title .dot-gold { background: var(--gold); }

        .bar-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 6px 0;
        }
        .bar-label { font-size: 0.8rem; color: var(--text-dim); font-weight: 500; }
        .bar-right { display: flex; align-items: center; gap: 10px; }
        .bar-track {
            width: 80px; height: 4px; background: rgba(255,255,255,0.06);
            border-radius: 2px; overflow: hidden;
        }
        .bar-fill-cyan {
            height: 100%; border-radius: 2px; transition: width 0.5s ease;
            background: linear-gradient(to right, var(--cyan-dim), var(--cyan));
        }
        .bar-fill-gold {
            height: 100%; border-radius: 2px; transition: width 0.5s ease;
            background: linear-gradient(to right, var(--gold-dim), var(--gold));
        }
        .bar-count { font-size: 0.78rem; font-weight: 700; color: var(--cyan); min-width: 28px; text-align: right; }
        .bar-count-gold { font-size: 0.78rem; font-weight: 700; color: var(--gold); min-width: 28px; text-align: right; }
        .rank-badge { font-size: 0.9rem; margin-right: 4px; }

        /* ====== API 列表 ====== */
        .api-table-wrap {
            background: var(--bg-card); border: 1px solid var(--border);
            border-radius: var(--radius-lg); padding: 16px;
            backdrop-filter: blur(12px); overflow-x: auto;
        }
        .api-table { width: 100%; border-collapse: collapse; min-width: 640px; }
        .api-table th, .api-table td {
            padding: 12px 14px; text-align: left; font-size: 0.84rem;
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .api-table th {
            color: var(--text-dim); font-weight: 600; font-size: 0.76rem;
            letter-spacing: 0.04em; text-transform: uppercase;
        }
        .api-table tbody tr:hover { background: rgba(6, 182, 212, 0.04); }
        .api-table tbody tr:last-child td { border-bottom: none; }
        .api-method {
            display: inline-block; min-width: 44px; text-align: center;
            padding: 3px 8px; border-radius: 999px; font-size: 0.68rem;
            font-weight: 700; color: var(--cyan);
            background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .api-table code { color: var(--text-bright); font-family: var(--mono); font-size: 0.8rem; }

        /* ====== Footer ====== */
        footer {
            padding: 32px 0; text-align: center;
            border-top: 1px solid rgba(255,255,255,0.04);
        }
        .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 10px; flex-wrap: wrap; }
        .footer-links a {
            font-size: 0.82rem; color: var(--text-dim); text-decoration: none;
            transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--cyan); }
        .footer-copy { font-size: 0.72rem; color: rgba(148, 163, 184, 0.5); }

        /* ====== Toast ====== */
        .toast {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9);
            background: rgba(6, 182, 212, 0.9); color: #fff; padding: 10px 24px;
            border-radius: 10px; font-size: 0.85rem; font-weight: 600; z-index: 1000;
            pointer-events: none; opacity: 0;
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;
        }
        .toast.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }

        /* ====== Animations ====== */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease both; }
        .fade-in-1 { animation-delay: 0.05s; }
        .fade-in-2 { animation-delay: 0.1s; }
        .fade-in-3 { animation-delay: 0.15s; }
        .fade-in-4 { animation-delay: 0.2s; }
        .fade-in-5 { animation-delay: 0.25s; }

        /* ====== Responsive ====== */
        @media (max-width: 768px) {
            header { padding: 56px 0 32px; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .detail-grid { grid-template-columns: 1fr; }
            .card-grid { grid-template-columns: 1fr; }
            .stat-value { font-size: 1.4rem; }
        }
    </style>
</head>
<body>
    <div class="bg-mesh"><\/div>
    <div class="grid-lines"><\/div>

    <div class="wrapper">
        <div class="container">
            <!-- Header -->
            <header>
                <div class="logo-icon"><img src="/favicon.svg" alt="Logo"><\/div>
                <h1>Web Tools API</h1>
                <p class="subtitle">轻量自托管工具箱 — 网站监测、图标获取、一言语录</p>
                <div class="badges">
                    <span class="badge">⚡ 极速响应</span>
                    <span class="badge">🔒 安全可靠</span>
                    <span class="badge">📦 Docker 就绪</span>
                    <span class="badge">🚀 零依赖前端</span>
                </div>
            </header>

            <!-- 功能卡片 -->
            <section class="section">
                <h2 class="section-title">核心功能</h2>
                <p class="section-desc">三个精炼接口，覆盖日常开发所需</p>
                <div class="card-grid">
                    <div class="card fade-in fade-in-1">
                        <div class="card-icon cyan">📡<\/div>
                        <h3>网站可用性检测</h3>
                        <p>实时监测网站在线状态，获取精准的响应时间与状态码</p>
                        <div class="terminal" onclick="copyCode(this)">
                            <div class="terminal-bar">
                                <span class="terminal-dot dot-red"><\/span>
                                <span class="terminal-dot dot-yellow"><\/span>
                                <span class="terminal-dot dot-green"><\/span>
                                <span class="copy-hint">点击复制<\/span>
                            <\/div>
                            <div class="terminal-body">
                                <span class="prompt">GET </span><span class="cmd">/uptime?url=https://google.com</span>
                            <\/div>
                        <\/div>
                        <div class="card-tags">
                            <span class="card-tag">HTTP/HTTPS<\/span>
                            <span class="card-tag">超时保护<\/span>
                            <span class="card-tag">详细报告<\/span>
                        <\/div>
                    <\/div>

                    <div class="card fade-in fade-in-2">
                        <div class="card-icon gold">🖼️<\/div>
                        <h3>网站图标获取</h3>
                        <p>智能解析网站元数据，自动提取高清 Favicon 图标</p>
                        <div class="terminal" onclick="copyCode(this)">
                            <div class="terminal-bar">
                                <span class="terminal-dot dot-red"><\/span>
                                <span class="terminal-dot dot-yellow"><\/span>
                                <span class="terminal-dot dot-green"><\/span>
                                <span class="copy-hint">点击复制<\/span>
                            <\/div>
                            <div class="terminal-body">
                                <span class="prompt">GET </span><span class="cmd">/favicon?url=https://github.com</span>
                            <\/div>
                        <\/div>
                        <div class="card-tags">
                            <span class="card-tag">自动降级<\/span>
                            <span class="card-tag">多格式<\/span>
                            <span class="card-tag">智能缓存<\/span>
                        <\/div>
                    <\/div>

                    <div class="card fade-in fade-in-3">
                        <div class="card-icon violet">💬<\/div>
                        <h3>一言 API</h3>
                        <p>7000+ 条精选语录，12 个内容分类，兼容官方接口</p>
                        <div class="terminal" onclick="copyCode(this)">
                            <div class="terminal-bar">
                                <span class="terminal-dot dot-red"><\/span>
                                <span class="terminal-dot dot-yellow"><\/span>
                                <span class="terminal-dot dot-green"><\/span>
                                <span class="copy-hint">点击复制<\/span>
                            <\/div>
                            <div class="terminal-body">
                                <span class="prompt">GET </span><span class="cmd">/hitokoto?c=a&encode=json</span>
                            <\/div>
                        <\/div>
                        <div class="card-tags">
                            <span class="card-tag">12种分类<\/span>
                            <span class="card-tag">多编码<\/span>
                            <span class="card-tag">JSONP<\/span>
                        <\/div>
                    <\/div>
                <\/div>
            </section>

            <!-- 一言预览 -->
            <section class="section fade-in fade-in-4">
                <div class="hitokoto-preview">
                    <div class="hitokoto-text" id="hitokotoText">加载中…<\/div>
                    <div class="hitokoto-from" id="hitokotoFrom"><\/div>
                    <div class="hitokoto-actions">
                        <button class="btn-refresh" onclick="loadHitokoto()">换一条 ↻<\/button>
                    <\/div>
                <\/div>
            </section>

            <!-- API 列表 -->
            <section class="section fade-in fade-in-5">
                <h2 class="section-title">API 路由总览</h2>
                <p class="section-desc">该表由服务端路由元数据自动生成</p>
                <div class="api-table-wrap">
                    <table class="api-table">
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Path</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${apiRowsHtml}
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- 统计面板 -->
            <section class="section fade-in fade-in-5">
                <h2 class="section-title">实时统计</h2>
                <p class="section-desc">API 运行状态一览<\/p>
                <div class="stats-panel">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" id="totalRequests">0<\/div>
                            <div class="stat-label">总请求数<\/div>
                        <\/div>
                        <div class="stat-item">
                            <div class="stat-value" id="avgReqPerSec">0<\/div>
                            <div class="stat-label">请求/秒<\/div>
                        <\/div>
                        <div class="stat-item">
                            <div class="stat-value" id="activePaths">0<\/div>
                            <div class="stat-label">监控端点<\/div>
                        <\/div>
                        <div class="stat-item">
                            <div class="stat-value" id="uptime">0s<\/div>
                            <div class="stat-label">运行时间<\/div>
                        <\/div>
                    <\/div>
                    <div class="detail-grid">
                        <div class="detail-box">
                            <div class="detail-title"><span class="dot dot-cyan"><\/span> 请求方法<\/div>
                            <div id="methodStats"><span class="bar-label">加载中…<\/span><\/div>
                        <\/div>
                        <div class="detail-box">
                            <div class="detail-title"><span class="dot dot-gold"><\/span> 接口调用量<\/div>
                            <div id="pathStats"><span class="bar-label">加载中…<\/span><\/div>
                        <\/div>
                    <\/div>
                <\/div>
            </section>
        <\/div>

        <!-- Footer -->
        <footer>
            <div class="container">
                <div class="footer-links">
                    <a href="https://hono.dev" target="_blank" rel="noopener">Hono<\/a>
                    <a href="https://www.docker.com" target="_blank" rel="noopener">Docker<\/a>
                    <a href="https://hitokoto.cn" target="_blank" rel="noopener">hitokoto.cn<\/a>
                <\/div>
                <div class="footer-copy">© 2026 Web Tools API · MIT License<\/div>
            <\/div>
        </footer>
    <\/div>

    <!-- Toast -->
    <div class="toast" id="toast"><\/div>

    <script>
    (function() {
        /* ── Toast ── */
        function showToast(msg) {
            var t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(function() { t.classList.remove('show'); }, 1600);
        }

        /* ── Copy ── */
        window.copyCode = function(el) {
            var body = el.querySelector('.terminal-body');
            if (!body) return;
            var text = body.textContent.replace(/^GET /, '/').trim();
            navigator.clipboard.writeText(text).then(function() { showToast('✓ 已复制'); });
        };

        /* ── Hitokoto ── */
        window.loadHitokoto = function() {
            var textEl = document.getElementById('hitokotoText');
            var fromEl = document.getElementById('hitokotoFrom');
            textEl.style.opacity = '0.3';
            fetch('/hitokoto').then(function(r) { return r.json(); }).then(function(d) {
                textEl.style.opacity = '1';
                textEl.textContent = d.hitokoto || '无数据';
                fromEl.textContent = d.from ? '—— ' + d.from : '';
            }).catch(function() {
                textEl.style.opacity = '1';
                textEl.textContent = '加载失败';
                fromEl.textContent = '';
            });
        };
        loadHitokoto();

        /* ── Stats ── */
        var TRACKED_PATHS = ${JSON.stringify(trackedPaths)};

        function renderStatsError(msg) {
            document.getElementById('methodStats').innerHTML = '<span class="bar-label">' + msg + '<\/span>';
            document.getElementById('pathStats').innerHTML = '<span class="bar-label">' + msg + '<\/span>';
            document.getElementById('activePaths').textContent = '-';
        }

        function loadStats() {
            fetch('/stats').then(function(r) {
                if (!r.ok) {
                    throw new Error('stats_' + r.status);
                }
                return r.json();
            }).then(function(s) {
                var filteredPaths = {};
                var filteredTotal = 0;
                TRACKED_PATHS.forEach(function(p) {
                    if (s.requestsByPath[p]) {
                        filteredPaths[p] = s.requestsByPath[p];
                        filteredTotal += s.requestsByPath[p];
                    }
                });
                var uptimeSec = parseFloat(s.uptime);
                var filteredAvg = uptimeSec > 0 ? (filteredTotal / uptimeSec).toFixed(2) : '0.00';
                animateNum('totalRequests', filteredTotal);
                animateNum('avgReqPerSec', filteredAvg);
                var activeCount = Object.keys(filteredPaths).length;
                document.getElementById('activePaths').textContent = activeCount + ' / ' + TRACKED_PATHS.length;
                document.getElementById('uptime').textContent = s.uptime;
                renderMethods(s);
                renderPaths(filteredPaths);
            }).catch(function(err) {
                if (err && err.message === 'stats_401') {
                    renderStatsError('统计已受保护（401）');
                    return;
                }
                if (err && err.message === 'stats_403') {
                    renderStatsError('统计不可访问（403）');
                    return;
                }
                renderStatsError('统计加载失败');
            });
        }

        function renderMethods(s) {
            var el = document.getElementById('methodStats');
            var entries = Object.entries(s.requestsByMethod);
            if (!entries.length) { el.innerHTML = '<span class="bar-label">暂无数据<\/span>'; return; }
            el.innerHTML = entries.map(function(e) {
                var pct = (e[1] / s.totalRequests * 100).toFixed(1);
                return '<div class="bar-row">' +
                    '<span class="bar-label">' + e[0] + '<\/span>' +
                    '<div class="bar-right">' +
                    '<div class="bar-track"><div class="bar-fill-cyan" style="width:' + pct + '%"><\/div><\/div>' +
                    '<span class="bar-count">' + e[1] + '<\/span>' +
                    '<\/div><\/div>';
            }).join('');
        }

        function renderPaths(filteredPaths) {
            var el = document.getElementById('pathStats');
            var icons = {'/uptime': '📡', '/favicon': '🖼️', '/hitokoto': '💬'};
            var entries = TRACKED_PATHS.map(function(p) { return [p, filteredPaths[p] || 0]; });
            entries.sort(function(a,b) { return b[1] - a[1]; });
            var max = entries[0][1] || 1;
            el.innerHTML = entries.map(function(e) {
                var pct = (e[1] / max * 100).toFixed(1);
                return '<div class="bar-row">' +
                    '<span class="bar-label"><span class="rank-badge">' + (icons[e[0]] || '') + '<\/span>' + e[0] + '<\/span>' +
                    '<div class="bar-right">' +
                    '<div class="bar-track"><div class="bar-fill-gold" style="width:' + pct + '%"><\/div><\/div>' +
                    '<span class="bar-count-gold">' + e[1] + '<\/span>' +
                    '<\/div><\/div>';
            }).join('');
        }

        function animateNum(id, target) {
            var el = document.getElementById(id);
            var start = parseFloat(el.textContent) || 0;
            var end = parseFloat(target);
            var diff = (end - start) / 20;
            var i = 0;
            var timer = setInterval(function() {
                start += diff; i++;
                if (i >= 20) {
                    el.textContent = typeof target === 'string' && target.indexOf('.') > -1 ? parseFloat(target).toFixed(2) : Math.round(end);
                    clearInterval(timer);
                } else {
                    el.textContent = typeof target === 'string' && target.indexOf('.') > -1 ? start.toFixed(2) : Math.round(start);
                }
            }, 20);
        }

        loadStats();
        setInterval(loadStats, 3000);
    })();
    <\/script>
</body>
</html>`;

    cachedHtml = htmlStr;
    return cachedHtml;
}
