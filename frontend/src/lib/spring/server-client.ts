import { cookies } from "next/headers"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies"

const SPRING = process.env.SPRING_API_URL ?? "http://localhost:8080/api/v1"
const PUBLIC_DATA_REVALIDATE_SECONDS = 60

type SpringFetchInit = RequestInit & {
  next?: {
    revalidate?: false | 0 | number
    tags?: string[]
  }
}

export async function springFetch(input: string, init?: SpringFetchInit) {
  const hasCachePolicy = init?.cache !== undefined || init?.next?.revalidate !== undefined

  return fetch(`${SPRING}${input}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
    ...(hasCachePolicy
      ? {}
      : {
          next: {
            ...(init?.next ?? {}),
            revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
          },
        }),
  })
}

export async function springAuthFetch(input: string, init?: RequestInit) {
  const jar = await cookies()
  const at = jar.get(ACCESS_TOKEN_COOKIE)?.value

  return fetch(`${SPRING}${input}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(at ? { Authorization: `Bearer ${at}` } : {}),
    },
    cache: "no-store",
  })
}
