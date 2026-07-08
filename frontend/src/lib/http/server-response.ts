export function appendSetCookieHeaders(target: Headers, source: Headers) {
  const withGetSetCookie = source as Headers & {
    getSetCookie?: () => string[]
  }

  const values =
    typeof withGetSetCookie.getSetCookie === "function"
      ? withGetSetCookie.getSetCookie()
      : (() => {
          const single = source.get("set-cookie")
          return single ? [single] : []
        })()

  for (const value of values) {
    target.append("set-cookie", value)
  }
}

export async function readResponseMessage(
  res: Response,
  fallback: string
): Promise<string> {
  const text = await res.text()
  if (!text) return fallback

  try {
    const parsed = JSON.parse(text) as {
      message?: string
      error?: string
      detail?: string
    }

    return parsed.message ?? parsed.error ?? parsed.detail ?? text
  } catch {
    return text
  }
}