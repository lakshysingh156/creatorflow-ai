import { AuthForm } from "@/components/auth/auth-form"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  const supabaseConfigured = isSupabaseConfigured()
  return (
    <AuthForm
      mode="signup"
      redirectTo={redirect ?? "/dashboard"}
      supabaseConfigured={supabaseConfigured}
    />
  )
}
