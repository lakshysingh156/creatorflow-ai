import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseConfig } from "./config"

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured
}

export async function createClient() {
  const { url, anonKey } = getSupabaseConfig()

  if (!url || !anonKey) {
    return null as never
  }

  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — proxy handles refresh
        }
      },
    },
  })
}

export async function createServiceClient() {
  const { url, serviceRoleKey } = getSupabaseConfig()

  if (!url || !serviceRoleKey) return null as never

  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  )
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
