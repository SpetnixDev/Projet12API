"use client"

import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import SurfacePanel from "@/components/SurfacePanel"
import TextField from "@/components/TextField"

function sanitizeNext(next: string | null) {
    if (!next) return "/"
    if (!next.startsWith("/")) return "/"
    if (next.startsWith("//")) return "/"
    return next
}

function readErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}

export default function LoginPage() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const next = sanitizeNext(searchParams.get("next"))

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (!res.ok) {
                const body = await res.json().catch(() => null) as { message?: string } | null
                throw new Error(body?.message ?? "Identifiants invalides")
            }

            window.location.assign(next)
        } catch (error: unknown) {
            setError(readErrorMessage(error, "Erreur inattendue"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="app-shell-bg min-h-screen px-6 py-12">
            <div className="mx-auto w-full max-w-md">
                <SurfacePanel className="rounded-2xl p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">Connexion</h1>
                        <p className="mt-2 text-sm text-white/65">Accédez à votre espace.</p>
                    </div>

                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                    />

                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        type="password"
                    />

                    {error ? <div className="ui-error px-4 py-3 text-sm">{error}</div> : null}

                    <button className="ui-button w-full rounded-xl py-2 text-sm" type="submit" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>

                    <p className="text-center text-sm text-white/70">
                        Pas encore de compte ?{" "}
                        <Link href="/auth/register?type=USER" className="font-medium text-white underline-offset-2 hover:underline">
                            S&apos;inscrire
                        </Link>
                    </p>
                  </form>
                </SurfacePanel>

                <p className="mt-4 text-center text-sm text-white/70">
                    <Link href="/" className="font-medium text-white underline-offset-2 hover:underline">
                        Retour à l&apos;accueil
                    </Link>
                </p>
            </div>
        </main>
    )
}