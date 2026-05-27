import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { WorkflowItem } from "@/lib/types"

export async function getWorkflows(userId: string) {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(30)

  if (error) return []
  return (data ?? []).map(
    (row) =>
      ({
        id: row.id,
        title: row.title,
        stage: row.stage,
        platform: row.platform,
        generationId: row.generation_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }) satisfies WorkflowItem
  )
}

export async function createWorkflow(
  userId: string,
  title: string,
  platform?: string,
  generationId?: string
) {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("workflows")
    .insert({
      user_id: userId,
      title,
      platform,
      generation_id: generationId,
      stage: "idea",
    })
    .select()
    .single()

  if (error) return null
  return data
}

export async function updateWorkflowStage(
  userId: string,
  workflowId: string,
  stage: WorkflowItem["stage"]
) {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  if (!supabase) return

  await supabase
    .from("workflows")
    .update({ stage, updated_at: new Date().toISOString() })
    .eq("id", workflowId)
    .eq("user_id", userId)
}
