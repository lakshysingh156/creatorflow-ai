import { NextResponse } from "next/server"
import { z } from "zod"
import { isSupabaseConfigured } from "@/lib/supabase/server"

const stageSchema = z.object({
  stage: z.enum(["idea", "draft", "scheduled", "published"]),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = stageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid workflow update" }, { status: 400 })
    }

    const { requireUser } = await import("@/lib/auth")
    const { updateWorkflowStage } = await import("@/lib/db/workflows")
    const { logActivity } = await import("@/lib/db/activity")

    const user = await requireUser()
    await updateWorkflowStage(user.id, id, parsed.data.stage)
    await logActivity(
      user.id,
      "optimize",
      `Workflow moved to ${parsed.data.stage} stage`
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}
