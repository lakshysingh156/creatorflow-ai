"use client"

import { motion } from "framer-motion"
import { Layers } from "lucide-react"
import { useWorkspace } from "@/contexts/workspace-context"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const stages = [
  { id: "idea", label: "Ideas", color: "bg-muted" },
  { id: "draft", label: "Drafts", color: "bg-chart-4/20 text-chart-4" },
  { id: "scheduled", label: "Scheduled", color: "bg-accent/20 text-accent" },
  { id: "published", label: "Published", color: "bg-chart-3/20 text-chart-3" },
] as const

export function WorkflowPipeline() {
  const { workflows, loading } = useWorkspace()

  if (loading) {
    return (
      <div className="glass-strong rounded-xl p-6 border border-border/40">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl border border-border/40 p-5 md:p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Layers className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-medium">Content workflow pipeline</h3>
        <span className="text-[10px] ml-auto text-muted-foreground">
          {workflows.length} items
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const items = workflows.filter((w) => w.stage === stage.id)
          return (
            <div
              key={stage.id}
              className="rounded-xl border border-border/40 bg-secondary/20 p-3 min-h-[100px]"
            >
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  stage.color
                )}
              >
                {stage.label}
              </span>
              <ul className="mt-3 space-y-2">
                {items.length === 0 ? (
                  <li className="text-[10px] text-muted-foreground/60 py-2">
                    Empty
                  </li>
                ) : (
                  items.slice(0, 3).map((w) => (
                    <li
                      key={w.id}
                      className="text-xs p-2 rounded-lg bg-card/40 border border-border/30 truncate"
                      title={w.title}
                    >
                      {w.title}
                    </li>
                  ))
                )}
                {items.length > 3 && (
                  <li className="text-[10px] text-muted-foreground">
                    +{items.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
