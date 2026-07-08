import Link from "next/link"

export default function NotFound() {
  return (
    <main className="app-shell-bg min-h-screen px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center md:flex-row md:items-center md:gap-10">
        <div className="md:w-[20rem] md:flex-none">
          <p className="text-7xl font-black uppercase tracking-[0.18em] text-red-400 sm:text-8xl md:text-[8.5rem]">
            404
          </p>
        </div>

        <div className="mt-8 hidden self-stretch border-l border-white/12 md:block" />

        <div className="md:min-w-0 md:flex-1">
          <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
            Ressource introuvable
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            La page ou l&apos;association demandée n&apos;existe plus, n&apos;a jamais existé, ou n&apos;est plus disponible.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/associations" className="ui-button rounded-xl px-4 py-2 text-sm">
              Voir les associations
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/85 transition hover:border-white/30 hover:text-white"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}