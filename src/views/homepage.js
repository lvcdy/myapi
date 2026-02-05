/**
 * 主页 HTML 视图
 */

import { html } from 'hono/html'

export function getHomepageHtml() {
    return html`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Tools API - 网站工具箱</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            code {
                font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                transition: all 0.3s ease;
            }
            .gradient-bg-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%);
                z-index: -1;
            }
            .code-block {
                position: relative;
                transition: all 0.2s ease;
            }
            .code-block:hover {
                background-color: #e0e7ff !important;
                transform: scale(1.02);
            }
            .pulse-dot {
                display: inline-block;
                width: 10px;
                height: 10px;
                background-color: #10b981;
                border-radius: 50%;
                margin-right: 8px;
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }

        </style>
    </head>
    <body class="min-h-screen bg-gray-900">
        <div class="gradient-bg-overlay"></div>

        <!-- Header -->
        <header class="py-12 px-4 text-center animate-fade-in-up">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center justify-center mb-4">
                    <span class="pulse-dot"></span>
                    <h1 class="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                        🛠️ Web Tools API
                    </h1>
                </div>
                <p class="text-xl text-slate-100 max-w-2xl mx-auto leading-relaxed">
                    自托管的现代化网站工具箱，提供网站检测、图标获取、一言等实用功能
                </p>
                <div class="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-200">
                    <span class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">📦 Docker Ready</span>
                    <span class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">⚡ High Performance</span>
                    <span class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🔒 Secure</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="pb-16 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- 网站可用性检测 -->
                    <div class="feature-card bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fade-in-up" style="animation-delay: 0.1s">
                        <div class="flex items-start mb-4">
                            <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                                <span class="text-2xl">📡</span>
                            </div>
                            <div>
                                <h2 class="font-bold text-xl text-slate-800">网站可用性检测</h2>
                                <p class="text-sm text-slate-500 mt-1">实时监测网站在线状态和响应时间</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="code-block bg-slate-50 p-4 rounded-lg cursor-pointer" onclick="copyToClipboard('/uptime?url=https://google.com')">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">GET Request</span>
                                    <span class="text-xs text-slate-400">点击复制</span>
                                </div>
                                <code class="text-indigo-600 font-mono text-sm break-all">/uptime?url=https://google.com</code>
                            </div>
                            <div class="text-xs text-slate-500 space-y-1">
                                <p>• 返回状态码和响应延迟</p>
                                <p>• 支持HTTP/HTTPS协议</p>
                                <p>• 超时时间为8秒</p>
                            </div>
                        </div>
                    </div>

                    <!-- 网站图标获取 -->
                    <div class="feature-card bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fade-in-up" style="animation-delay: 0.2s">
                        <div class="flex items-start mb-4">
                            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                                <span class="text-2xl">🖼️</span>
                            </div>
                            <div>
                                <h2 class="font-bold text-xl text-slate-800">网站图标获取</h2>
                                <p class="text-sm text-slate-500 mt-1">智能提取网站Favicon图标</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="code-block bg-slate-50 p-4 rounded-lg cursor-pointer" onclick="copyToClipboard('/favicon?url=https://github.com')">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">GET Request</span>
                                    <span class="text-xs text-slate-400">点击复制</span>
                                </div>
                                <code class="text-indigo-600 font-mono text-sm break-all">/favicon?url=https://github.com</code>
                            </div>
                            <div class="text-xs text-slate-500 space-y-1">
                                <p>• 自动解析HTML标签</p>
                                <p>• 支持多种图标格式</p>
                                <p>• 直接返回图片数据</p>
                            </div>
                        </div>
                    </div>

                    <!-- 一言API -->
                    <div class="feature-card bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fade-in-up" style="animation-delay: 0.3s">
                        <div class="flex items-start mb-4">
                            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                                <span class="text-2xl">💬</span>
                            </div>
                            <div>
                                <h2 class="font-bold text-xl text-slate-800">一言API</h2>
                                <p class="text-sm text-slate-500 mt-1">随机语录，丰富多样的内容类型</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="code-block bg-slate-50 p-4 rounded-lg cursor-pointer" onclick="copyToClipboard('/hitokoto')">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">GET Request</span>
                                    <span class="text-xs text-slate-400">点击复制</span>
                                </div>
                                <code class="text-indigo-600 font-mono text-sm break-all">/hitokoto</code>
                            </div>
                            <div class="space-y-2">
                                <div class="text-xs text-slate-500">
                                    <p class="font-medium mb-1">支持参数:</p>
                                    <p>c=类型 (a-l) • encode=json/text/js</p>
                                </div>
                                <div class="text-xs text-slate-400">
                                    <p class="font-medium mb-1">内容类型:</p>
                                    <p>a动画 b漫画 c游戏 d文学 e原创 f网络 g其他 h影视 i诗词 j网易云 k哲学 l抖机灵</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- API Stats -->
                <div class="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 animate-fade-in-up" style="animation-delay: 0.4s">
                    <h3 class="text-2xl font-bold text-slate-800 mb-6 text-center">📊 API 统计信息</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <div class="text-3xl font-bold text-indigo-600 mb-2">3</div>
                            <div class="text-sm text-slate-500">核心功能</div>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <div class="text-3xl font-bold text-green-600 mb-2">7184+</div>
                            <div class="text-sm text-slate-500">一言语录</div>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <div class="text-3xl font-bold text-blue-600 mb-2">12</div>
                            <div class="text-sm text-slate-500">内容分类</div>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <div class="text-3xl font-bold text-purple-600 mb-2">∞</div>
                            <div class="text-sm text-slate-500">无限调用</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="py-8 px-4 border-t border-white/20 backdrop-blur-sm bg-white/10">
            <div class="max-w-6xl mx-auto text-center text-slate-200">
                <div class="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
                    <span>Powered by <a href="https://hono.dev" class="text-white hover:underline font-medium">Hono</a> & <a href="https://www.docker.com" class="text-white hover:underline font-medium">Docker</a></span>
                    <span>•</span>
                    <span>数据来源: <a href="https://hitokoto.cn" class="text-white hover:underline font-medium">hitokoto.cn</a></span>
                </div>
                <div class="text-sm text-slate-300">
                    © 2026 Web Tools API | 开源项目 | MIT License
                </div>
            </div>
        </footer>

        <script>
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    // 简单的视觉反馈
                    const originalText = event.target.textContent;
                    event.target.textContent = '已复制!';
                    setTimeout(() => {
                        event.target.textContent = originalText;
                    }, 1000);
                });
            }

            // 添加滚动动画
            document.addEventListener('DOMContentLoaded', function() {
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.animationPlayState = 'running';
                        }
                    });
                }, observerOptions);

                document.querySelectorAll('.animate-fade-in-up').forEach(el => {
                    el.style.animationPlayState = 'paused';
                    observer.observe(el);
                });
            });
        </script>
    </body>
    </html>`
}
