import { readResponseMessage } from "@/lib/http/server-response"
import { springFetch } from "@/lib/spring/server-client"
import type { Department, Region, Tag } from "@/types/association"

export class ReferenceApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function getTagsServer(): Promise<Tag[]> {
  const res = await springFetch("/tags", {
    method: "GET",
  })

  if (!res.ok) {
    throw new ReferenceApiError(
      res.status,
      await readResponseMessage(res, "Erreur lors du chargement des tags.")
    )
  }

  return res.json()
}

export async function getDepartmentsServer(): Promise<Department[]> {
  const res = await springFetch("/territories/departments", {
    method: "GET",
  })

  if (!res.ok) {
    throw new ReferenceApiError(
      res.status,
      await readResponseMessage(res, "Erreur lors du chargement des départements.")
    )
  }

  return res.json()
}

export async function getRegionsServer(): Promise<Region[]> {
  const res = await springFetch("/territories/regions", {
    method: "GET",
  })

  if (!res.ok) {
    throw new ReferenceApiError(
      res.status,
      await readResponseMessage(res, "Erreur lors du chargement des regions.")
    )
  }

  return res.json()
}