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
  preferences: {
    defaultTone: "Confident",
    defaultPlatform: "TikTok",
    defaultAudience: "Beginners",
    defaultGoal: "Grow followers",
    niche: null,
  },
  workspaceState: {
    workspaceName: "My Workspace",
    lastInput: null,
    dashboardState: {},
  },
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
    const { getCreatorPreferences } = await import("@/lib/db/preferences")
    const { getWorkspaceState } = await import("@/lib/db/workspace-state")

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
      preferences,
      workspaceState,
      generationsToday,
    ] = await Promise.all([
      getUserProfile(user.id),
      getGenerations(user.id),
      getHookPacks(user.id),
      getActivity(user.id),
      getWorkflows(user.id),
      getLatestAnalytics(user.id),
      getCreatorPreferences(user.id),
      getWorkspaceState(user.id),
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
      preferences,
      workspaceState,
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
