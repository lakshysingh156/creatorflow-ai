import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

const DEFAULT_ANALYTICS = {
  engagementScore: 72,
  hookSuccessRate: 68,
  weeklyGenerations: 0,
}

export async function getLatestAnalytics(userId: string) {
  if (!isSupabaseConfigured()) return DEFAULT_ANALYTICS
  const supabase = await createClient()
  if (!supabase) return DEFAULT_ANALYTICS

  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return DEFAULT_ANALYTICS

  return {
    engagementScore: data.engagement_score ?? 72,
    hookSuccessRate: data.hook_success_rate ?? 68,
    weeklyGenerations: data.weekly_generations ?? 0,
  }
}

export async function updateAnalyticsFromGeneration(
  userId: string,
  engagementPrediction: number
) {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  if (!supabase) return

  const current = await getLatestAnalytics(userId)
  const newScore = Math.round(
    (current.engagementScore + engagementPrediction) / 2
  )
  const newHookRate = Math.min(
    95,
    current.hookSuccessRate + Math.floor(Math.random() * 3)
  )

  await supabase.from("analytics_snapshots").insert({
    user_id: userId,
    engagement_score: newScore,
    hook_success_rate: newHookRate,
    weekly_generations: current.weeklyGenerations + 1,
  })
}
