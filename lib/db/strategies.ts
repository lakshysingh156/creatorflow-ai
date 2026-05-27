import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { ContentItem, GenerationResult } from "@/lib/types"

export interface CreatorStrategy {
  id: string
  title: string
  summary: string | null
  status: "active" | "archived"
  createdAt: string
}

function buildSummary(items: ContentItem[]) {
  return items
    .slice(0, 2)
    .map((item) => item.content)
    .join(" ")
    .slice(0, 280)
}

export async function createStrategyFromGeneration(
  userId: string,
  generation: GenerationResult
) {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("creator_strategies")
    .insert({
      user_id: userId,
      generation_id: generation.id,
      title: `${generation.input.niche} strategy`,
      summary: buildSummary(generation.strategySuggestions),
      strategy_json: {
        niche: generation.input.niche,
        platform: generation.input.platform,
        suggestions: generation.strategySuggestions,
        insights: generation.viralInsights,
      },
      status: "active",
    })
    .select("id,title,summary,status,created_at")
    .single()

  if (error) return null
  return {
    id: data.id,
    title: data.title,
    summary: data.summary,
    status: data.status,
    createdAt: data.created_at,
  } satisfies CreatorStrategy
}
