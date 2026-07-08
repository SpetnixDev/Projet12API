import { NextResponse } from "next/server"
import { appendSetCookieHeaders, readResponseMessage } from "@/lib/http/server-response"
import { appendAccountTypeCookieFromSetCookie } from "@/lib/auth/account-type-cookie"
import { readSetCookieValues } from "@/lib/auth/refresh"

const SPRING = process.env.SPRING_API_URL ?? "http://localhost:8080/api/v1"

export async function POST(req: Request) {
    const res = await fetch(`${SPRING}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: await req.text(),
    })

    const out = res.ok
        ? NextResponse.json(null, {
            status: res.status,
        })
        : NextResponse.json(
            {
                message: await readResponseMessage(res, "Identifiants invalides"),
            },
            {
                status: res.status,
            }
        )

    const setCookieValues = readSetCookieValues(res.headers)
    appendSetCookieHeaders(out.headers, res.headers)

    if (res.ok) {
        appendAccountTypeCookieFromSetCookie(out.headers, setCookieValues)
    }

    return out
}
