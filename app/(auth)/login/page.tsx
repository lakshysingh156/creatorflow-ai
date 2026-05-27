import { AuthForm } from "@/components/auth/auth-form"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  const supabaseConfigured = isSupabaseConfigured()
  return (
    <AuthForm
      mode="login"
      redirectTo={redirect ?? "/dashboard"}
      supabaseConfigured={supabaseConfigured}
    />
  )
}
