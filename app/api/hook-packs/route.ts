import { NextResponse } from "next/server"
import { z } from "zod"
import { isSupabaseConfigured } from "@/lib/supabase/server"

const packSchema = z.object({
  name: z.string().min(1).max(100),
  niche: z.string(),
  hooks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      engagementScore: z.number().optional(),
    })
  ),
})

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json([])

  try {
    const { requireUser } = await import("@/lib/auth")
    const { getHookPacks } = await import("@/lib/db/hook-packs")
    const user = await requireUser()
    const packs = await getHookPacks(user.id)
    return NextResponse.json(packs)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Connect Supabase to save hook packs" },
      { status: 503 }
    )
  }

  try {
    const { requireUser } = await import("@/lib/auth")
    const { saveHookPack } = await import("@/lib/db/hook-packs")
    const { logActivity } = await import("@/lib/db/activity")

    const user = await requireUser()
    const body = await request.json()
    const parsed = packSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid pack data" }, { status: 400 })

    const pack = await saveHookPack(
      user.id,
      parsed.data.name,
      parsed.data.niche,
      parsed.data.hooks
    )
    await logActivity(user.id, "save", `Saved hook pack "${parsed.data.name}"`)

    return NextResponse.json(pack)
  } catch {
    return NextResponse.json({ error: "Failed to save pack" }, { status: 500 })
  }
}
