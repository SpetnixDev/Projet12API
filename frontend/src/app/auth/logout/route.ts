import { NextRequest, NextResponse } from "next/server"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies"
import { appendClearAccountTypeCookie } from "@/lib/auth/account-type-cookie"
import { appendSetCookieHeaders } from "@/lib/http/server-response"

const SPRING = process.env.SPRING_API_URL ?? "http://localhost:8080/api/v1"

async function callSpringLogout(accessToken?: string) {
  return fetch(`${SPRING}/auth/logout`, {
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: "no-store",
  })
}

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const springRes = await callSpringLogout(accessToken)

  const out = NextResponse.redirect(new URL("/?logout=1", req.url))

  appendSetCookieHeaders(out.headers, springRes.headers)
  out.headers.set("cache-control", "no-store, no-cache, must-revalidate")
  out.headers.set("pragma", "no-cache")
  out.headers.set("expires", "0")

  out.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
  })

  out.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
  })

  appendClearAccountTypeCookie(out.headers)

  return out
}
