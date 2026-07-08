import RegisterForm from "./RegisterForm"

type Role = "USER" | "ASSOCIATION"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const rawType = params.type

  const initialType: Role = rawType === "ASSOCIATION" ? "ASSOCIATION" : "USER"

  return <RegisterForm initialType={initialType} />
}