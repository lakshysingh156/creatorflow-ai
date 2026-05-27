import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { GenerationResult } from "@/lib/types"

type HistoryType =
  | "hook"
  | "caption"
  | "cta"
  | "angle"
  | "carousel"
  | "trigger"
  | "strategy"
  | "insight"

export async function saveContentHistory(
  userId: string,
  generation: GenerationResult
) {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  if (!supabase) return

  const rows: {
    user_id: string
    generation_id: string
    content_type: HistoryType
    title: string
    content: string
    score: number | null
  }[] = []

  const pushItems = (
    type: HistoryType,
    items: { title: string; content: string; engagementScore?: number }[]
  ) => {
    items.forEach((item) =>
      rows.push({
        user_id: userId,
        generation_id: generation.id,
        content_type: type,
        title: item.title,
        content: item.content,
        score: item.engagementScore ?? null,
      })
    )
  }

  pushItems("hook", generation.hooks)
  pushItems("caption", generation.captions)
  pushItems("cta", generation.ctas)
  pushItems("angle", generation.angles)
  pushItems("carousel", generation.carousels)
  pushItems("trigger", generation.emotionalTriggers)
  pushItems("strategy", generation.strategySuggestions)
  pushItems("insight", generation.viralInsights)

  if (rows.length === 0) return
  await supabase.from("content_history").insert(rows)
}
