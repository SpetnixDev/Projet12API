import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AssociationPostEditor from "@/components/AssociationPostEditor"
import SurfacePanel from "@/components/SurfacePanel"
import { ensureProtectedAccess } from "@/lib/auth/server"
import { ApiError } from "@/lib/http/api-error"
import { getMyAssociationServer } from "@/lib/associations/manage-server"
import { getCurrentUserServer } from "@/lib/users/server"
import {
  createAssociationPostServer,
  deletePostServer,
  getAssociationPostsServer,
  updatePostServer,
} from "@/lib/posts/server"
import type { Post } from "@/types/post"

type PublishSearchParams = Promise<{
  postCreated?: string | string[]
  postError?: string | string[]
  postUpdated?: string | string[]
  postDeleted?: string | string[]
  managePostError?: string | string[]
}>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function renderPublishForm(params: {
  associationId: string
  postCreated: boolean
  postError: string | null
  postUpdated: boolean
  postDeleted: boolean
  managePostError: string | null
  posts: Post[]
}) {
  return (
    <main className="app-shell-bg min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Créer une publication</h1>
          <p className="mt-2 text-sm text-white/60">
            Créez une nouvelle publication pour votre association.
          </p>
        </header>

        <SurfacePanel className="rounded-2xl p-6">
          <AssociationPostEditor
            associationId={params.associationId}
            action={createAssociationPostAction}
            postCreated={params.postCreated}
            postError={params.postError}
          />
        </SurfacePanel>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Publications existantes</h2>
            <p className="mt-1 text-sm text-white/60">
              Modifiez ou supprimez les publications déjà publiées par votre association.
            </p>
          </div>

          {params.postUpdated ? (
            <p className="rounded-xl border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100">
              Publication mise à jour.
            </p>
          ) : null}
          {params.postDeleted ? (
            <p className="rounded-xl border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100">
              Publication supprimée.
            </p>
          ) : null}
          {params.managePostError ? (
            <p className="ui-error px-3 py-2 text-sm">{params.managePostError}</p>
          ) : null}

          {params.posts.length === 0 ? (
            <SurfacePanel className="rounded-2xl p-6">
              <p className="text-sm text-white/65">Aucune publication pour le moment.</p>
            </SurfacePanel>
          ) : (
            params.posts.map((post) => (
              <SurfacePanel key={post.id} as="article" className="rounded-2xl p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    {post.postedAt ? (
                      <p className="mt-1 text-xs text-white/50">
                        Publié le{" "}
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(post.postedAt))}
                      </p>
                    ) : null}
                  </div>

                  <form action={deleteAssociationPostAction}>
                    <input type="hidden" name="associationId" value={params.associationId} />
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      className="rounded-xl border border-red-400/35 bg-red-500/14 px-3 py-1.5 text-sm font-semibold text-red-100 transition hover:bg-red-500/24"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>

                <details className="mt-4 rounded-xl border border-white/10 bg-white/4 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-white/85">
                    Modifier la publication
                  </summary>
                  <AssociationPostEditor
                    associationId={params.associationId}
                    postId={post.id}
                    action={updateAssociationPostAction}
                    initialTitle={post.title}
                    initialContent={post.contentSource}
                    submitLabel="Enregistrer les modifications"
                  />
                </details>
              </SurfacePanel>
            ))
          )}
        </section>
      </div>
    </main>
  )
}

function renderPublishError() {
  return (
    <main className="app-shell-bg min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <SurfacePanel className="rounded-2xl p-6">
          <h1 className="text-xl font-semibold text-white">Publier</h1>
          <p className="mt-3 text-sm text-red-200">Impossible de charger cette page.</p>
        </SurfacePanel>
      </div>
    </main>
  )
}

async function createAssociationPostAction(formData: FormData) {
  "use server"

  const associationId = formData.get("associationId")
  const title = formData.get("title")
  const contentSource = formData.get("contentSource")

  if (
    typeof associationId !== "string" ||
    typeof title !== "string" ||
    typeof contentSource !== "string"
  ) {
    redirect("/publish?postError=Donn%C3%A9es+invalides")
  }

  const trimmedTitle = title.trim()
  const trimmedContent = contentSource.trim()

  if (!trimmedTitle || !trimmedContent) {
    redirect("/publish?postError=Le+titre+et+le+contenu+sont+obligatoires")
  }

  if (trimmedTitle.length > 255) {
    redirect("/publish?postError=Le+titre+doit+faire+255+caract%C3%A8res+maximum")
  }

  try {
    await createAssociationPostServer(associationId, {
      title: trimmedTitle,
      contentSource: trimmedContent,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la création du post."
    redirect(`/publish?postError=${encodeURIComponent(message)}`)
  }

  revalidatePath("/publish")
  revalidatePath("/profile")
  revalidatePath(`/association/${associationId}`)
  revalidatePath("/flux")
  redirect("/publish?postCreated=1")
}

async function updateAssociationPostAction(formData: FormData) {
  "use server"

  const associationId = formData.get("associationId")
  const postId = Number.parseInt(String(formData.get("postId") ?? ""), 10)
  const title = formData.get("title")
  const contentSource = formData.get("contentSource")

  if (
    typeof associationId !== "string" ||
    !associationId ||
    !Number.isFinite(postId) ||
    typeof title !== "string" ||
    typeof contentSource !== "string"
  ) {
    redirect("/publish?managePostError=Donn%C3%A9es+invalides")
  }

  const trimmedTitle = title.trim()
  const trimmedContent = contentSource.trim()

  if (!trimmedTitle || !trimmedContent) {
    redirect("/publish?managePostError=Le+titre+et+le+contenu+sont+obligatoires")
  }

  if (trimmedTitle.length > 255) {
    redirect("/publish?managePostError=Le+titre+doit+faire+255+caract%C3%A8res+maximum")
  }

  try {
    await updatePostServer(postId, {
      title: trimmedTitle,
      contentSource: trimmedContent,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la mise à jour du post."
    redirect(`/publish?managePostError=${encodeURIComponent(message)}`)
  }

  revalidatePath("/publish")
  revalidatePath(`/association/${associationId}`)
  revalidatePath("/flux")
  redirect("/publish?postUpdated=1")
}

async function deleteAssociationPostAction(formData: FormData) {
  "use server"

  const associationId = formData.get("associationId")
  const postId = Number.parseInt(String(formData.get("postId") ?? ""), 10)

  if (typeof associationId !== "string" || !associationId || !Number.isFinite(postId)) {
    redirect("/publish?managePostError=Donn%C3%A9es+invalides")
  }

  try {
    await deletePostServer(postId)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la suppression du post."
    redirect(`/publish?managePostError=${encodeURIComponent(message)}`)
  }

  revalidatePath("/publish")
  revalidatePath(`/association/${associationId}`)
  revalidatePath("/flux")
  redirect("/publish?postDeleted=1")
}

export default async function PublishPage({
  searchParams,
}: {
  searchParams: PublishSearchParams
}) {
  await ensureProtectedAccess("/publish")

  const params = await searchParams
  const postCreated = firstValue(params.postCreated) === "1"
  const postError = firstValue(params.postError) ?? null
  const postUpdated = firstValue(params.postUpdated) === "1"
  const postDeleted = firstValue(params.postDeleted) === "1"
  const managePostError = firstValue(params.managePostError) ?? null

  let associationId: string | null = null
  let posts: Post[] = []

  try {
    const association = await getMyAssociationServer()
    associationId = association.id
    const associationPosts = await getAssociationPostsServer({
      associationId,
      page: 0,
      size: 100,
    })
    posts = associationPosts.content
  } catch (error) {
    const canTryUser = error instanceof ApiError ? error.status === 403 || error.status === 404 : true

    if (canTryUser) {
      try {
        await getCurrentUserServer()
        redirect("/flux")
      } catch {
        return renderPublishError()
      }
    }

    return renderPublishError()
  }

  if (!associationId) {
    return renderPublishError()
  }

  return renderPublishForm({
    associationId,
    postCreated,
    postError,
    postUpdated,
    postDeleted,
    managePostError,
    posts,
  })
}
