import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { GenerationResult } from "@/lib/types"

export async function saveGeneration(userId: string, result: GenerationResult) {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("generations")
    .insert({
      id: result.id,
      user_id: userId,
      niche: result.input.niche,
      tone: result.input.tone,
      platform: result.input.platform,
      audience: result.input.audience,
      goal: result.input.goal,
      result_json: result,
      engagement_prediction: result.engagementPrediction,
      duration_ms: result.durationMs,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getGenerations(userId: string, limit = 20) {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []).map((row) => row.result_json as GenerationResult)
}

export async function getGenerationsCountToday(userId: string) {
  if (!isSupabaseConfigured()) return 0
  const supabase = await createClient()
  if (!supabase) return 0

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString())

  if (error) return 0
  return count ?? 0
}

export async function incrementGenerationCount(userId: string) {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  if (!supabase) return

  const profile = await supabase
    .from("profiles")
    .select("generations_this_month")
    .eq("id", userId)
    .single()

  const current = profile.data?.generations_this_month ?? 0
  await supabase
    .from("profiles")
    .update({
      generations_this_month: current + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
}
