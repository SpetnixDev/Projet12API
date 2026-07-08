import { readResponseMessage } from "@/lib/http/server-response"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function throwApiError(res: Response, fallback: string): Promise<never> {
  const message = await readResponseMessage(res, fallback)
  throw new ApiError(res.status, message)
}
