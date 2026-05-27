"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Command,
  Hash,
  Megaphone,
  Target,
  Users,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TONES,
  PLATFORMS,
  AUDIENCES,
  CONTENT_GOALS,
} from "@/lib/constants"
import type { GenerationInput, Platform } from "@/lib/types"
import { Input } from "@/components/ui/input"

interface ConfigCommandBarProps {
  value: GenerationInput
  onChange: (value: GenerationInput) => void
  compact?: boolean
}

type ConfigKey = keyof Omit<GenerationInput, "niche">

const configMeta: Record<
  ConfigKey,
  { label: string; icon: typeof Hash; options: readonly string[] | Platform[] }
> = {
  tone: { label: "Tone", icon: Sparkles, options: TONES },
  platform: { label: "Platform", icon: Megaphone, options: PLATFORMS },
  audience: { label: "Audience", icon: Users, options: AUDIENCES },
  goal: { label: "Goal", icon: Target, options: CONTENT_GOALS },
}

export function ConfigCommandBar({
  value,
  onChange,
  compact = false,
}: ConfigCommandBarProps) {
  const [openKey, setOpenKey] = useState<ConfigKey | null>(null)

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute -inset-0.5 bg-accent/10 rounded-2xl blur-lg opacity-60" />
        <div className="relative glass-strong rounded-2xl border-glow overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-secondary/20">
            <Command className="w-4 h-4 text-accent shrink-0" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              Content command bar
            </span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-chart-3/10 text-chart-3 border border-chart-3/20">
              AI ready
            </span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2 block">
                Niche / Topic
              </label>
              <Input
                value={value.niche}
                onChange={(e) => onChange({ ...value, niche: e.target.value })}
                placeholder="e.g., beginner strength training"
                className="bg-input/80 border-border/50 h-11 focus:border-accent/50 font-medium"
              />
            </div>

            <div
              className={cn(
                "flex flex-wrap gap-2",
                compact && "grid grid-cols-2 sm:grid-cols-4"
              )}
            >
              {(Object.keys(configMeta) as ConfigKey[]).map((key) => {
                const meta = configMeta[key]
                const Icon = meta.icon
                const selected = value[key]
                const isOpen = openKey === key

                return (
                  <div key={key} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all duration-300 min-w-[120px]",
                        isOpen
                          ? "bg-accent/15 border-accent/30 text-foreground"
                          : "bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 text-accent" />
                      <span className="truncate text-left flex-1">
                        <span className="text-[10px] block text-muted-foreground/70 leading-none mb-0.5">
                          {meta.label}
                        </span>
                        <span className="font-medium text-xs">{selected}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 shrink-0 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-30 top-full left-0 mt-1 min-w-[200px] max-h-48 overflow-y-auto rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl p-1"
                        >
                          {meta.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                onChange({ ...value, [key]: opt })
                                setOpenKey(null)
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                selected === opt
                                  ? "bg-accent/20 text-accent"
                                  : "hover:bg-secondary/80 text-foreground"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const defaultGenerationInput: GenerationInput = {
  niche: "",
  tone: "Confident",
  platform: "TikTok",
  audience: "Beginners",
  goal: "Grow followers",
}
