import { toSearchParams } from "@/lib/http/query"
import { throwApiError } from "@/lib/http/api-error"
import { springAuthFetch, springFetch } from "@/lib/spring/server-client"
import type { Page } from "@/types/page"
import type { Post, UpsertPostRequest } from "@/types/post"

export async function createAssociationPostServer(
  associationId: string,
  payload: UpsertPostRequest
): Promise<Post> {
  const res = await springAuthFetch(`/posts/association/${encodeURIComponent(associationId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la creation du post.")
  }

  return res.json()
}

export async function getPostByIdServer(id: number): Promise<Post> {
  const res = await springFetch(`/posts/${id}`, {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement du post.")
  }

  return res.json()
}

export async function getAssociationPostsServer(params: {
  associationId: string
  page?: number
  size?: number
}): Promise<Page<Post>> {
  const searchParams = toSearchParams({
    page: params.page,
    size: params.size,
  })

  const res = await springFetch(
    `/posts/association/${encodeURIComponent(params.associationId)}?${searchParams.toString()}`,
    {
      method: "GET",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement des posts de l'association.")
  }

  return res.json()
}

export async function getFeedPostsServer(params: {
  page?: number
  size?: number
}): Promise<Page<Post>> {
  const searchParams = toSearchParams({
    page: params.page,
    size: params.size,
  })

  const res = await springAuthFetch(`/posts/feed?${searchParams.toString()}`, {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement du flux.")
  }

  return res.json()
}

export async function updatePostServer(id: number, payload: UpsertPostRequest): Promise<Post> {
  const res = await springAuthFetch(`/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la mise a jour du post.")
  }

  return res.json()
}

export async function deletePostServer(id: number): Promise<void> {
  const res = await springAuthFetch(`/posts/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la suppression du post.")
  }
}
