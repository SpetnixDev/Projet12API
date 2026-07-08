import { notFound } from "next/navigation"
import { springFetch } from "@/lib/spring/server-client"
import { AssociationApiError } from "@/lib/associations/server"
import { readResponseMessage } from "@/lib/http/server-response"
import type { Association } from "@/types/association"

export async function getAssociationByIdServer(id: string): Promise<Association> {
    const res = await springFetch(`/associations/${encodeURIComponent(id)}`, {
        method: "GET",
    })

    if (res.status === 404) {
        notFound()
    }

    if (!res.ok) {
        const message = await readResponseMessage(
            res,
            "Erreur lors du chargement de l’association."
        )
        throw new AssociationApiError(res.status, message)
    }

    return res.json()
}
