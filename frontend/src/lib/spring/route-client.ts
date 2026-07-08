import { NextRequest, NextResponse } from "next/server"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies"
import {
  appendAccountTypeCookieFromSetCookie,
  appendClearAccountTypeCookie,
} from "@/lib/auth/account-type-cookie"
import {
  appendSetCookieValues,
  readCookieValueFromSetCookie,
  refreshOnce,
} from "@/lib/auth/refresh"

const SPRING = process.env.SPRING_API_URL ?? "http://localhost:8080/api/v1"

async function springRequest(input: string, init: RequestInit, accessToken?: string) {
  return fetch(`${SPRING}${input}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: "no-store",
  })
}

function shouldRefresh(status: number) {
  return status === 401 || status === 403
}

async function toNextResponse(res: Response, setCookieValues: string[] = []) {
  const body = await res.arrayBuffer()
  const headers = new Headers()
  const contentType = res.headers.get("content-type")

  if (contentType) {
    headers.set("content-type", contentType)
  }

  appendSetCookieValues(headers, setCookieValues)

  return new NextResponse(body.byteLength ? body : null, {
    status: res.status,
    headers,
  })
}

export async function springAuthRouteFetch(
  req: NextRequest,
  input: string,
  init: RequestInit
) {
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  const first = await springRequest(input, init, accessToken)

  if (!shouldRefresh(first.status) || !refreshToken) {
    return toNextResponse(first)
  }

  const cookie = req.headers.get("cookie") ?? ""
  const refreshResult = await refreshOnce(cookie, refreshToken)

  if (!refreshResult.ok) {
    const out = new NextResponse(null, { status: refreshResult.status })
    appendSetCookieValues(out.headers, refreshResult.setCookieValues)
    appendClearAccountTypeCookie(out.headers)
    return out
  }

  const refreshedAccessToken =
    readCookieValueFromSetCookie(refreshResult.setCookieValues, ACCESS_TOKEN_COOKIE) ??
    accessToken

  const retry = await springRequest(input, init, refreshedAccessToken)
  const out = await toNextResponse(retry, refreshResult.setCookieValues)
  appendAccountTypeCookieFromSetCookie(out.headers, refreshResult.setCookieValues)
  return out
}
