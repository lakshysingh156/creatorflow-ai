function cleanUrl(value?: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)

    // Common setup mistake: pasting REST endpoint instead of project root.
    if (parsed.pathname.startsWith("/rest/v1")) {
      parsed.pathname = ""
    }

    parsed.pathname = parsed.pathname.replace(/\/+$/, "")
    return parsed.toString().replace(/\/+$/, "")
  } catch {
    return null
  }
}

export function getSupabaseConfig() {
  const url = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || null
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null

  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured: Boolean(url && anonKey),
  }
}
