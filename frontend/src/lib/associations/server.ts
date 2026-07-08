import { springFetch } from "@/lib/spring/server-client"
import { toSearchParams } from "@/lib/http/query"
import { readResponseMessage } from "@/lib/http/server-response"
import type { Page } from "@/types/page"
import type { Association } from "@/types/association"

export class AssociationApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

export async function searchAssociationsServer(params: {
    query?: string
    tags?: string[]
    departments?: string[]
    page?: number
    size?: number
}): Promise<Page<Association>> {
    const sp = toSearchParams({
        query: params.query,
        tags: params.tags,
        departments: params.departments,
        page: params.page,
        size: params.size,
    })

    const res = await springFetch(`/associations/search?${sp.toString()}`, {
        method: "GET",
    })

    if (!res.ok) {
        const message = await readResponseMessage(
            res,
            "Erreur lors du chargement des associations."
        )
        throw new AssociationApiError(res.status, message)
    }

    return res.json()
}
