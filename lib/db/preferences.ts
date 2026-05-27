import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { GenerationInput } from "@/lib/types"

export interface CreatorPreferences {
  defaultTone: string
  defaultPlatform: GenerationInput["platform"]
  defaultAudience: string
  defaultGoal: string
  niche: string | null
}

const DEFAULT_PREFERENCES: CreatorPreferences = {
  defaultTone: "Confident",
  defaultPlatform: "TikTok",
  defaultAudience: "Beginners",
  defaultGoal: "Grow followers",
  niche: null,
}

export async function getCreatorPreferences(
  userId: string
): Promise<CreatorPreferences> {
  if (!isSupabaseConfigured()) return DEFAULT_PREFERENCES
  const supabase = await createClient()
  if (!supabase) return DEFAULT_PREFERENCES

  const { data, error } = await supabase
    .from("creator_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data) return DEFAULT_PREFERENCES

  return {
    defaultTone: data.default_tone ?? DEFAULT_PREFERENCES.defaultTone,
    defaultPlatform: (data.default_platform ??
      DEFAULT_PREFERENCES.defaultPlatform) as GenerationInput["platform"],
    defaultAudience: data.default_audience ?? DEFAULT_PREFERENCES.defaultAudience,
    defaultGoal: data.default_goal ?? DEFAULT_PREFERENCES.defaultGoal,
    niche: data.niche ?? null,
  }
}

export async function upsertCreatorPreferences(
  userId: string,
  input: CreatorPreferences
) {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("creator_preferences")
    .upsert(
      {
        user_id: userId,
        default_tone: input.defaultTone,
        default_platform: input.defaultPlatform,
        default_audience: input.defaultAudience,
        default_goal: input.defaultGoal,
        niche: input.niche,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single()

  if (error) throw error
  return data
}
