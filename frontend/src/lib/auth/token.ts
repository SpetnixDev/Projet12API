import type { AccountType } from "@/types/auth"

type JwtPayload = {
  exp?: number
  type?: AccountType
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")

  return Buffer.from(padded, "base64").toString("utf8")
}

function readJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".")
  if (parts.length < 2) return null

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

export function hasUsableAccessToken(token: string | null | undefined, skewSeconds = 30): boolean {
  if (!token) return false

  const payload = readJwtPayload(token)
  if (!payload?.exp) return false

  return payload.exp * 1000 > Date.now() + skewSeconds * 1000
}

export function getAccessTokenAccountType(token: string | null | undefined): AccountType | null {
  if (!token) return null

  const payload = readJwtPayload(token)
  return payload?.type === "USER" || payload?.type === "ASSOCIATION" ? payload.type : null
}
