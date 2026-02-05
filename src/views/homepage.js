/**
 * 主页 HTML 视图 - 现代化美观设计
 */

import { html } from 'hono/html'

export function getHomepageHtml() {
    const htmlStr = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Tools API - 现代化网站工具箱</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        code { font-family: 'JetBrains Mono', monospace; }
        
        body {
            background: url('https://t.alcy.cc/ycy') center/cover no-repeat fixed;
            background-color: #0d1117;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        /* 动画背景 */
        .animated-bg {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 0;
            pointer-events: none;
        }
        
        .blob {
            position: absolute;
            border-radius: 40%;
            filter: blur(50px);
            opacity: 0.6;
        }
        
        .blob-1 {
            width: 400px;
            height: 400px;
            top: -100px;
            left: -100px;
            background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.12) 0%, transparent 50%);
            animation: float 8s ease-in-out infinite;
        }
        
        .blob-2 {
            width: 300px;
            height: 300px;
            top: 50%;
            right: -50px;
            background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%);
            animation: float 10s ease-in-out infinite 1s;
        }
        
        .blob-3 {
            width: 350px;
            height: 350px;
            bottom: -100px;
            left: 20%;
            background: radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.12) 0%, transparent 50%);
            animation: float 12s ease-in-out infinite 2s;
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0px, 0px); }
            25% { transform: translate(-30px, 30px); }
            50% { transform: translate(30px, -30px); }
            75% { transform: translate(-20px, -40px); }
        }
        
        /* 动画效果 */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .animate-fade-in { animation: fadeInUp 0.7s ease-out forwards; }
        
        /* 玻璃卡片 */
        .glass-card {
            background: rgba(13, 17, 23, 0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }
        
        .glass-card:hover {
            background: rgba(13, 17, 23, 0.65);
            border-color: rgba(59, 130, 246, 0.4);
            transform: translateY(-8px);
            box-shadow: 0 20px 60px rgba(34, 197, 94, 0.2);
        }
        
        .feature-icon {
            font-size: 3rem;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .stat-number {
            background: linear-gradient(135deg, #22c55e 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
            font-size: 2.5rem;
            letter-spacing: -0.02em;
        }
        
        .code-block {
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(59, 130, 246, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .code-block:hover {
            background: rgba(30, 41, 59, 0.95);
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
            transform: scale(1.02);
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(59, 130, 246, 0.12);
            border: 1px solid rgba(59, 130, 246, 0.25);
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #38bdf8;
            transition: all 0.3s ease;
        }
        
        .status-badge:hover {
            background: rgba(59, 130, 246, 0.2);
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
        
        .title {
            font-size: 3.5rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #00d4ff 0%, #00bfff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            line-height: 1.2;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
        }
        
        @media (max-width: 768px) {
            .title { font-size: 2.5rem; }
        }
        
        .content-wrapper {
            position: relative;
            z-index: 10;
            background: radial-gradient(ellipse at center top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.35) 100%);
        }
        
        .footer-separator {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        }
        
        .stat-card {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%);
            border: 1px solid rgba(34, 197, 94, 0.25);
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            border-color: rgba(34, 197, 94, 0.5);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        .progress-bar {
            background: linear-gradient(to right, #22c55e, #06b6d4);
            height: 6px;
            border-radius: 3px;
            transition: width 0.5s ease;
        }
        
        .progress-bar-path {
            background: linear-gradient(to right, #06b6d4, #0ea5e9);
            height: 6px;
            border-radius: 3px;
            transition: width 0.5s ease;
        }
    </style>
</head>
<body>
    <!-- 动画背景 -->
    <div class="animated-bg">
        <div class="blob blob-1"><\/div>
        <div class="blob blob-2"><\/div>
        <div class="blob blob-3"><\/div>
    </div>
    
    <!-- 主要内容 -->
    <div class="content-wrapper">
        <!-- 头部 -->
        <header class="pt-20 pb-12 px-4 text-center">
            <div class="max-w-4xl mx-auto">
                <div class="mb-6 animate-fade-in">
                    <h1 class="title">🛠️ Web Tools API</h1>
                </div>
                <p class="text-lg text-white max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in" style="animation-delay: 0.1s">
                    现代化自托管网站工具箱，集网站监测、图标获取、一言统计于一体
                </p>
                <div class="flex flex-wrap justify-center gap-3 animate-fade-in" style="animation-delay: 0.2s">
                    <span class="status-badge">✨ 现代化设计</span>
                    <span class="status-badge">⚡ 极速响应</span>
                    <span class="status-badge">🔒 安全可靠</span>
                    <span class="status-badge">📦 Docker 就绪</span>
                </div>
            </div>
        </header>

        <!-- 主体内容 -->
        <main class="pb-20 px-4">
            <div class="max-w-7xl mx-auto">
                <!-- 功能卡片 -->
                <section class="mb-20">
                    <h2 class="text-3xl font-bold text-center mb-4 text-white">核心功能</h2>
                    <p class="text-center text-slate-100 mb-12 max-w-2xl mx-auto">完整的API集合，覆盖网站工程师的常见需求</p>
                    
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <!-- 可用性检测 -->
                        <div class="glass-card rounded-2xl p-8 animate-fade-in" style="animation-delay: 0.1s">
                            <div class="feature-icon mb-6">📡</div>
                            <h3 class="text-xl font-bold text-white mb-3">网站可用性检测</h3>
                            <p class="text-slate-50 text-sm mb-6 leading-relaxed">实时监测网站在线状态，获取精准的响应时间和状态码数据</p>
                            <div class="space-y-2">
                                <div class="code-block rounded-lg p-4" onclick="copyCode(this)">
                                    <code class="text-cyan-400 text-xs font-mono">/uptime?url=https://google.com</code>
                                </div>
                                <p class="text-xs text-slate-200">• HTTP/HTTPS 兼容 • 8秒超时保护 • 详细报告</p>
                            </div>
                        </div>

                        <!-- 图标获取 -->
                        <div class="glass-card rounded-2xl p-8 animate-fade-in" style="animation-delay: 0.2s">
                            <div class="feature-icon mb-6">🖼️</div>
                            <h3 class="text-xl font-bold text-white mb-3">网站图标获取</h3>
                            <p class="text-slate-50 text-sm mb-6 leading-relaxed">智能解析网站元数据，一键提取高质量 Favicon 图标</p>
                            <div class="space-y-2">
                                <div class="code-block rounded-lg p-4" onclick="copyCode(this)">
                                    <code class="text-cyan-400 text-xs font-mono">/favicon?url=https://github.com</code>
                                </div>
                                <p class="text-xs text-slate-200">• 自动降级策略 • 多格式支持 • 快速缓存</p>
                            </div>
                        </div>

                        <!-- 一言API -->
                        <div class="glass-card rounded-2xl p-8 animate-fade-in" style="animation-delay: 0.3s">
                            <div class="feature-icon mb-6">💬</div>
                            <h3 class="text-xl font-bold text-white mb-3">一言 API</h3>
                            <p class="text-slate-50 text-sm mb-6 leading-relaxed">超过 7000 条精选语录库，提供多样化内容分类</p>
                            <div class="space-y-2">
                                <div class="code-block rounded-lg p-4" onclick="copyCode(this)">
                                    <code class="text-cyan-400 text-xs font-mono">/hitokoto?c=a</code>
                                </div>
                                <p class="text-xs text-slate-200">• 12个分类 • 灵活参数 • 实时更新</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 统计面板 -->
                <section class="mb-12">
                    <div class="glass-card rounded-3xl p-8 md:p-12 animate-fade-in" style="animation-delay: 0.4s">
                        <h2 class="text-2xl font-bold text-white mb-2 text-center">📊 实时统计</h2>
                    <p class="text-slate-100 text-center mb-10 text-sm">API 使用情况一览</p>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            <div class="stat-card rounded-2xl p-6 text-center">
                                <div class="stat-number" id="totalRequests">0</div>
                                <div class="text-white text-sm mt-3 font-medium">总请求数</div>
                            </div>
                            <div class="stat-card rounded-2xl p-6 text-center">
                                <div class="stat-number" id="avgReqPerSec">0</div>
                                <div class="text-white text-sm mt-3 font-medium">请求/秒</div>
                            </div>
                            <div class="stat-card rounded-2xl p-6 text-center">
                                <div class="stat-number" id="activePaths">0</div>
                                <div class="text-white text-sm mt-3 font-medium">活跃端点</div>
                            </div>
                            <div class="stat-card rounded-2xl p-6 text-center">
                                <div class="stat-number" id="uptime">0s</div>
                                <div class="text-white text-sm mt-3 font-medium">运行时间</div>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-8">
                            <div class="bg-slate-700/20 rounded-2xl p-6 border border-slate-600/40">
                                <h4 class="font-semibold text-white mb-5 flex items-center">
                                    <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 12px;"><\/span>
                                    请求方法分布
                                </h4>
                                <div class="space-y-3" id="methodStats">
                                    <div class="text-slate-100 text-sm">加载中...</div>
                                </div>
                            </div>
                            
                            <div class="bg-slate-700/20 rounded-2xl p-6 border border-slate-600/40">
                                <h4 class="font-semibold text-white mb-5 flex items-center">
                                    <span style="display: inline-block; width: 8px; height: 8px; background: #06b6d4; border-radius: 50%; margin-right: 12px;"><\/span>
                                    热门端点排行
                                </h4>
                                <div class="space-y-3" id="pathStats">
                                    <div class="text-slate-100 text-sm">加载中...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <!-- 页脚 -->
        <footer class="px-4 py-8 border-t border-slate-600/30">
            <div class="footer-separator mb-8"><\/div>
            <div class="max-w-6xl mx-auto text-center">
                <div class="flex flex-col md:flex-row justify-center items-center gap-4 mb-4 text-slate-200 text-sm">
                    <span>构建于 <a href="https://hono.dev" target="_blank" class="text-cyan-300 hover:text-cyan-200 transition">Hono</a></span>
                    <span class="hidden md:inline">•</span>
                    <span>部署于 <a href="https://www.docker.com" target="_blank" class="text-cyan-300 hover:text-cyan-200 transition">Docker</a></span>
                    <span class="hidden md:inline">•</span>
                    <span>数据源 <a href="https://hitokoto.cn" target="_blank" class="text-cyan-300 hover:text-cyan-200 transition">hitokoto.cn</a></span>
                </div>
                <div class="text-xs text-slate-300">
                    © 2026 Web Tools API | MIT License
                </div>
            </div>
        </footer>
    </div>

    <script>
        function copyCode(el) {
            const code = el.textContent.trim();
            navigator.clipboard.writeText(code).then(() => {
                const toast = document.createElement('div');
                toast.textContent = '✓ 已复制到剪贴板';
                toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(34, 197, 94, 0.9); color: white; padding: 12px 24px; border-radius: 8px; font-size: 14px; z-index: 1000;';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            });
        }

        async function loadStats() {
            try {
                const response = await fetch('/stats');
                if (!response.ok) throw new Error('Failed to fetch stats');
                const stats = await response.json();
                
                const totalEl = document.getElementById('totalRequests');
                const avgEl = document.getElementById('avgReqPerSec');
                
                const finalTotal = stats.totalRequests;
                const finalAvg = parseFloat(stats.averageRequestsPerSecond).toFixed(2);
                
                animateNumber(totalEl, finalTotal);
                animateNumber(avgEl, finalAvg);
                document.getElementById('activePaths').textContent = Object.keys(stats.requestsByPath).length;
                document.getElementById('uptime').textContent = stats.uptime;
                
                renderMethodStats(stats);
                renderPathStats(stats);
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        function renderMethodStats(stats) {
            const methodStats = document.getElementById('methodStats');
            const methodEntries = Object.entries(stats.requestsByMethod);
            if (methodEntries.length > 0) {
                methodStats.innerHTML = methodEntries.map(function(item) {
                    const method = item[0];
                    const count = item[1];
                    const percentage = (count / stats.totalRequests * 100).toFixed(1);
                    return '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                        '<span style="color: #cbd5e1; font-weight: 500;">' + method + '</span>' +
                        '<div style="display: flex; align-items: center; gap: 8px;">' +
                        '<div style="width: 96px; height: 6px; background: #475569; border-radius: 3px; overflow: hidden;">' +
                        '<div style="height: 100%; background: linear-gradient(to right, #22c55e, #06b6d4); width: ' + percentage + '%; transition: width 0.5s ease;"><\/div>' +
                        '<\/div>' +
                        '<span style="color: #86efac; font-weight: 700; font-size: 0.875rem; width: 32px;">' + count + '<\/span>' +
                        '<\/div>' +
                        '<\/div>';
                }).join('');
            }
        }

        function renderPathStats(stats) {
            const pathStats = document.getElementById('pathStats');
            const topPaths = Object.entries(stats.requestsByPath)
                .sort(function(a, b) { return b[1] - a[1]; })
                .slice(0, 5);
            
            if (topPaths.length > 0) {
                const maxCount = topPaths[0][1];
                const badges = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                pathStats.innerHTML = topPaths.map(function(item, index) {
                    const path = item[0];
                    const count = item[1];
                    const percentage = (count / maxCount * 100).toFixed(1);
                    return '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                        '<div style="display: flex; align-items: center; gap: 8px;">' +
                        '<span style="font-size: 1.125rem;">' + badges[index] + '<\/span>' +
                        '<span style="color: #cbd5e1; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + path + '<\/span>' +
                        '<\/div>' +
                        '<div style="display: flex; align-items: center; gap: 8px;">' +
                        '<div style="width: 80px; height: 6px; background: #475569; border-radius: 3px; overflow: hidden;">' +
                        '<div style="height: 100%; background: linear-gradient(to right, #06b6d4, #0ea5e9); width: ' + percentage + '%; transition: width 0.5s ease;"><\/div>' +
                        '<\/div>' +
                        '<span style="color: #67e8f9; font-weight: 700; font-size: 0.875rem; width: 32px;">' + count + '<\/span>' +
                        '<\/div>' +
                        '<\/div>';
                }).join('');
            }
        }

        function animateNumber(element, target) {
            const start = parseFloat(element.textContent) || 0;
            const numTarget = parseFloat(target);
            const increase = (numTarget - start) / 30;
            let current = start;
            let count = 0;
            
            const timer = setInterval(function() {
                current += increase;
                count++;
                if (count >= 30) {
                    element.textContent = typeof target === 'string' ? target : Math.round(numTarget);
                    clearInterval(timer);
                } else {
                    element.textContent = typeof target === 'string' && target.includes('.') ? current.toFixed(2) : Math.round(current);
                }
            }, 16);
        }

        document.addEventListener('DOMContentLoaded', function() {
            loadStats();
            setInterval(loadStats, 2000);
        });
    </script>
</body>
</html>`;

    return html(htmlStr);
}
