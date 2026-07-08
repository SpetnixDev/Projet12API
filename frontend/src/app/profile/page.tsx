import Link from "next/link"
import type { ReactNode } from "react"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AssociationSettingsEditor from "@/components/AssociationSettingsEditor"
import SurfacePanel from "@/components/SurfacePanel"
import { ensureProtectedAccess } from "@/lib/auth/server"
import { ApiError } from "@/lib/http/api-error"
import {
  getMyAssociationServer,
  updateAssociationDescriptionServer,
  updateAssociationDepartmentsServer,
  updateAssociationTagsServer,
} from "@/lib/associations/manage-server"
import {
  getDepartmentsServer,
  getRegionsServer,
  getTagsServer,
} from "@/lib/references/server"
import {
  getCurrentUserServer,
  getMySubscriptionsServer,
  getMySupportsServer,
} from "@/lib/users/server"
import type { DepartmentScope } from "@/types/territory"

type ProfileSearchParams = Promise<{
  descriptionUpdated?: string | string[]
  descriptionError?: string | string[]
  tagsUpdated?: string | string[]
  territoriesUpdated?: string | string[]
  tagsError?: string | string[]
  territoriesError?: string | string[]
}>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function firstFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function readManyValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

async function updateAssociationTagsAction(formData: FormData) {
  "use server"

  const associationId = firstFormValue(formData, "associationId")
  const tags = readManyValues(formData, "tags")

  if (!associationId) {
    redirect("/profile?tagsError=Association+introuvable")
  }

  if (!tags.length) {
    redirect("/profile?tagsError=Veuillez+s%C3%A9lectionner+au+moins+un+tag")
  }

  try {
    await updateAssociationTagsServer(associationId, tags)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour des tags."
    redirect(`/profile?tagsError=${encodeURIComponent(message)}`)
  }

  revalidatePath("/profile")
  redirect("/profile?tagsUpdated=1")
}

async function updateAssociationDescriptionAction(formData: FormData) {
  "use server"

  const associationId = firstFormValue(formData, "associationId")
  const description = firstFormValue(formData, "description")

  if (!associationId) {
    redirect("/profile?descriptionError=Association+introuvable")
  }

  if (description.length > 2000) {
    redirect("/profile?descriptionError=La+description+doit+faire+2000+caract%C3%A8res+maximum")
  }

  try {
    await updateAssociationDescriptionServer(associationId, description)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la mise à jour de la description."
    redirect(`/profile?descriptionError=${encodeURIComponent(message)}`)
  }

  revalidatePath("/profile")
  redirect("/profile?descriptionUpdated=1")
}

async function updateAssociationTerritoriesAction(formData: FormData) {
  "use server"

  const associationId = firstFormValue(formData, "associationId")
  const rawScope = firstFormValue(formData, "scope")
  const scope: DepartmentScope =
    rawScope === "REGIONS" || rawScope === "NATIONAL" ? rawScope : "DEPARTMENTS"
  const departmentCodes = readManyValues(formData, "departmentCodes")
  const regionCodes = readManyValues(formData, "regionCodes")

  if (!associationId) {
    redirect("/profile?territoriesError=Association+introuvable")
  }

  if (scope === "DEPARTMENTS" && departmentCodes.length === 0) {
    redirect("/profile?territoriesError=S%C3%A9lectionnez+au+moins+un+d%C3%A9partement")
  }

  if (scope === "REGIONS" && regionCodes.length === 0) {
    redirect("/profile?territoriesError=S%C3%A9lectionnez+au+moins+une+r%C3%A9gion")
  }

  try {
    await updateAssociationDepartmentsServer({
      id: associationId,
      scope,
      departmentCodes: scope === "DEPARTMENTS" ? departmentCodes : undefined,
      regionCodes: scope === "REGIONS" ? regionCodes : undefined,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la mise à jour du périmètre territorial."
    redirect(`/profile?territoriesError=${encodeURIComponent(message)}`)
  }

  revalidatePath("/profile")
  redirect("/profile?territoriesUpdated=1")
}

async function renderUserProfile() {
  const user = await getCurrentUserServer()

  let subscriptions: Awaited<ReturnType<typeof getMySubscriptionsServer>> = []
  let supports: Awaited<ReturnType<typeof getMySupportsServer>> = []

  try {
    subscriptions = await getMySubscriptionsServer()
  } catch {
    subscriptions = []
  }

  try {
    supports = await getMySupportsServer()
  } catch {
    supports = []
  }

  return (
    <>
      <SurfacePanel className="rounded-2xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Profil utilisateur</h1>
        <p className="mt-2 text-sm text-white/70">Nom d&apos;utilisateur: {user.username}</p>
      </SurfacePanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <SurfacePanel className="rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Abonnements</h2>

          {subscriptions.length === 0 ? (
            <p className="mt-2 text-sm text-white/65">Aucune association suivie.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {subscriptions.map((association) => (
                <li key={association.id}>
                  <Link
                    href={`/association/${association.id}`}
                    className="text-sm text-white/80 underline-offset-2 hover:text-white hover:underline"
                  >
                    {association.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SurfacePanel>

        <SurfacePanel className="rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Soutiens</h2>

          {supports.length === 0 ? (
            <p className="mt-2 text-sm text-white/65">Aucune association soutenue.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {supports.map((association) => (
                <li key={association.id}>
                  <Link
                    href={`/association/${association.id}`}
                    className="text-sm text-white/80 underline-offset-2 hover:text-white hover:underline"
                  >
                    {association.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SurfacePanel>
      </div>
    </>
  )
}

async function renderAssociationProfile(params: {
  descriptionUpdated: boolean
  descriptionError: string | null
  tagsUpdated: boolean
  territoriesUpdated: boolean
  tagsError: string | null
  territoriesError: string | null
}) {
  const [association, availableTags, availableDepartments, availableRegions] = await Promise.all([
    getMyAssociationServer(),
    getTagsServer(),
    getDepartmentsServer(),
    getRegionsServer(),
  ])

  const initialScope: DepartmentScope = association.departments.length ? "DEPARTMENTS" : "NATIONAL"

  return (
    <>
      <SurfacePanel className="rounded-2xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Profil association</h1>
        <p className="mt-2 text-sm text-white/70">Nom: {association.name}</p>
      </SurfacePanel>

      <AssociationSettingsEditor
        associationId={association.id}
        description={association.description ?? ""}
        tags={availableTags}
        departments={availableDepartments}
        regions={availableRegions}
        selectedTagCodes={association.tags.map((tag) => tag.code)}
        selectedDepartmentCodes={association.departments.map((department) => department.code)}
        initialScope={initialScope}
        descriptionUpdated={params.descriptionUpdated}
        descriptionError={params.descriptionError}
        tagsUpdated={params.tagsUpdated}
        territoriesUpdated={params.territoriesUpdated}
        tagsError={params.tagsError}
        territoriesError={params.territoriesError}
        descriptionAction={updateAssociationDescriptionAction}
        tagsAction={updateAssociationTagsAction}
        territoriesAction={updateAssociationTerritoriesAction}
      />

    </>
  )
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: ProfileSearchParams
}) {
  await ensureProtectedAccess("/profile")

  const params = await searchParams
  const descriptionUpdated = firstValue(params.descriptionUpdated) === "1"
  const descriptionError = firstValue(params.descriptionError) ?? null
  const tagsUpdated = firstValue(params.tagsUpdated) === "1"
  const territoriesUpdated = firstValue(params.territoriesUpdated) === "1"
  const tagsError = firstValue(params.tagsError) ?? null
  const territoriesError = firstValue(params.territoriesError) ?? null

  let userProfile: ReactNode | null = null
  let associationProfile: ReactNode | null = null
  let errorMessage: string | null = null

  try {
    userProfile = await renderUserProfile()
  } catch (error) {
    if (!(error instanceof ApiError) || (error.status !== 403 && error.status !== 404)) {
      errorMessage =
        error instanceof Error ? error.message : "Erreur lors du chargement du profil."
    }
  }

  if (!userProfile && !errorMessage) {
    try {
      associationProfile = await renderAssociationProfile({
        descriptionUpdated,
        descriptionError,
        tagsUpdated,
        territoriesUpdated,
        tagsError,
        territoriesError,
      })
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "Erreur lors du chargement du profil."
    }
  }

  if (errorMessage || (!userProfile && !associationProfile)) {
    return (
      <main className="app-shell-bg min-h-screen px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <SurfacePanel className="rounded-2xl p-6">
            <h1 className="text-xl font-semibold text-white">Profil</h1>
            <p className="mt-3 text-sm text-red-200">{errorMessage ?? "Erreur inattendue."}</p>
          </SurfacePanel>
        </div>
      </main>
    )
  }

  return (
    <main className="app-shell-bg min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-4">{userProfile ?? associationProfile}</div>
    </main>
  )
}
