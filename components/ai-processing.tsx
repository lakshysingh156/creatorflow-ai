"use client"

import { motion } from "framer-motion"
import { Brain, Sparkles } from "lucide-react"
import { AI_THINKING_STEPS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface AiProcessingProps {
  active: boolean
  currentStep: number
  label?: string
  className?: string
}

export function AiProcessing({
  active,
  currentStep,
  label,
  className,
}: AiProcessingProps) {
  if (!active) return null

  const progress = ((currentStep + 1) / AI_THINKING_STEPS.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "relative rounded-2xl border border-accent/20 bg-accent/5 p-6 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 shimmer pointer-events-none opacity-50" />

      <div className="relative flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-accent/30 rounded-xl blur-md animate-pulse-glow" />
          <div className="relative w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent animate-pulse" />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              AI processing
            </p>
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <p className="text-sm text-muted-foreground animate-pulse">
            {label ?? AI_THINKING_STEPS[currentStep]}
          </p>

          <div className="h-1.5 rounded-full bg-secondary/80 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-chart-2"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {AI_THINKING_STEPS.map((step, i) => (
              <span
                key={step}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300",
                  i <= currentStep
                    ? "bg-chart-3/10 border-chart-3/25 text-chart-3"
                    : "bg-muted/30 border-border/30 text-muted-foreground/50"
                )}
              >
                {i < currentStep ? "✓" : i === currentStep ? "→" : "·"}{" "}
                {step.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
