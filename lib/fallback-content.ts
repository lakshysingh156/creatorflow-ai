import type { ContentItem, GenerationInput } from "./types"
import { createId } from "./id"

function item(title: string, content: string, score?: number): ContentItem {
  return { id: createId("item"), title, content, engagementScore: score }
}

const toneModifiers: Record<string, { prefix: string; style: string }> = {
  Confident: { prefix: "Stop", style: "direct and assertive" },
  Friendly: { prefix: "Hey", style: "warm and conversational" },
  Playful: { prefix: "POV:", style: "witty and light" },
  Authoritative: { prefix: "Here's the truth:", style: "expert and credible" },
  Storytelling: { prefix: "6 months ago", style: "narrative-driven" },
}

const platformHints: Record<string, string> = {
  TikTok: "scroll-stopping first 2 seconds",
  Instagram: "save-worthy carousel energy",
  YouTube: "retention-focused Shorts hook",
}

export function generateFallbackContent(input: GenerationInput) {
  const { niche, tone, platform, audience, goal } = input
  const mod = toneModifiers[tone] ?? toneModifiers.Confident
  const hint = platformHints[platform] ?? "high retention"

  const hooks: ContentItem[] = [
    item(
      "Pattern Interrupt",
      `${mod.prefix} scrolling if you're serious about ${niche} — this changed everything for ${audience.toLowerCase()}.`,
      82
    ),
    item(
      "Curiosity Gap",
      `Nobody talks about this ${niche} mistake (and it's costing you ${goal.toLowerCase()}).`,
      79
    ),
    item(
      "Bold Claim",
      `I tested 30 ${niche} strategies. Only 3 actually work for ${platform}.`,
      85
    ),
    item(
      "Direct Address",
      `If you're a ${audience.toLowerCase()} trying to ${goal.toLowerCase()}, watch this.`,
      77
    ),
  ]

  const captions: ContentItem[] = [
    item(
      "Hook + Value",
      `${mod.prefix}: the ${tone.toLowerCase()} guide to ${niche}.\n\n3 things I wish I knew:\n1) Start here\n2) Avoid this trap\n3) Do this daily\n\nOptimized for ${hint}.`,
      74
    ),
    item(
      "Story Lead",
      `${mod.prefix} I had zero results with ${niche}. Then I changed ONE thing.\n\nHere's the exact framework (${mod.style}).`,
      81
    ),
    item(
      "Listicle",
      `5 ${niche} tips that actually help ${audience.toLowerCase()} ${goal.toLowerCase()}:\n\n→ Save this for later`,
      76
    ),
  ]

  const ctas: ContentItem[] = [
    item("Soft CTA", `Save this — you'll need it when you're ready to level up your ${niche} game.`, 71),
    item("Comment Bait", `Comment "GUIDE" and I'll send my free ${niche} checklist.`, 83),
    item("Follow CTA", `Follow for daily ${niche} breakdowns built for ${platform}.`, 69),
  ]

  const angles: ContentItem[] = [
    item("Myth Buster", `3 ${niche} myths keeping ${audience.toLowerCase()} stuck (and what to do instead).`, 80),
    item("Before/After", `What 30 days of focused ${niche} looks like — real results, no fluff.`, 78),
    item("Contrarian Take", `Why popular ${niche} advice fails on ${platform} — and the alternative.`, 84),
  ]

  const carousels: ContentItem[] = [
    item(
      "Slide Framework",
      `Slide 1: The ${niche} problem nobody admits\nSlide 2: Why ${audience} struggle\nSlide 3: The 3-step fix\nSlide 4: Proof / example\nSlide 5: CTA — ${goal}`,
      86
    ),
    item(
      "Swipe Series",
      `Carousel: "How I ${goal.toLowerCase()} with ${niche}" — 5 slides, ${tone} tone, ${platform}-native pacing.`,
      79
    ),
  ]

  const engagementPrediction = Math.min(
    95,
    Math.round(68 + hooks[2].engagementScore! / 10 + (tone === "Playful" ? 3 : 0))
  )

  const emotionalTriggers: ContentItem[] = [
    item("FOMO", `Everyone in ${niche} is doing this except you — here's the gap.`, 81),
    item("Identity", `If you're a ${audience.toLowerCase()} who cares about ${goal.toLowerCase()}, this is for you.`, 79),
    item("Curiosity", `The ${niche} secret that feels almost unfair once you know it.`, 84),
  ]

  const strategySuggestions: ContentItem[] = [
    item("Content Pillars", `Build 3 pillars: education, proof, and ${tone.toLowerCase()} personality for ${platform}.`, 82),
    item("Posting Cadence", `Post 4–5x/week on ${platform}; batch ${niche} content on Sundays.`, 77),
    item("Growth Loop", `Hook → value → CTA → DM funnel. Optimize for ${goal.toLowerCase()}.`, 85),
  ]

  const viralInsights: ContentItem[] = [
    item("Format Trend", `${platform} is favoring raw ${niche} tutorials under 45 seconds right now.`, 83),
    item("Hook Pattern", `Question-led hooks outperform statements by ~22% in ${niche}.`, 80),
    item("Audience Signal", `${audience} engage most with before/after proof in this niche.`, 78),
  ]

  const optimizationTips = [
    `Lead with hook #3 on ${platform} — highest predicted retention.`,
    `Pair caption #2 with ${tone.toLowerCase()} voice for brand consistency.`,
    `Post when ${audience.toLowerCase()} are most active (test Tue/Thu 6–9pm).`,
  ]

  return {
    hooks,
    captions,
    ctas,
    angles,
    carousels,
    emotionalTriggers,
    strategySuggestions,
    viralInsights,
    engagementPrediction,
    optimizationTips,
  }
}
