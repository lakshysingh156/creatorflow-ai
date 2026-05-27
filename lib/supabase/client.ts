import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseConfig } from "./config"

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured
}

export function createClient() {
  const { url, anonKey } = getSupabaseConfig()

  if (!url || !anonKey) {
    // Return a null-safe stub so components can check isSupabaseConfigured()
    // before calling auth methods. This prevents crashes during local dev.
    return null as never
  }

  return createBrowserClient(url, anonKey)
}
