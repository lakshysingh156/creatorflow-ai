import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { ActivityEvent } from "@/lib/types"

export async function logActivity(
  userId: string,
  type: ActivityEvent["type"] | "billing",
  message: string,
  metadata?: Record<string, unknown>
) {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  if (!supabase) return

  await supabase
    .from("ai_activity")
    .insert({ user_id: userId, type, message, metadata })
}

export async function getActivity(userId: string, limit = 20) {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("ai_activity")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []).map(
    (row) =>
      ({
        id: row.id,
        type: row.type as ActivityEvent["type"],
        message: row.message,
        timestamp: row.created_at,
      }) satisfies ActivityEvent
  )
}
