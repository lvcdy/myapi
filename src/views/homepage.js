/**
 * 主页 HTML 视图 - 零外部依赖，纯 CSS 现代设计
 */

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getHomepageHtml(metadata = {}) {
  const statsProtected = Boolean(metadata.statsProtected);
  const defaultApiRoutes = [
    { method: "GET", path: "/uptime", description: "可用性检测" },
    { method: "GET", path: "/favicon", description: "网站图标" },
    { method: "GET", path: "/hitokoto", description: "一言" },
  ];

  const apiRoutes =
    Array.isArray(metadata.apiRoutes) && metadata.apiRoutes.length > 0
      ? metadata.apiRoutes
      : defaultApiRoutes;

  const apiRowsHtml = apiRoutes
    .map((route) => {
      const method = escapeHtml(route.method || "GET");
      const path = escapeHtml(route.path || "/");
      const description = escapeHtml(route.description || "-");
      return `<tr><td><span class="api-method">${method}</span></td><td><code>${path}</code></td><td>${description}</td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Web Tools API - 轻量工具集">
    <meta name="theme-color" content="#030712">
    <title>Web Tools API</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg-primary: #030712;
            --bg-card: rgba(17, 24, 39, 0.7);
            --bg-card-hover: rgba(31, 41, 55, 0.8);
            --border: rgba(99, 102, 241, 0.15);
            --border-hover: rgba(16, 185, 129, 0.4);
            --primary: #6366f1;
            --primary-light: #818cf8;
            --secondary: #10b981;
            --text: #f9fafb;
            --text-dim: #9ca3af;
            --text-bright: #ffffff;
            --radius: 12px;
            --radius-lg: 20px;
            --mono: 'JetBrains Mono', monospace;
            --sans: 'Inter', sans-serif;
        }

        body {
            font-family: var(--sans);
            background: var(--bg-primary);
            color: var(--text);
            min-height: 100vh;
            line-height: 1.6;
            overflow-x: hidden;
        }

        .bg-mesh {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background:
                radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
        }

        .wrapper { position: relative; z-index: 1; }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

        header { padding: 80px 0 60px; text-align: center; }
        .logo-box {
            display: inline-flex; width: 64px; height: 64px; border-radius: 16px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            margin-bottom: 24px; align-items: center; justify-content: center;
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
            animation: fadeIn 0.8s ease;
        }
        .logo-box svg { width: 32px; height: 32px; fill: white; }

        h1 {
            font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.04em;
            background: linear-gradient(to right, #fff, var(--primary-light), var(--secondary));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            line-height: 1.1; margin-bottom: 20px;
        }
        .subtitle { font-size: 1.1rem; color: var(--text-dim); margin-bottom: 32px; }
        .badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
        .badge {
            display: inline-flex; align-items: center; justify-content: center;
            min-height: 34px; padding: 0 14px; border-radius: 999px;
            border: 1px solid var(--border); background: rgba(255,255,255,0.03);
            color: var(--text-dim); font-size: 0.82rem; font-weight: 600;
        }

        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 60px; }
        .card {
            background: var(--bg-card); border: 1px solid var(--border);
            border-radius: var(--radius-lg); padding: 32px;
            backdrop-filter: blur(12px); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
            transform: translateY(-8px); border-color: var(--border-hover);
            background: var(--bg-card-hover); box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .card-tag {
            display: inline-flex; align-items: center; margin-bottom: 20px;
            padding: 6px 12px; border-radius: 999px;
            background: rgba(99,102,241,0.12); color: var(--primary-light);
            font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em;
        }
        .card h3 { font-size: 1.2rem; font-weight: 700; color: var(--text-bright); margin-bottom: 12px; }
        .card p { font-size: 0.9rem; color: var(--text-dim); margin-bottom: 20px; }

        .terminal {
            background: #000; border-radius: 10px; padding: 12px;
            font-family: var(--mono); font-size: 0.8rem; cursor: pointer;
            border: 1px solid rgba(255,255,255,0.1); transition: border 0.3s;
        }
        .terminal:hover { border-color: var(--primary); }
        .terminal .method { color: var(--primary-light); font-weight: bold; }

        .hitokoto-section {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05));
            border: 1px solid var(--border); border-radius: var(--radius-lg);
            padding: 40px; text-align: center; margin-bottom: 60px; backdrop-filter: blur(12px);
        }
        .hitokoto-text { min-height: 3.2em; font-size: 1.5rem; font-weight: 600; color: var(--text-bright); margin-bottom: 16px; transition: opacity 0.2s ease; }
        .hitokoto-from { color: var(--primary-light); font-style: italic; }
        .btn-refresh {
            margin-top: 32px; padding: 10px 24px; border-radius: 99px;
            background: var(--primary); color: white; border: none; font-weight: 600;
            cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        .btn-refresh:hover { transform: scale(1.05); background: var(--primary-light); }

        .api-list { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; overflow-x: auto; }
        .api-table { width: 100%; border-collapse: collapse; }
        .api-table th { text-align: left; padding: 12px; color: var(--text-dim); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .api-table td { padding: 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .api-method { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; background: rgba(99,102,241,0.2); color: var(--primary-light); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 40px; }
        .stat-card { background: rgba(255,255,255,0.02); border-radius: var(--radius); padding: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--secondary); margin-bottom: 4px; }
        .stat-label { font-size: 0.8rem; color: var(--text-dim); }

        footer { padding: 60px 0; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 80px; }
        .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 12px; }
        .footer-links a { color: var(--text-dim); text-decoration: none; font-size: 0.9rem; }
        .footer-links a:hover { color: var(--primary-light); }

        .toast { position: fixed; bottom: 24px; right: 24px; background: var(--primary); color: white; padding: 12px 24px; border-radius: 8px; opacity: 0; transition: 0.3s; transform: translateY(20px); font-weight: 600; }
        .toast.show { opacity: 1; transform: translateY(0); }

        @media (max-width: 640px) {
            header { padding-top: 64px; }
            .container { padding: 0 16px; }
            .card, .hitokoto-section, .api-list, .stat-card { padding-left: 20px; padding-right: 20px; }
            .api-table { min-width: 560px; }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <div class="bg-mesh"></div>
    <div class="wrapper">
        <div class="container">
            <header>
                <div class="logo-box">
                    <svg viewBox="0 0 24 24"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" /></svg>
                </div>
                <h1>Web Tools API</h1>
                <p class="subtitle">现代化轻量工具集合，为您提供极速的监测、抓取与灵感服务。</p>
                <div class="badges">
                    <span class="badge">Hono Framework</span>
                    <span class="badge">Node.js 22+</span>
                    <span class="badge">High Availability</span>
                </div>
            </header>

            <div class="card-grid">
                <div class="card">
                    <span class="card-tag">监测</span>
                    <h3>Uptime 监测</h3>
                    <p>实时网站可用性检测，支持详尽的响应状态码与延迟分析。</p>
                    <div class="terminal" onclick="copyCode(this)">
                        <span class="method">GET</span> /uptime?url=https://example.com
                    </div>
                </div>
                <div class="card">
                    <span class="card-tag">抓取</span>
                    <h3>Favicon 抓取</h3>
                    <p>一键提取网站图标，支持多种格式识别与智能冗余回退。</p>
                    <div class="terminal" onclick="copyCode(this)">
                        <span class="method">GET</span> /favicon?url=https://example.com
                    </div>
                </div>
                <div class="card">
                    <span class="card-tag">灵感</span>
                    <h3>一言 API</h3>
                    <p>连接文字与灵魂，精选万条名言语录，支持多分类调取。</p>
                    <div class="terminal" onclick="copyCode(this)">
                        <span class="method">GET</span> /hitokoto
                    </div>
                </div>
            </div>

            <div class="hitokoto-section">
                <div id="hitokotoText" class="hitokoto-text">点击按钮获取一句新的灵感</div>
                <div id="hitokotoFrom" class="hitokoto-from"></div>
                <button class="btn-refresh" onclick="loadHitokoto()">换个灵感 ↻</button>
            </div>

            <div class="api-list">
                <table class="api-table">
                    <thead>
                        <tr><th>Method</th><th>Path</th><th>Description</th></tr>
                    </thead>
                    <tbody>${apiRowsHtml}</tbody>
                </table>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div id="totalRequests" class="stat-value">0</div>
                    <div class="stat-label">总请求数</div>
                </div>
                <div class="stat-card">
                    <div id="avgReqPerSec" class="stat-value">0</div>
                    <div class="stat-label">请求/秒</div>
                </div>
                <div class="stat-card">
                    <div id="uptime" class="stat-value">0s</div>
                    <div class="stat-label">运行时间</div>
                </div>
            </div>
        </div>

        <footer>
            <div class="footer-links">
                <a href="https://github.com/honojs/hono" target="_blank" rel="noopener noreferrer">Hono</a>
                <a href="https://hitokoto.cn" target="_blank" rel="noopener noreferrer">Hitokoto</a>
            </div>
            <p>© 2026 Web Tools API · Built with Passion</p>
        </footer>
    </div>

    <div id="toast" class="toast">已复制到剪贴板</div>

    <script>
    (function() {
        const initialHitokotoText = '点击按钮获取一句新的灵感';

        function showToast() {
            const t = document.getElementById('toast');
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2000);
        }

        window.copyCode = function(el) {
            const text = el.textContent.trim().replace(/^GET /, '');
            navigator.clipboard.writeText(text).then(showToast);
        };

        window.loadHitokoto = function() {
            const textEl = document.getElementById('hitokotoText');
            const fromEl = document.getElementById('hitokotoFrom');
            textEl.style.opacity = '0.5';
            fetch('/hitokoto')
                .then((r) => {
                    if (!r.ok) throw new Error('hitokoto_request_failed');
                    return r.json();
                })
                .then(d => {
                    textEl.style.opacity = '1';
                    textEl.textContent = d.hitokoto || initialHitokotoText;
                    fromEl.textContent = d.from ? '—— ' + d.from : '';
                })
                .catch(() => {
                    textEl.style.opacity = '1';
                    textEl.textContent = '暂时无法获取一言';
                    fromEl.textContent = '';
                });
        };

        function loadStats() {
            if (${statsProtected}) {
                document.getElementById('totalRequests').textContent = '需认证';
                document.getElementById('uptime').textContent = '需认证';
                document.getElementById('avgReqPerSec').textContent = '需认证';
                return;
            }
            fetch('/stats')
                .then((r) => {
                    if (!r.ok) throw new Error('stats_request_failed');
                    return r.json();
                })
                .then(s => {
                    document.getElementById('totalRequests').textContent = s.totalRequests;
                    document.getElementById('uptime').textContent = s.uptime;
                    const uptimeSec = parseFloat(s.uptime) || 0;
                    document.getElementById('avgReqPerSec').textContent = uptimeSec > 0 ? (s.totalRequests / uptimeSec).toFixed(2) : '0.00';
                })
                .catch(() => {
                    document.getElementById('totalRequests').textContent = '-';
                    document.getElementById('uptime').textContent = '-';
                    document.getElementById('avgReqPerSec').textContent = '-';
                });
        }

        loadHitokoto();
        loadStats();
        setInterval(loadStats, 5000);
    })();
    </script>
</body>
</html>`;
}
