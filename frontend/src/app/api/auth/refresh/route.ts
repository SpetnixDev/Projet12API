import { NextRequest, NextResponse } from "next/server"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies"
import {
  appendAccountTypeCookieFromSetCookie,
  appendClearAccountTypeCookie,
} from "@/lib/auth/account-type-cookie"
import { appendSetCookieValues, refreshOnce } from "@/lib/auth/refresh"
import { hasUsableAccessToken } from "@/lib/auth/token"

function sanitizeNext(next: string | null): string {
  if (!next) return "/"
  if (!next.startsWith("/")) return "/"
  if (next.startsWith("//")) return "/"
  return next
}

function redirectToLogin(req: NextRequest, next: string) {
  const login = new URL("/auth/login", req.url)

  if (next && next !== "/") {
    login.searchParams.set("next", next)
  }

  return NextResponse.redirect(login)
}

function redirectBack(req: NextRequest, next: string) {
  const back = new URL(next, req.url)
  return NextResponse.redirect(back)
}

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value

  if (hasUsableAccessToken(accessToken)) {
    return new NextResponse(null, { status: 204 })
  }

  if (!refreshToken) {
    return new NextResponse(null, { status: 401 })
  }

  const cookie = req.headers.get("cookie") ?? ""

  const result = await refreshOnce(cookie, refreshToken)

  const out = new NextResponse(null, {
    status: result.status,
  })

  appendSetCookieValues(out.headers, result.setCookieValues)
  if (result.ok) {
    appendAccountTypeCookieFromSetCookie(out.headers, result.setCookieValues)
  }

  return out
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const next = sanitizeNext(url.searchParams.get("next"))
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value

  if (hasUsableAccessToken(accessToken)) {
    return redirectBack(req, next)
  }

  if (!refreshToken) {
    return redirectToLogin(req, next)
  }

  const cookie = req.headers.get("cookie") ?? ""

  const result = await refreshOnce(cookie, refreshToken)

  if (!result.ok) {
    const out = redirectToLogin(req, next)
    appendSetCookieValues(out.headers, result.setCookieValues)
    appendClearAccountTypeCookie(out.headers)
    return out
  }

  const out = redirectBack(req, next)
  appendSetCookieValues(out.headers, result.setCookieValues)
  appendAccountTypeCookieFromSetCookie(out.headers, result.setCookieValues)
  return out
}
