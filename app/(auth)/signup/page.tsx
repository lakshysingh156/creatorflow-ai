import { AuthForm } from "@/components/auth/auth-form"

export default async function SignupPage({
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
      mode="signup"
      redirectTo={redirect ?? "/dashboard"}
      supabaseConfigured={supabaseConfigured}
    />
  )
}
