import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import { INITIAL_TRENDING } from "@/lib/trending-data"

const DEMO_WORKSPACE = {
  profile: null,
  generations: [],
  hookPacks: [],
  activity: [
    {
      id: "demo-1",
      type: "optimize",
      message: "Demo mode — connect Supabase to enable persistence",
      timestamp: new Date().toISOString(),
    },
  ],
  workflows: [],
  analytics: { engagementScore: 72, hookSuccessRate: 68, weeklyGenerations: 0 },
  trending: INITIAL_TRENDING,
  generationsToday: 0,
  subscription: { tier: "free", status: "demo" },
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(DEMO_WORKSPACE)
  }

  try {
    const { requireUser, getUserProfile, getUserSubscription } = await import(
      "@/lib/auth"
    )
    const { getGenerations, getGenerationsCountToday } = await import(
      "@/lib/db/generations"
    )
    const { getHookPacks } = await import("@/lib/db/hook-packs")
    const { getActivity } = await import("@/lib/db/activity")
    const { getWorkflows } = await import("@/lib/db/workflows")
    const { getLatestAnalytics } = await import("@/lib/db/analytics")

    let user
    try {
      user = await requireUser()
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      profile,
      generations,
      hookPacks,
      activity,
      workflows,
      analytics,
      generationsToday,
    ] = await Promise.all([
      getUserProfile(user.id),
      getGenerations(user.id),
      getHookPacks(user.id),
      getActivity(user.id),
      getWorkflows(user.id),
      getLatestAnalytics(user.id),
      getGenerationsCountToday(user.id),
    ])

    const subscription = await getUserSubscription(user.id)

    return NextResponse.json({
      profile,
      generations,
      hookPacks,
      activity,
      workflows,
      analytics,
      trending: INITIAL_TRENDING,
      generationsToday,
      subscription: { tier: subscription.tier, status: subscription.status },
    })
  } catch (error) {
    console.error("Workspace fetch error:", error)
    return NextResponse.json(
      { error: "Failed to load workspace" },
      { status: 500 }
    )
  }
}
