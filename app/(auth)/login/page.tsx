import { AuthForm } from "@/components/auth/auth-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return (
    <AuthForm
      mode="login"
      redirectTo={redirect ?? "/dashboard"}
      supabaseConfigured={supabaseConfigured}
    />
  )
}
