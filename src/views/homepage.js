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
        <title>Web Tools API</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 text-slate-900 p-6 md:p-12">
        <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold text-indigo-600 mb-2">🛠️ Web Tools API</h1>
            <p class="text-slate-500 mb-8">自托管的简易网站工具箱，已封装为 Docker 镜像。</p>
            
            <div class="grid gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 class="font-bold text-lg mb-2">📡 网站可用性检测</h2>
                    <p class="text-sm text-slate-500 mb-3">返回在线状态及延迟 (ms)。</p>
                    <code class="block bg-slate-100 p-3 rounded text-sm text-indigo-700">/uptime?url=https://google.com</code>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 class="font-bold text-lg mb-2">🖼️ 获取网站图标</h2>
                    <p class="text-sm text-slate-500 mb-3">自动提取目标网站的 Favicon。</p>
                    <code class="block bg-slate-100 p-3 rounded text-sm text-indigo-700">/favicon?url=https://github.com</code>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 class="font-bold text-lg mb-2">💬 一言</h2>
                    <p class="text-sm text-slate-500 mb-3">随机返回一句话，数据来源于 <a href="https://github.com/hitokoto-osc/sentences-bundle" class="text-indigo-500 hover:underline">hitokoto-osc/sentences-bundle</a>。</p>
                    <code class="block bg-slate-100 p-3 rounded text-sm text-indigo-700 mb-2">/hitokoto</code>
                    <p class="text-xs text-slate-400">参数: c=类型, encode=格式(json/text/js)</p>
                    <p class="text-xs text-slate-400 mt-1">类型: a动画 b漫画 c游戏 d文学 e原创 f网络 g其他 h影视 i诗词 j网易云 k哲学 l抖机灵</p>
                </div>
            </div>
            <footer class="mt-12 text-slate-400 text-xs">
                Powered by Hono & Docker | 一言数据来源: <a href="https://hitokoto.cn" class="hover:text-slate-600">hitokoto.cn</a>
            </footer>
        </div>
    </body>
    </html>`
}
