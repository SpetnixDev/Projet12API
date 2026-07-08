import { ACCOUNT_TYPE_COOKIE, ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies"
import { readCookieValueFromSetCookie } from "@/lib/auth/refresh"
import { getAccessTokenAccountType } from "@/lib/auth/token"
import type { AccountType } from "@/types/auth"

const ACCOUNT_TYPE_COOKIE_MAX_AGE = 60 * 60 * 24 * 14

export function isAccountType(value: string | undefined): value is AccountType {
  return value === "USER" || value === "ASSOCIATION"
}

function appendCookie(headers: Headers, value: string) {
  headers.append("set-cookie", value)
}

function serializeAccountTypeCookie(value: AccountType) {
  const parts = [
    `${ACCOUNT_TYPE_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ACCOUNT_TYPE_COOKIE_MAX_AGE}`,
  ]

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure")
  }

  return parts.join("; ")
}

export function appendAccountTypeCookieFromSetCookie(
  headers: Headers,
  setCookieValues: string[]
) {
  const accessToken = readCookieValueFromSetCookie(setCookieValues, ACCESS_TOKEN_COOKIE)
  const accountType = getAccessTokenAccountType(accessToken)

  if (!accountType) {
    return
  }

  appendCookie(headers, serializeAccountTypeCookie(accountType))
}

export function appendClearAccountTypeCookie(headers: Headers) {
  appendCookie(headers, `${ACCOUNT_TYPE_COOKIE}=; Path=/; Max-Age=0`)
}
