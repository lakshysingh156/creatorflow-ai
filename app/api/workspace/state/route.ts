import { NextResponse } from "next/server"
import { z } from "zod"
import { isSupabaseConfigured } from "@/lib/supabase/server"

const stateSchema = z.object({
  workspaceName: z.string().min(1).optional(),
  lastInput: z
    .object({
      niche: z.string(),
      tone: z.string(),
      platform: z.enum(["TikTok", "Instagram", "YouTube"]),
      audience: z.string(),
      goal: z.string(),
    })
    .nullable()
    .optional(),
  dashboardState: z.record(z.string(), z.unknown()).optional(),
})

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json(null)

  try {
    const { requireUser } = await import("@/lib/auth")
    const { getWorkspaceState } = await import("@/lib/db/workspace-state")
    const user = await requireUser()
    const state = await getWorkspaceState(user.id)
    return NextResponse.json(state)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }

  try {
    const { requireUser } = await import("@/lib/auth")
    const { upsertWorkspaceState } = await import("@/lib/db/workspace-state")

    const body = await request.json()
    const parsed = stateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid workspace state" }, { status: 400 })
    }

    const user = await requireUser()
    await upsertWorkspaceState(user.id, parsed.data)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to save workspace state" }, { status: 500 })
  }
}
