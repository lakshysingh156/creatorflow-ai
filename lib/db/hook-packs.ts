import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { ContentItem, SavedHookPack } from "@/lib/types"

export async function saveHookPack(
  userId: string,
  name: string,
  niche: string,
  hooks: ContentItem[]
) {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured")
  const supabase = await createClient()
  if (!supabase) throw new Error("Supabase not configured")

  const { data, error } = await supabase
    .from("hook_packs")
    .insert({ user_id: userId, name, niche, hooks_json: hooks })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    hooks: data.hooks_json as ContentItem[],
    niche: data.niche,
    savedAt: data.created_at,
  } satisfies SavedHookPack
}

export async function getHookPacks(userId: string) {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("hook_packs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) return []
  return (data ?? []).map(
    (row) =>
      ({
        id: row.id,
        name: row.name,
        hooks: row.hooks_json as ContentItem[],
        niche: row.niche,
        savedAt: row.created_at,
      }) satisfies SavedHookPack
  )
}

export async function deleteHookPack(userId: string, packId: string) {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  if (!supabase) return

  const { error } = await supabase
    .from("hook_packs")
    .delete()
    .eq("id", packId)
    .eq("user_id", userId)

  if (error) throw error
}
