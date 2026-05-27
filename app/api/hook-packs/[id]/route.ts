import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }

  try {
    const { id } = await params
    const { requireUser } = await import("@/lib/auth")
    const { deleteHookPack } = await import("@/lib/db/hook-packs")
    const { logActivity } = await import("@/lib/db/activity")

    const user = await requireUser()
    await deleteHookPack(user.id, id)
    await logActivity(user.id, "save", "Removed a saved hook pack")

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete pack" }, { status: 500 })
  }
}
