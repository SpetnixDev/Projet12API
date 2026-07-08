import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AssociationPostEditor from "@/components/AssociationPostEditor"
import SurfacePanel from "@/components/SurfacePanel"
import { ensureProtectedAccess } from "@/lib/auth/server"
import { ApiError } from "@/lib/http/api-error"
import { getMyAssociationServer } from "@/lib/associations/manage-server"
import { getCurrentUserServer } from "@/lib/users/server"
import { createAssociationPostServer } from "@/lib/posts/server"

type PublishSearchParams = Promise<{
  postCreated?: string | string[]
  postError?: string | string[]
}>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function renderPublishForm(params: {
  associationId: string
  postCreated: boolean
  postError: string | null
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

export default async function PublishPage({
  searchParams,
}: {
  searchParams: PublishSearchParams
}) {
  await ensureProtectedAccess("/publish")

  const params = await searchParams
  const postCreated = firstValue(params.postCreated) === "1"
  const postError = firstValue(params.postError) ?? null

  let associationId: string | null = null

  try {
    const association = await getMyAssociationServer()
    associationId = association.id
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

  return renderPublishForm({ associationId, postCreated, postError })
}
