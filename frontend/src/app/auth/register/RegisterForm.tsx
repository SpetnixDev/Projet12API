"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UserRegisterForm from "./UserRegisterForm"
import AssociationRegisterForm from "./AssociationRegisterForm"
import SurfacePanel from "@/components/SurfacePanel"

type Role = "USER" | "ASSOCIATION"

export default function RegisterForm({ initialType }: { initialType: Role }) {
	const router = useRouter()

	const [type, setType] = useState<Role>(initialType)
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		setType(initialType)
	}, [initialType])

	const isUser = type === "USER"

	const switchType = (newType: Role) => {
		if (isAnimating || newType === type) return

		setIsAnimating(true)
		setType(newType)
	}

	const handleFlipTransitionEnd = (
		e: React.TransitionEvent<HTMLDivElement>
	) => {
		if (e.propertyName !== "transform") return
		setIsAnimating(false)

		router.push(`/auth/register?type=${type}`)
	}

	return (
		<main className="app-shell-bg min-h-screen px-6 py-12">
			<div className="mx-auto flex w-full max-w-md flex-col items-center">
				<header className="mb-6 w-full text-center">
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
						Créer un compte
					</h1>
					<p className="mt-2 text-sm text-white/60">
						Choisissez un profil et complétez le formulaire.
					</p>
					<p className="mt-2 text-sm text-white/70">
						Déjà inscrit ?{" "}
						<Link href="/auth/login" className="font-medium text-white underline-offset-2 hover:underline">
							Se connecter
						</Link>
					</p>
				</header>

				<div className="mb-6 flex w-full justify-center">
					<div className="flex gap-2 rounded-full border border-white/30 bg-black/30 p-1 text-sm">
						<button
							onClick={() => switchType("USER")}
							disabled={isAnimating}
							aria-pressed={isUser}
							className={
								"rounded-full border-0 px-5 py-2 transition-colors duration-200 " +
								(isUser
									? " bg-white/12 font-semibold text-white"
									: " bg-transparent text-white/65 hover:bg-white/8 hover:text-white/85") +
								(isAnimating ? " pointer-events-none opacity-50" : "")
							}
							type="button"
						>
							Utilisateur
						</button>

						<button
							onClick={() => switchType("ASSOCIATION")}
							disabled={isAnimating}
							aria-pressed={!isUser}
							className={
								"rounded-full border-0 px-5 py-2 transition-colors duration-200 " +
								(!isUser
									? " bg-white/12 font-semibold text-white"
									: " bg-transparent text-white/65 hover:bg-white/8 hover:text-white/85") +
								(isAnimating ? " pointer-events-none opacity-50" : "")
							}
							type="button"
						>
							Association
						</button>
					</div>
				</div>

				<div className="w-full register-perspective">
					<SurfacePanel className="relative min-h-95 w-full overflow-hidden rounded-2xl">
						<div
							onTransitionEnd={handleFlipTransitionEnd}
							className={
								"relative h-full w-full register-preserve-3d register-flip-inner " +
								(isUser ? "" : "register-flipped") +
								(isAnimating ? " pointer-events-none" : "")
							}
						>
							<div className="absolute inset-0 register-face-front register-backface-hidden">
								<UserRegisterForm />
							</div>

							<div className="absolute inset-0 register-backface-hidden register-face-back">
								<AssociationRegisterForm />
							</div>

						</div>
					</SurfacePanel>
				</div>

				<p className="mt-4 text-center text-sm text-white/70">
					<Link href="/" className="font-medium text-white underline-offset-2 hover:underline">
						Retour à l&apos;accueil
					</Link>
				</p>

			</div>
		</main>
	)
}