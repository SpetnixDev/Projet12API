import { cookies } from "next/headers"
import {
  ACCESS_TOKEN_COOKIE,
  ACCOUNT_TYPE_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies"
import { redirect } from "next/navigation"
import { getAccessTokenAccountType, hasUsableAccessToken } from "@/lib/auth/token"
import { isAccountType } from "@/lib/auth/account-type-cookie"
import type { AccountType } from "@/types/auth"

export type AuthCookieState = {
  accessToken?: string
  refreshToken?: string
  hasSession: boolean
  hasUsableAccessToken: boolean
  accountType: AccountType | null
}

export async function getAuthCookieState(): Promise<AuthCookieState> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value
  const accountTypeCookie = cookieStore.get(ACCOUNT_TYPE_COOKIE)?.value
  const accessTokenUsable = hasUsableAccessToken(accessToken)
  const accountType = isAccountType(accountTypeCookie)
    ? accountTypeCookie
    : getAccessTokenAccountType(accessToken)

  return {
    accessToken,
    refreshToken,
    hasSession: accessTokenUsable || Boolean(refreshToken),
    hasUsableAccessToken: accessTokenUsable,
    accountType,
  }
}

export async function hasAuthSessionCookie(): Promise<boolean> {
  const state = await getAuthCookieState()
  return state.hasSession
}

export async function ensureProtectedAccess(nextPath: string): Promise<void> {
  const state = await getAuthCookieState()

  if (state.hasUsableAccessToken) {
    return
  }

  if (state.refreshToken) {
    redirect(`/api/auth/refresh?next=${encodeURIComponent(nextPath)}`)
  }

  redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)
}
