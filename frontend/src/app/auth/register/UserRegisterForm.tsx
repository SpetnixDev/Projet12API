"use client"

import { useState, useRef } from "react"
import { register } from "@/lib/auth/client"
import TextField from "@/components/TextField"

function readErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}

export default function UserRegisterForm() {
    const isSubmittingRef = useRef(false)

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            await register("USER", { email, name, password })

            window.location.assign("/")

        } catch (error: unknown) {
            setError(readErrorMessage(error, "Échec de l’inscription"))
        } finally {
            isSubmittingRef.current = false
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="h-full w-full px-8 py-6 flex flex-col gap-4 text-white"
        >
            <h2 className="text-xl font-semibold text-center tracking-tight">
                Inscription utilisateur
            </h2>

            {error ? (
                <p
                    aria-live="polite"
                    className="ui-error px-4 py-3 text-sm"
                >
                    {error}
                </p>
            ) : null}

            <TextField
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nom d’utilisateur"
                minLength={3}
                maxLength={16}
                pattern="[A-Za-z0-9_]{3,16}"
                title="3 à 16 caractères, lettres/chiffres/underscore uniquement"
            />

            <TextField
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-mail"
            />

            <TextField
                type="password"
                required
                minLength={8}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
                title="8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />

            <button
                className="ui-button rounded-xl py-2 text-sm"
                type="submit"
            >
                S’inscrire
            </button>
        </form>
    )
}
