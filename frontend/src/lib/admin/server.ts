import { throwApiError } from "@/lib/http/api-error"
import { springAuthFetch } from "@/lib/spring/server-client"

export async function syncTerritoriesServer(): Promise<void> {
  const res = await springAuthFetch("/admin/territories/sync", {
    method: "POST",
  })

  if (!res.ok) {
    await throwApiError(res, "Erreur lors de la synchronisation des territoires.")
  }
}
