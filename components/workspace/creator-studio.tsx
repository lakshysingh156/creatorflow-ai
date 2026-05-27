"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { Loader2, Shuffle, Sparkles } from "lucide-react"
import { PLANS } from "@/lib/plans"
import { Button } from "@/components/ui/button"
import {
  ConfigCommandBar,
  defaultGenerationInput,
} from "@/components/config-command-bar"
import { AiProcessing } from "@/components/ai-processing"
import { GenerationOutput } from "@/components/generation-output"
import { useWorkspace } from "@/contexts/workspace-context"
import { useGeneration } from "@/hooks/use-generation"
import { SAMPLE_NICHES } from "@/lib/constants"
import type { GenerationInput } from "@/lib/types"
import { toast } from "sonner"

export function CreatorStudio() {
  const [input, setInput] = useState<GenerationInput>(defaultGenerationInput)
  const { phase, thinkingStep, thinkingLabel, result, error, aiPowered, generate, isLoading } =
    useGeneration()
  const { addGeneration, saveHookPack, isPro, generationsToday } = useWorkspace()
  const dailyLimit = PLANS.free.generationsPerDay

  const handleGenerate = async () => {
    if (!input.niche.trim()) {
      toast.error("Enter a niche or topic first")
      return
    }
    const data = await generate(input)
    if (data) {
      addGeneration(data)
      const powered = "aiPowered" in data && data.aiPowered
      toast.success(
        powered
          ? "Content generated with Gemini"
          : "Content generated — add GEMINI_API_KEY for live AI"
      )
    }
  }

  const handleSurprise = () => {
    setInput({
      ...input,
      niche: SAMPLE_NICHES[Math.floor(Math.random() * SAMPLE_NICHES.length)],
    })
  }

  const handleSavePack = async () => {
    if (!result) return
    try {
      const name = `${result.input.niche.slice(0, 24)} pack`
      await saveHookPack(name, result)
      toast.success("Hook pack saved")
    } catch {
      toast.error("Failed to save pack")
    }
  }

  return (
    <section id="studio" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-block text-xs font-medium tracking-widest text-accent uppercase mb-2">
            Creator Studio
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Generate your next viral post
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Hooks, captions, CTAs, angles & carousel concepts — tuned to your
            niche.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
          {aiPowered ? "Gemini AI" : "Demo mode"} ·{" "}
          {isPro ? "Unlimited" : `${generationsToday}/${dailyLimit} today`}
        </div>
      </div>

      <ConfigCommandBar value={input} onChange={setInput} />

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !input.niche.trim()}
          className="bg-foreground text-background hover:bg-foreground/90 gap-2 h-11 px-6 btn-glow"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? "Generating..." : "Generate content"}
        </Button>
        <Button
          variant="outline"
          onClick={handleSurprise}
          className="border-border/50 h-11 gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Surprise niche
        </Button>
      </div>

      <AnimatePresence>
        {(phase === "thinking" || phase === "streaming") && (
          <AiProcessing
            active
            currentStep={thinkingStep}
            label={thinkingLabel}
          />
        )}
      </AnimatePresence>

      {error && (
        <div className="text-sm text-destructive px-1 space-y-1">
          <p>{error}</p>
          {error.includes("Upgrade") || error.includes("limit") ? (
            <Link href="/dashboard/billing" className="text-accent text-xs hover:underline">
              Upgrade to Pro →
            </Link>
          ) : null}
        </div>
      )}

      <GenerationOutput
        result={result}
        phase={phase}
        onSavePack={handleSavePack}
        isPro={isPro}
      />
    </section>
  )
}
