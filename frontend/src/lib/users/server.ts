import { throwApiError } from "@/lib/http/api-error"
import { springAuthFetch } from "@/lib/spring/server-client"
import type { Association } from "@/types/association"
import type { User } from "@/types/user"

export async function getUserByIdServer(id: string): Promise<User> {
  const res = await springAuthFetch(`/users/${encodeURIComponent(id)}`, {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement de l'utilisateur.")
  }

  return res.json()
}

export async function getCurrentUserServer(): Promise<User> {
  const res = await springAuthFetch("/users/me", {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement du profil utilisateur.")
  }

  return res.json()
}

export async function subscribeToAssociationServer(associationId: string): Promise<void> {
  const res = await springAuthFetch(
    `/users/me/subscriptions/${encodeURIComponent(associationId)}`,
    {
      method: "POST",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de l'abonnement a l'association.")
  }
}

export async function unsubscribeFromAssociationServer(associationId: string): Promise<void> {
  const res = await springAuthFetch(
    `/users/me/subscriptions/${encodeURIComponent(associationId)}`,
    {
      method: "DELETE",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du desabonnement de l'association.")
  }
}

export async function getMySubscriptionsServer(): Promise<Association[]> {
  const res = await springAuthFetch("/users/me/subscriptions", {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement des abonnements.")
  }

  return res.json()
}

export async function supportAssociationServer(associationId: string): Promise<void> {
  const res = await springAuthFetch(
    `/users/me/supports/${encodeURIComponent(associationId)}`,
    {
      method: "POST",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du soutien de l'association.")
  }
}

export async function unsupportAssociationServer(associationId: string): Promise<void> {
  const res = await springAuthFetch(
    `/users/me/supports/${encodeURIComponent(associationId)}`,
    {
      method: "DELETE",
    }
  )

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du retrait du soutien de l'association.")
  }
}

export async function getMySupportsServer(): Promise<Association[]> {
  const res = await springAuthFetch("/users/me/supports", {
    method: "GET",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors du chargement des soutiens.")
  }

  return res.json()
}
