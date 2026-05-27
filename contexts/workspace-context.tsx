"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  ActivityEvent,
  GenerationResult,
  SavedHookPack,
  TrendingTopic,
  WorkspaceData,
} from "@/lib/types"
import type { WorkflowItem } from "@/lib/types"

interface WorkspaceContextValue {
  loading: boolean
  error: string | null
  history: GenerationResult[]
  savedPacks: SavedHookPack[]
  activity: ActivityEvent[]
  trending: TrendingTopic[]
  workflows: WorkflowItem[]
  subscription: { tier: "free" | "pro"; status: string }
  generationsToday: number
  analytics: WorkspaceData["analytics"]
  profile: WorkspaceData["profile"]
  refresh: () => Promise<void>
  addGeneration: (result: GenerationResult) => void
  saveHookPack: (name: string, result: GenerationResult) => Promise<void>
  removeSavedPack: (id: string) => void
  metrics: {
    totalGenerations: number
    savedPacks: number
    avgEngagementLift: number
    optimizationScore: number
    weeklyGenerations: number
    hookSuccessRate: number
  }
  isPro: boolean
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Partial<WorkspaceData>>({})

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch("/api/workspace")
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized")
        throw new Error("Failed to load workspace")
      }
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addGeneration = useCallback((result: GenerationResult) => {
    setData((prev) => ({
      ...prev,
      generations: [result, ...(prev.generations ?? [])].slice(0, 20),
      generationsToday: (prev.generationsToday ?? 0) + 1,
    }))
    refresh()
  }, [refresh])

  const saveHookPack = useCallback(
    async (name: string, result: GenerationResult) => {
      const res = await fetch("/api/hook-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          niche: result.input.niche,
          hooks: result.hooks,
        }),
      })
      if (!res.ok) throw new Error("Failed to save pack")
      await refresh()
    },
    [refresh]
  )

  const removeSavedPack = useCallback(
    async (id: string) => {
      setData((prev) => ({
        ...prev,
        hookPacks: (prev.hookPacks ?? []).filter((p) => p.id !== id),
      }))
    },
    []
  )

  const subscription = data.subscription ?? { tier: "free" as const, status: "inactive" }
  const analytics = data.analytics ?? {
    engagementScore: 72,
    hookSuccessRate: 68,
    weeklyGenerations: 0,
  }

  const metrics = useMemo(
    () => ({
      totalGenerations: data.profile?.generations_this_month ?? data.generations?.length ?? 0,
      savedPacks: data.hookPacks?.length ?? 0,
      avgEngagementLift: Math.max(12, analytics.engagementScore - 40),
      optimizationScore: analytics.engagementScore,
      weeklyGenerations: analytics.weeklyGenerations,
      hookSuccessRate: analytics.hookSuccessRate,
    }),
    [data, analytics]
  )

  const value = useMemo(
    () => ({
      loading,
      error,
      history: data.generations ?? [],
      savedPacks: data.hookPacks ?? [],
      activity: data.activity ?? [],
      trending: data.trending ?? [],
      workflows: data.workflows ?? [],
      subscription,
      generationsToday: data.generationsToday ?? 0,
      analytics,
      profile: data.profile ?? null,
      refresh,
      addGeneration,
      saveHookPack,
      removeSavedPack,
      metrics,
      isPro: subscription.tier === "pro",
    }),
    [
      loading,
      error,
      data,
      subscription,
      analytics,
      refresh,
      addGeneration,
      saveHookPack,
      removeSavedPack,
      metrics,
    ]
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider")
  }
  return ctx
}
