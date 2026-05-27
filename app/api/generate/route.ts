import { NextResponse } from "next/server"
import { z } from "zod"
import { generateContent } from "@/lib/gemini"
import { canGenerate } from "@/lib/subscription"
import type { GenerationInput } from "@/lib/types"
import { isSupabaseConfigured } from "@/lib/supabase/server"

const generateSchema = z.object({
  niche: z.string().min(2).max(200),
  tone: z.string().min(1),
  platform: z.enum(["TikTok", "Instagram", "YouTube"]),
  audience: z.string().min(1),
  goal: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = generateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. Please fill all fields." },
        { status: 400 }
      )
    }

    const input: GenerationInput = parsed.data

    // --- With Supabase: enforce auth + rate limits ---
    if (isSupabaseConfigured()) {
      const { requireUser, getUserSubscription } = await import("@/lib/auth")
      const {
        saveGeneration,
        getGenerationsCountToday,
        incrementGenerationCount,
      } = await import("@/lib/db/generations")
      const { logActivity } = await import("@/lib/db/activity")
      const { updateAnalyticsFromGeneration } = await import(
        "@/lib/db/analytics"
      )
      const { createWorkflow } = await import("@/lib/db/workflows")
      const { saveContentHistory } = await import("@/lib/db/content-history")
      const { createStrategyFromGeneration } = await import("@/lib/db/strategies")

      let user
      try {
        user = await requireUser()
      } catch {
        return NextResponse.json(
          { error: "Sign in required" },
          { status: 401 }
        )
      }

      const subscription = await getUserSubscription(user.id)
      const generationsToday = await getGenerationsCountToday(user.id)
      const gate = canGenerate(subscription, generationsToday)

      if (!gate.allowed) {
        return NextResponse.json(
          { error: gate.reason, code: "LIMIT_REACHED" },
          { status: 403 }
        )
      }

      const result = await generateContent(input)

      await Promise.allSettled([
        saveGeneration(user.id, result),
        saveContentHistory(user.id, result),
        createStrategyFromGeneration(user.id, result),
        incrementGenerationCount(user.id),
        updateAnalyticsFromGeneration(user.id, result.engagementPrediction),
        logActivity(
          user.id,
          "generation",
          `Generated content for "${input.niche}" on ${input.platform}`
        ),
        createWorkflow(
          user.id,
          `${input.niche} — ${input.platform}`,
          input.platform,
          result.id
        ),
      ])

      return NextResponse.json({
        ...result,
        aiPowered: true,
      })
    }

    // --- Public mode: generate without persistence ---
    const result = await generateContent(input)
    return NextResponse.json({
      ...result,
      aiPowered: true,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: error.message }, { status: 429 })
      }
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json({ error: error.message }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.error("API /generate error:", error)
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    )
  }
}
