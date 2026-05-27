import type { GenerationInput, GenerationResult } from "./types"

const GEMINI_MODEL = "gemini-2.0-flash"

interface RawGeminiPayload {
  hooks: { title: string; content: string; engagementScore?: number }[]
  captions: { title: string; content: string; engagementScore?: number }[]
  ctas: { title: string; content: string; engagementScore?: number }[]
  angles: { title: string; content: string; engagementScore?: number }[]
  carousels: { title: string; content: string; engagementScore?: number }[]
  emotionalTriggers: { title: string; content: string; engagementScore?: number }[]
  strategySuggestions: { title: string; content: string; engagementScore?: number }[]
  viralInsights: { title: string; content: string; engagementScore?: number }[]
  engagementPrediction: number
  optimizationTips: string[]
}

function buildPrompt(input: GenerationInput): string {
  return `You are CreatorFlow AI, an expert short-form content strategist and viral growth analyst.

Generate creator content for:
- Niche: ${input.niche}
- Tone: ${input.tone} (MUST strongly shape all wording)
- Platform: ${input.platform}
- Audience: ${input.audience}
- Content goal: ${input.goal}

Return ONLY valid JSON (no markdown) matching:
{
  "hooks": [{"title": "string", "content": "string", "engagementScore": number}],
  "captions": [...],
  "ctas": [...],
  "angles": [...],
  "carousels": [...],
  "emotionalTriggers": [{"title": "string", "content": "string", "engagementScore": number}],
  "strategySuggestions": [{"title": "string", "content": "string", "engagementScore": number}],
  "viralInsights": [{"title": "string", "content": "string", "engagementScore": number}],
  "engagementPrediction": number,
  "optimizationTips": ["string", "string", "string"]
}

Counts: 4 hooks, 3 captions, 3 CTAs, 3 angles, 2 carousels, 3 emotional triggers, 3 strategy suggestions, 3 viral research insights.
emotionalTriggers: psychological hooks (FOMO, curiosity, identity, etc.)
strategySuggestions: actionable creator growth tactics for this niche
viralInsights: trend/format research specific to ${input.platform}
engagementPrediction: 65-92. Tone "${input.tone}" must be unmistakable.`
}

function mapItems(
  items: { title: string; content: string; engagementScore?: number }[]
) {
  return items.map((item) => ({
    id: crypto.randomUUID(),
    title: item.title,
    content: item.content,
    engagementScore: item.engagementScore ?? 75,
  }))
}

function parseGeminiText(text: string): RawGeminiPayload {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  return JSON.parse(cleaned) as RawGeminiPayload
}

function buildResult(
  input: GenerationInput,
  parsed: RawGeminiPayload,
  durationMs: number
): GenerationResult {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    input,
    hooks: mapItems(parsed.hooks ?? []),
    captions: mapItems(parsed.captions ?? []),
    ctas: mapItems(parsed.ctas ?? []),
    angles: mapItems(parsed.angles ?? []),
    carousels: mapItems(parsed.carousels ?? []),
    emotionalTriggers: mapItems(parsed.emotionalTriggers ?? []),
    strategySuggestions: mapItems(parsed.strategySuggestions ?? []),
    viralInsights: mapItems(parsed.viralInsights ?? []),
    engagementPrediction: parsed.engagementPrediction ?? 78,
    optimizationTips: parsed.optimizationTips ?? [],
    durationMs,
  }
}

export async function generateContent(
  input: GenerationInput
): Promise<GenerationResult> {
  const start = Date.now()
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Configure it to generate content.")
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(input) }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error("Gemini API error:", response.status, err)
      if (response.status === 429) {
        throw new Error("AI rate limit reached. Please try again in a minute.")
      }
      throw new Error("Gemini request failed")
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as
      | string
      | undefined

    if (!text) throw new Error("Empty Gemini response")

    const parsed = parseGeminiText(text)
    return buildResult(input, parsed, Date.now() - start)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Generation failed")
  }
}
