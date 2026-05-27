import { createBrowserClient } from "@supabase/ssr"

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a null-safe stub so components can check isSupabaseConfigured()
    // before calling auth methods. This prevents crashes during local dev.
    return null as never
  }

  return createBrowserClient(url, key)
}
