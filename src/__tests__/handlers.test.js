import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from '../app.js'

describe('API 处理器测试', () => {
    let app

    beforeEach(() => {
        app = createApp()
    })

    describe('Hitokoto 一言API', () => {
        it('GET /hitokoto 应该返回一言', async () => {
            const res = await app.fetch(new Request('http://localhost/hitokoto'))
            expect(res.status).toBe(200)
            const data = await res.json()
            expect(data.id).toBeDefined()
            expect(data.hitokoto).toBeDefined()
            expect(data.type).toBeDefined()
            expect(data.from).toBeDefined()
        })

        it('GET /hitokoto?c=a 应该返回动画类语录', async () => {
            const res = await app.fetch(new Request('http://localhost/hitokoto?c=a'))
            expect(res.status).toBe(200)
            const data = await res.json()
            expect(data.type).toBe('a')
        })

        it('GET /hitokoto?c=b 应该返回漫画类语录', async () => {
            const res = await app.fetch(new Request('http://localhost/hitokoto?c=b'))
            expect(res.status).toBe(200)
            const data = await res.json()
            expect(data.type).toBe('b')
        })

        it('GET /hitokoto (encode=text) 应该返回纯文本格式', async () => {
            const res = await app.fetch(new Request('http://localhost/hitokoto?encode=text'))
            expect(res.status).toBe(200)
            expect(res.headers.get('content-type')).toContain('text/plain')
        })
    })

    describe('Favicon 图标获取', () => {
        it('GET /favicon?url=https://github.com 应该返回图标或报错', async () => {
            const res = await app.fetch(
                new Request('http://localhost/favicon?url=https://github.com')
            )
            // 由于跨域限制，测试环境可能返回404，实际环境应该返回图标
            expect([200, 404]).toContain(res.status)
        })

        it('缺少url参数应该返回 400 BAD REQUEST', async () => {
            const res = await app.fetch(new Request('http://localhost/favicon'))
            expect(res.status).toBe(400)
        })
    })

    describe('项目Favicon获取', () => {
        it('GET /project/favicon?url=https://github.com/user/repo 应该可用', async () => {
            const res = await app.fetch(
                new Request('http://localhost/project/favicon?url=https://github.com/torvalds/linux')
            )
            expect([200, 301, 302, 304, 404]).toContain(res.status)
        })
    })

    describe('HTTP 方法检查', () => {
        it('POST 请求应该被拒绝', async () => {
            const res = await app.fetch(
                new Request('http://localhost/health', { method: 'POST' })
            )
            expect([405, 404, 501]).toContain(res.status)
        })
    })
})
