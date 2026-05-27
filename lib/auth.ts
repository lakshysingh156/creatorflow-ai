import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { UserSubscription } from "./subscription"

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) return null
  return data
}

export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  const profile = await getUserProfile(userId)
  return {
    tier: (profile?.subscription_tier as "free" | "pro") ?? "free",
    status: profile?.subscription_status ?? "inactive",
    generationsThisMonth: profile?.generations_this_month ?? 0,
  }
}
