import { NextRequest } from "next/server"
import { springAuthRouteFetch } from "@/lib/spring/route-client"

type RouteContext = {
  params: Promise<{
    associationId: string
  }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { associationId } = await context.params

  return springAuthRouteFetch(
    req,
    `/users/me/subscriptions/${encodeURIComponent(associationId)}`,
    {
      method: "POST",
    }
  )
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { associationId } = await context.params

  return springAuthRouteFetch(
    req,
    `/users/me/subscriptions/${encodeURIComponent(associationId)}`,
    {
      method: "DELETE",
    }
  )
}
