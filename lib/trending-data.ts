import type { TrendingTopic } from "./types"
import { createId } from "./id"

export const INITIAL_TRENDING: TrendingTopic[] = [
  {
    id: createId("trend"),
    topic: "3-second hook frameworks",
    platform: "TikTok",
    growth: "+42%",
    relevance: 92,
  },
  {
    id: createId("trend"),
    topic: "Carousel storytelling",
    platform: "Instagram",
    growth: "+28%",
    relevance: 88,
  },
  {
    id: createId("trend"),
    topic: "Shorts retention loops",
    platform: "YouTube",
    growth: "+35%",
    relevance: 85,
  },
  {
    id: createId("trend"),
    topic: "Comment-to-DM funnels",
    platform: "TikTok",
    growth: "+19%",
    relevance: 79,
  },
]
