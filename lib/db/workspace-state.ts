import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { GenerationInput } from "@/lib/types"

export interface WorkspaceState {
  workspaceName: string
  lastInput: GenerationInput | null
  dashboardState: Record<string, unknown>
}

const DEFAULT_WORKSPACE_STATE: WorkspaceState = {
  workspaceName: "My Workspace",
  lastInput: null,
  dashboardState: {},
}

export async function getWorkspaceState(userId: string): Promise<WorkspaceState> {
  if (!isSupabaseConfigured()) return DEFAULT_WORKSPACE_STATE
  const supabase = await createClient()
  if (!supabase) return DEFAULT_WORKSPACE_STATE

  const { data, error } = await supabase
    .from("creator_workspaces")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data) return DEFAULT_WORKSPACE_STATE

  return {
    workspaceName: data.workspace_name ?? "My Workspace",
    lastInput: (data.last_input as GenerationInput | null) ?? null,
    dashboardState: (data.dashboard_state as Record<string, unknown>) ?? {},
  }
}

export async function upsertWorkspaceState(
  userId: string,
  state: Partial<WorkspaceState>
) {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null

  const payload: Record<string, unknown> = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  }

  if (state.workspaceName !== undefined) payload.workspace_name = state.workspaceName
  if (state.lastInput !== undefined) payload.last_input = state.lastInput
  if (state.dashboardState !== undefined)
    payload.dashboard_state = state.dashboardState

  const { data, error } = await supabase
    .from("creator_workspaces")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single()

  if (error) throw error
  return data
}
