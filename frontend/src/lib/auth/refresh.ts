const SPRING = process.env.SPRING_API_URL ?? "http://localhost:8080/api/v1"

export type RefreshResult = {
  ok: boolean
  status: number
  setCookieValues: string[]
}

const inFlightRefreshes = new Map<string, Promise<RefreshResult>>()

export function readSetCookieValues(headers: Headers): string[] {
  const withGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[]
  }

  if (typeof withGetSetCookie.getSetCookie === "function") {
    return withGetSetCookie.getSetCookie()
  }

  const single = headers.get("set-cookie")
  return single ? [single] : []
}

export function appendSetCookieValues(target: Headers, values: string[]) {
  for (const value of values) {
    target.append("set-cookie", value)
  }
}

export function readCookieValueFromSetCookie(values: string[], name: string): string | null {
  const prefix = `${name}=`
  const cookie = values.find((value) => value.startsWith(prefix))
  if (!cookie) return null

  return cookie.slice(prefix.length).split(";")[0] || null
}

async function refresh(cookie: string) {
  return fetch(`${SPRING}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: cookie,
    },
    cache: "no-store",
  })
}

export async function refreshOnce(
  cookie: string,
  refreshToken: string
): Promise<RefreshResult> {
  const existing = inFlightRefreshes.get(refreshToken)

  if (existing) {
    return existing
  }

  const pending = (async () => {
    const res = await refresh(cookie)

    return {
      ok: res.ok,
      status: res.status,
      setCookieValues: readSetCookieValues(res.headers),
    }
  })()

  inFlightRefreshes.set(refreshToken, pending)

  try {
    return await pending
  } finally {
    if (inFlightRefreshes.get(refreshToken) === pending) {
      inFlightRefreshes.delete(refreshToken)
    }
  }
}
