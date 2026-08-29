import { GET, POST } from "@/lib/auth"
import { NextRequest } from "next/server"

export const runtime = 'edge'

// GitHub OAuth 回调自 2025 年起附带 iss=https://github.com/login/oauth 参数（OAuth 2.0 issuer 增强）。
// 项目使用的 next-auth 5.0.0-beta.25（@auth/core 0.37.2）不支持该参数，会抛 CallbackRouteError
// （页面显示 error=Configuration）。这里在进入 NextAuth handler 前剥离 iss 参数以兼容。
async function handle(request: NextRequest) {
  const url = new URL(request.url)
  if (url.pathname.endsWith("/callback/github") && url.searchParams.has("iss")) {
    url.searchParams.delete("iss")
    const cleanRequest = new NextRequest(url.toString(), {
      method: request.method,
      headers: request.headers,
    })
    return request.method === "GET" ? GET(cleanRequest) : POST(cleanRequest)
  }
  return request.method === "GET" ? GET(request) : POST(request)
}

export { handle as GET, handle as POST }