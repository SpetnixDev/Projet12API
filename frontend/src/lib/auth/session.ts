import { getAuthCookieState } from "@/lib/auth/server"
import type { AccountType } from "@/types/auth"

export type AuthViewState = {
  isAuthenticated: boolean
  accountType: AccountType | null
}

export async function resolveAuthViewState(): Promise<AuthViewState> {
  const session = await getAuthCookieState()

  if (!session.hasSession) {
    return { isAuthenticated: false, accountType: null }
  }

  return {
    isAuthenticated: true,
    accountType: session.accountType,
  }
}
