export function toSearchParams(params: Record<string, unknown>) {
    const sp = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue
        if (typeof value === "string" && value.trim() === "") continue

        if (Array.isArray(value)) {
            for (const item of value) sp.append(key, String(item))
        } else {
            sp.set(key, String(value))
        }
    }

    return sp
}