import { redirect } from "next/navigation"
import SurfacePanel from "@/components/SurfacePanel"
import { ApiError } from "@/lib/http/api-error"
import { getFeedPostsServer } from "@/lib/posts/server"
import { ensureProtectedAccess } from "@/lib/auth/server"
import { getMyAssociationServer } from "@/lib/associations/manage-server"
import { getCurrentUserServer } from "@/lib/users/server"

function toDateValue(post: {
  postedAt?: string
  modifiedAt?: string
}) {
  const raw = post.postedAt ?? post.modifiedAt
  if (!raw) return 0

  const value = new Date(raw).getTime()
  return Number.isFinite(value) ? value : 0
}

function toDateLabel(value?: string) {
  if (!value) return null

  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return null
  }
}

type FluxSearchParams = Promise<{
  page?: string | string[]
  size?: string | string[]
}>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const parsed = Number.parseInt(firstValue(value) ?? "", 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export default async function FluxPage({
  searchParams,
}: {
  searchParams: FluxSearchParams
}) {
  await ensureProtectedAccess("/flux")

  const params = await searchParams
  const page = parsePositiveInt(params.page, 0)
  const size = [10, 25, 50].includes(parsePositiveInt(params.size, 10))
    ? parsePositiveInt(params.size, 10)
    : 10

  try {
    await getCurrentUserServer()
  } catch (error) {
    const canTryAssociation =
      error instanceof ApiError ? error.status === 403 || error.status === 404 : true

    if (canTryAssociation) {
      try {
        await getMyAssociationServer()
        redirect("/publish")
      } catch {
        return (
          <main className="app-shell-bg min-h-screen px-6 py-10">
            <div className="mx-auto w-full max-w-3xl">
              <SurfacePanel className="rounded-2xl p-6">
                <h1 className="text-xl font-semibold text-white">Flux</h1>
                <p className="mt-3 text-sm text-red-200">Impossible de charger cette page.</p>
              </SurfacePanel>
            </div>
          </main>
        )
      }
    }
  }

  let feed: Awaited<ReturnType<typeof getFeedPostsServer>> | null = null
  let errorMessage: string | null = null

  try {
    feed = await getFeedPostsServer({ page, size })
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Erreur lors du chargement du flux."
  }

  if (errorMessage || !feed) {
    return (
      <main className="app-shell-bg min-h-screen px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <SurfacePanel className="rounded-2xl p-6">
            <h1 className="text-xl font-semibold text-white">Flux</h1>
            <p className="mt-3 text-sm text-red-200">{errorMessage ?? "Erreur inattendue."}</p>
          </SurfacePanel>
        </div>
      </main>
    )
  }

  const chronologicalPosts = [...feed.content].sort((a, b) => {
    return toDateValue(b) - toDateValue(a)
  })

  return (
    <main className="app-shell-bg min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Flux</h1>
          <p className="mt-2 text-sm text-white/60">
            Page {feed.totalPages > 0 ? page + 1 : 0} / {feed.totalPages}
          </p>
        </header>

        {chronologicalPosts.length === 0 ? (
          <SurfacePanel className="rounded-2xl p-6">
            <p className="text-sm text-white/70">Aucun post pour le moment.</p>
          </SurfacePanel>
        ) : (
          <div className="space-y-3">
            {chronologicalPosts.map((post) => {
              const published = toDateLabel(post.postedAt ?? post.modifiedAt)

              return (
                <SurfacePanel key={post.id} className="rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <h2 className="text-lg font-semibold text-white">{post.title}</h2>
                  </div>

                  {published ? (
                    <p className="mt-1 text-xs text-white/50">Publié le {published}</p>
                  ) : null}

                  {post.contentRenderedHtml ? (
                    <div
                      className="post-content mt-2"
                      dangerouslySetInnerHTML={{ __html: post.contentRenderedHtml }}
                    />
                  ) : (
                    <p className="post-content mt-2 whitespace-pre-wrap">
                      {post.contentSource}
                    </p>
                  )}

                  {post.ownerName ? (
                    <p className="mt-3 text-xs text-white/55">Publié par: {post.ownerName}</p>
                  ) : null}
                </SurfacePanel>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
