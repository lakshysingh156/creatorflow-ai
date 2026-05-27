import { NextResponse } from "next/server"
import { z } from "zod"
import { isSupabaseConfigured } from "@/lib/supabase/server"

const preferencesSchema = z.object({
  defaultTone: z.string().min(1),
  defaultPlatform: z.enum(["TikTok", "Instagram", "YouTube"]),
  defaultAudience: z.string().min(1),
  defaultGoal: z.string().min(1),
  niche: z.string().nullable(),
})

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json(null)

  try {
    const { requireUser } = await import("@/lib/auth")
    const { getCreatorPreferences } = await import("@/lib/db/preferences")
    const user = await requireUser()
    const preferences = await getCreatorPreferences(user.id)
    return NextResponse.json(preferences)
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
    const { upsertCreatorPreferences } = await import("@/lib/db/preferences")
    const user = await requireUser()

    const body = await request.json()
    const parsed = preferencesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid preferences" }, { status: 400 })
    }

    await upsertCreatorPreferences(user.id, parsed.data)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 })
  }
}
