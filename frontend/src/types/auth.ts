export type AccountType = "USER" | "ASSOCIATION"

export interface RegisterRequest {
    email: string
    password: string
    name: string
}