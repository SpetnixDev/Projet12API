import type { AccountType, RegisterRequest } from "@/types/auth"

export async function register(
    type: AccountType,
    payload: RegisterRequest
) {
    const res = await fetch(`/api/auth/register?type=${type}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const error = await res.json().catch(() => null) as { message?: string } | null
        throw new Error(error?.message ?? "Registration failed")
    }
}