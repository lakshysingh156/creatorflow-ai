import type { Platform } from "./types"

export const TONES = [
  "Confident",
  "Friendly",
  "Playful",
  "Authoritative",
  "Storytelling",
] as const

export const PLATFORMS: Platform[] = ["TikTok", "Instagram", "YouTube"]

export const AUDIENCES = [
  "Beginners",
  "Busy professionals",
  "Gen Z",
  "Parents",
  "Entrepreneurs",
  "Fitness enthusiasts",
] as const

export const CONTENT_GOALS = [
  "Grow followers",
  "Drive saves",
  "Boost engagement",
  "Sell a product",
  "Build authority",
  "Go viral",
] as const

export const SAMPLE_NICHES = [
  "beginner strength training",
  "personal finance for millennials",
  "productivity for remote workers",
  "skincare routines for acne",
  "meal prep for busy parents",
  "AI tools for creators",
]

export const AI_THINKING_STEPS = [
  "Analyzing niche patterns",
  "Mapping platform algorithm signals",
  "Calibrating tone & voice",
  "Generating retention hooks",
  "Optimizing for engagement",
  "Packaging content angles",
]

export const DEFAULT_WORKSPACE_METRICS = {
  totalGenerations: 47,
  savedPacks: 3,
  avgEngagementLift: 32,
  optimizationScore: 87,
  weeklyGenerations: 12,
  hookSuccessRate: 78,
}
