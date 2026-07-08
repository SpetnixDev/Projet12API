import Link from "next/link"
import SurfacePanel from "@/components/SurfacePanel"
import { resolveAuthViewState } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

type HomeAction = {
  key: string
  href: string
  title: string
  description: string
  cta: string
}

export default async function Home() {
  const authState = await resolveAuthViewState()
  const accountType = authState.accountType

  const isGuest = !accountType
  const isUser = accountType === "USER"
  const isAssociation = accountType === "ASSOCIATION"

  const userActions: HomeAction[] = [
    {
      key: "user-feed",
      href: "/flux",
      title: "Flux",
      description: "Consultez les publications des associations que vous suivez.",
      cta: "Voir le flux",
    },
    {
      key: "user-profile",
      href: "/profile",
      title: "Profil",
      description: "Retrouvez vos informations et la liste de vos abonnements.",
      cta: "Accéder au profil",
    },
  ]

  const associationActions: HomeAction[] = [
          {
            key: "association-publish",
            href: "/publish",
            title: "Publier",
            description: "Créez et partagez une nouvelle actualité de votre association.",
            cta: "Créer une publication",
          },
          {
            key: "association-profile",
            href: "/profile",
            title: "Paramètres / Profil",
            description: "Mettez à jour vos tags, votre périmètre territorial et vos informations.",
            cta: "Gérer le profil",
          },
        ]

  const guestActions: HomeAction[] = [
    {
      key: "guest-user",
      href: "/auth/register?type=USER",
      title: "Profil utilisateur",
      description: "Créez un compte utilisateur pour suivre des associations et consulter votre flux.",
      cta: "Créer un profil utilisateur",
    },
    {
      key: "guest-association",
      href: "/auth/register?type=ASSOCIATION",
      title: "Profil association",
      description: "Créez un compte association pour publier des actualités et gérer votre visibilité.",
      cta: "Créer un profil association",
    },
  ]

  const actions = isGuest ? guestActions : isUser ? userActions : associationActions

  const introTitle = isAssociation
    ? "Partagez l'actualité de votre association."
    : "Trouvez les associations qui correspondent à vos causes."

  const introDescription = isGuest
    ? "Choisissez le type de profil qui vous correspond et commencez à explorer la plateforme."
    : isUser
      ? "Accédez rapidement aux actions principales de votre parcours utilisateur."
      : "Accédez rapidement à la publication et à la gestion de votre association."

  const actionsTitle = isGuest
    ? "Espace visiteur"
    : isAssociation
      ? "Espace association"
      : "Espace utilisateur"

  return (
    <main className="app-shell-bg min-h-screen px-6 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Accueil</h1>
        </header>

        <SurfacePanel className="rounded-3xl p-7 sm:p-10">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {introTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            {introDescription}
          </p>

          {isGuest ? (
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-xl font-semibold text-white">Comment fonctionne le site ?</h3>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-white/70">
                La plateforme vous permet de rechercher des associations par thématiques et territoires,
                puis de vous abonner pour suivre leurs publications dans un flux personnalisé.
                Les associations disposent d&apos;un espace dédié pour publier des actualités et gérer
                leur profil.
              </p>
              <div className="mt-5">
                <Link href="/associations" className="ui-button inline-flex rounded-xl px-5 py-2.5 text-sm">
                  Parcourir les associations
                </Link>
              </div>
            </div>
          ) : null}

          {isUser ? (
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-xl font-semibold text-white">Découvrir de nouvelles associations</h3>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-white/70">
                Élargissez votre veille en explorant des associations par thématiques et territoires.
                Vous pourrez ensuite les suivre pour enrichir votre flux.
              </p>
              <div className="mt-5">
                <Link href="/associations" className="ui-button inline-flex rounded-xl px-5 py-2.5 text-sm">
                  Parcourir les associations
                </Link>
              </div>
            </div>
          ) : null}
        </SurfacePanel>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">{actionsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {actions.map((action) => (
              <SurfacePanel key={action.key} className="rounded-3xl p-7">
                <h3 className="text-xl font-semibold text-white">{action.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{action.description}</p>
                <div className="mt-5">
                  <Link href={action.href} className="ui-button inline-flex rounded-xl px-5 py-2.5 text-sm">
                    {action.cta}
                  </Link>
                </div>
              </SurfacePanel>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
