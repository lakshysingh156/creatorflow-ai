"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, Shuffle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfigCommandBar,
  defaultGenerationInput,
} from "@/components/config-command-bar"
import { AiProcessing } from "@/components/ai-processing"
import { GenerationOutput } from "@/components/generation-output"
import { useGeneration } from "@/hooks/use-generation"
import { SAMPLE_NICHES } from "@/lib/constants"
import type { GenerationInput } from "@/lib/types"
import { toast } from "sonner"

export function Generator() {
  const [input, setInput] = useState<GenerationInput>(defaultGenerationInput)
  const { phase, thinkingStep, thinkingLabel, result, error, generate, isLoading } =
    useGeneration()

  const handleGenerate = async () => {
    if (!input.niche.trim()) return
    await generate(input)
  }

  const handleSurprise = () => {
    setInput({
      ...input,
      niche: SAMPLE_NICHES[Math.floor(Math.random() * SAMPLE_NICHES.length)],
    })
  }

  return (
    <section id="generator" className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-chart-2/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-block text-xs font-medium tracking-widest text-accent uppercase mb-4">
              Try It
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-3">
              AI Generator
            </h2>
            <p className="text-muted-foreground text-lg">
              Real AI content for your niche — hooks, captions, CTAs & more.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
            Powered by Gemini
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <ConfigCommandBar value={input} onChange={setInput} compact />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !input.niche.trim()}
              className="bg-foreground text-background hover:bg-foreground/90 gap-2 h-12 px-6 btn-glow"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isLoading ? "Generating..." : "Generate"}
            </Button>
            <Button
              variant="outline"
              onClick={handleSurprise}
              className="border-border/50 hover:bg-secondary/50 h-12 gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Surprise niche
            </Button>
            <Button
              variant="ghost"
              asChild
              className="h-12 gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/signup">
                Sign up for full workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
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
            <div className="text-sm text-destructive space-y-1">
              <p>{error}</p>
              {error.includes("Sign in") && (
                <Link href="/login" className="text-accent text-xs hover:underline">
                  Sign in →
                </Link>
              )}
            </div>
          )}

          <GenerationOutput result={result} phase={phase} />
        </motion.div>
      </div>
    </section>
  )
}
