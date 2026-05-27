"use client"

import { useCallback, useState } from "react"
import { fetchGeneration, ApiError } from "@/lib/api-client"
import { AI_THINKING_STEPS } from "@/lib/constants"
import type { GenerationInput, GenerationResult } from "@/lib/types"

export type GenerationPhase = "idle" | "thinking" | "streaming" | "complete" | "error"

export function useGeneration() {
  const [phase, setPhase] = useState<GenerationPhase>("idle")
  const [thinkingStep, setThinkingStep] = useState(0)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aiPowered, setAiPowered] = useState(false)

  const runThinkingAnimation = useCallback(async () => {
    for (let i = 0; i < AI_THINKING_STEPS.length; i++) {
      setThinkingStep(i)
      await new Promise((r) => setTimeout(r, 420 + Math.random() * 280))
    }
  }, [])

  const generate = useCallback(
    async (input: GenerationInput) => {
      setPhase("thinking")
      setThinkingStep(0)
      setError(null)
      setResult(null)

      const thinkingPromise = runThinkingAnimation()
      const apiPromise = fetchGeneration(input)

      try {
        const [data] = await Promise.all([apiPromise, thinkingPromise])
        const powered = Boolean(data.aiPowered)
        setAiPowered(powered)
        setPhase("streaming")
        await new Promise((r) => setTimeout(r, 400))
        setResult(data)
        setPhase("complete")
        return { ...data, aiPowered: powered }
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setError("Sign in to generate content")
          } else if (err.code === "LIMIT_REACHED") {
            setError(err.message)
          } else {
            setError(err.message)
          }
        } else {
          setError(err instanceof Error ? err.message : "Something went wrong")
        }
        setPhase("error")
        return null
      }
    },
    [runThinkingAnimation]
  )

  const reset = useCallback(() => {
    setPhase("idle")
    setResult(null)
    setError(null)
    setThinkingStep(0)
  }, [])

  return {
    phase,
    thinkingStep,
    thinkingLabel: AI_THINKING_STEPS[thinkingStep] ?? AI_THINKING_STEPS[0],
    result,
    error,
    aiPowered,
    generate,
    reset,
    isLoading: phase === "thinking" || phase === "streaming",
  }
}
