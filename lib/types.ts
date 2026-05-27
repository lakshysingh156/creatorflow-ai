export type Platform = "TikTok" | "Instagram" | "YouTube"

export interface GenerationInput {
  niche: string
  tone: string
  platform: Platform
  audience: string
  goal: string
}

export interface ContentItem {
  id: string
  title: string
  content: string
  engagementScore?: number
}

export interface GenerationResult {
  id: string
  timestamp: string
  input: GenerationInput
  hooks: ContentItem[]
  captions: ContentItem[]
  ctas: ContentItem[]
  angles: ContentItem[]
  carousels: ContentItem[]
  emotionalTriggers: ContentItem[]
  strategySuggestions: ContentItem[]
  viralInsights: ContentItem[]
  engagementPrediction: number
  optimizationTips: string[]
  durationMs?: number
}

export type OutputTab =
  | "hooks"
  | "captions"
  | "ctas"
  | "angles"
  | "carousels"
  | "triggers"
  | "strategy"
  | "insights"

export interface WorkflowItem {
  id: string
  title: string
  stage: "idea" | "draft" | "scheduled" | "published"
  platform: string | null
  generationId: string | null
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  subscription_tier: "free" | "pro"
  subscription_status: string | null
  generations_this_month: number
}

export interface WorkspaceData {
  profile: Profile | null
  generations: GenerationResult[]
  hookPacks: SavedHookPack[]
  activity: ActivityEvent[]
  trending: TrendingTopic[]
  workflows: WorkflowItem[]
  analytics: {
    engagementScore: number
    hookSuccessRate: number
    weeklyGenerations: number
  }
  generationsToday: number
  subscription: {
    tier: "free" | "pro"
    status: string
  }
}

export interface SavedHookPack {
  id: string
  name: string
  hooks: ContentItem[]
  niche: string
  savedAt: string
}

export interface ActivityEvent {
  id: string
  type: "generation" | "save" | "optimize" | "trend"
  message: string
  timestamp: string
}

export interface TrendingTopic {
  id: string
  topic: string
  platform: Platform
  growth: string
  relevance: number
}
