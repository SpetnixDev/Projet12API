import { toSearchParams } from "@/lib/http/query"
import { throwApiError } from "@/lib/http/api-error"
import { springAuthFetch } from "@/lib/spring/server-client"
import type { Association } from "@/types/association"
import type { DepartmentScope } from "@/types/territory"

export async function getMyAssociationServer(): Promise<Association> {
  const res = await springAuthFetch("/associations/me", {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement de l'association.")
  }

  return res.json()
}

export async function updateAssociationTagsServer(id: string, tags: string[]): Promise<void> {
  const params = toSearchParams({ tags })

  const res = await springAuthFetch(
    `/associations/${encodeURIComponent(id)}/tags?${params.toString()}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la mise à jour des tags.")
  }
}

export async function updateAssociationDepartmentsServer(params: {
  id: string
  scope: DepartmentScope
  departmentCodes?: string[]
  regionCodes?: string[]
}): Promise<void> {
  const searchParams = toSearchParams({
    scope: params.scope,
    departmentCodes: params.departmentCodes,
    regionCodes: params.regionCodes,
  })

  const res = await springAuthFetch(
    `/associations/${encodeURIComponent(params.id)}/departments?${searchParams.toString()}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la mise à jour des départements.")
  }
}

export async function updateAssociationDescriptionServer(
  id: string,
  description: string
): Promise<void> {
  const searchParams = new URLSearchParams()
  searchParams.set("description", description)

  const res = await springAuthFetch(
    `/associations/${encodeURIComponent(id)}/description?${searchParams.toString()}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la mise à jour de la description.")
  }
}
