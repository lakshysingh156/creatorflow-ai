"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Check, Copy, Bookmark, TrendingUp, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ContentItem, GenerationResult, OutputTab } from "@/lib/types"

const tabs: { key: OutputTab; label: string; premium?: boolean }[] = [
  { key: "hooks", label: "Hooks" },
  { key: "captions", label: "Captions" },
  { key: "ctas", label: "CTAs" },
  { key: "angles", label: "Angles" },
  { key: "carousels", label: "Carousels" },
  { key: "triggers", label: "Triggers", premium: true },
  { key: "strategy", label: "Strategy", premium: true },
  { key: "insights", label: "Insights", premium: true },
]

const tabToField: Record<OutputTab, keyof GenerationResult> = {
  hooks: "hooks",
  captions: "captions",
  ctas: "ctas",
  angles: "angles",
  carousels: "carousels",
  triggers: "emotionalTriggers",
  strategy: "strategySuggestions",
  insights: "viralInsights",
}

interface GenerationOutputProps {
  result: GenerationResult | null
  phase: "idle" | "thinking" | "streaming" | "complete" | "error"
  onSavePack?: () => void
  showPrediction?: boolean
  isPro?: boolean
  className?: string
}

export function GenerationOutput({
  result,
  phase,
  onSavePack,
  showPrediction = true,
  isPro = false,
  className,
}: GenerationOutputProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>("hooks")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
  }, [activeTab])

  const field = tabToField[activeTab]
  const items = result
    ? (result[field] as ContentItem[] | undefined) ?? []
    : []
  const isPremiumTab = tabs.find((t) => t.key === activeTab)?.premium
  const isLocked = isPremiumTab && !isPro
  const isComplete = phase === "complete" && result

  useEffect(() => {
    if (phase === "streaming" && result) {
      setVisibleCount(0)
      const count = items.length
      let current = 0
      const interval = setInterval(() => {
        current += 1
        setVisibleCount(current)
        if (current >= count) clearInterval(interval)
      }, 160)
      return () => clearInterval(interval)
    }
    if (phase === "complete") {
      setVisibleCount(items.length)
    }
  }, [phase, result, activeTab, items.length])

  const displayItems =
    phase === "complete"
      ? items
      : items.slice(0, Math.max(visibleCount, phase === "thinking" ? 0 : 1))

  const handleCopy = (item: ContentItem) => {
    navigator.clipboard.writeText(item.content)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute -inset-1 bg-chart-2/5 rounded-2xl blur-xl" />
      <div className="relative glass-strong rounded-2xl p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex gap-1.5 p-1 rounded-xl bg-secondary/30 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setVisibleCount(0)
                }}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1",
                  activeTab === tab.key
                    ? "bg-accent/20 text-accent shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.premium && !isPro && <Lock className="w-3 h-3" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isComplete && onSavePack && (
              <button
                onClick={onSavePack}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/50 hover:border-accent/30 hover:bg-accent/10 transition-all"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Save pack
              </button>
            )}
            <span
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full transition-all",
                isComplete
                  ? "bg-chart-3/15 text-chart-3 border border-chart-3/25"
                  : phase === "thinking"
                    ? "bg-accent/15 text-accent border border-accent/25 animate-pulse"
                    : "bg-muted/50 text-muted-foreground"
              )}
            >
              {phase === "thinking"
                ? "Processing"
                : isComplete
                  ? "Generated"
                  : "Ready"}
            </span>
          </div>
        </div>

        {showPrediction && isComplete && result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-5 p-4 rounded-xl border border-chart-2/20 bg-chart-2/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-chart-2" />
                <span className="text-sm font-medium">
                  Engagement prediction
                </span>
              </div>
              <span className="text-2xl font-semibold text-chart-2 tabular-nums">
                {result.engagementPrediction}%
              </span>
            </div>
            {result.durationMs && (
              <p className="text-[10px] text-muted-foreground mt-2">
                Generated in {(result.durationMs / 1000).toFixed(1)}s
              </p>
            )}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 gap-3 min-h-[280px]"
          >
            {isLocked ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                <Lock className="w-8 h-8 text-accent mb-3" />
                <p className="text-sm font-medium mb-1">Pro feature</p>
                <p className="text-xs text-muted-foreground max-w-xs mb-4">
                  Upgrade to unlock emotional triggers, strategy suggestions, and
                  viral research insights.
                </p>
                <Link
                  href="/dashboard/billing"
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            ) : !result || phase === "idle" ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Configure your niche and settings, then generate to see
                  AI-powered content.
                </p>
              </div>
            ) : displayItems.length === 0 && phase !== "thinking" ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              displayItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-accent/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-4 rounded-xl border border-border/40 bg-card/30 hover:border-accent/30 transition-all duration-300 card-lift">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold">{item.title}</span>
                      <div className="flex items-center gap-1.5">
                        {item.engagementScore && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-chart-2/10 text-chart-2">
                            {item.engagementScore}%
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 whitespace-pre-line">
                      {item.content}
                    </p>
                    <button
                      onClick={() => handleCopy(item)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-chart-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {isComplete && result?.optimizationTips?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-5 pt-5 border-t border-border/30"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2">
              AI optimization tips
            </p>
            <ul className="space-y-1.5">
              {result.optimizationTips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex gap-2"
                >
                  <span className="text-accent shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  )
}
