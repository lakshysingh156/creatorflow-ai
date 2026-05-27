"use client"

import { motion } from "framer-motion"
import { BarChart3, Bookmark, Sparkles, Zap } from "lucide-react"
import { useWorkspace } from "@/contexts/workspace-context"
import { Skeleton } from "@/components/ui/skeleton"

export function WorkspaceMetricsBar() {
  const { metrics, loading } = useWorkspace()

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  const stats = [
    {
      icon: Zap,
      label: "Generations",
      value: metrics.totalGenerations.toString(),
      sub: `+${metrics.weeklyGenerations} this week`,
      color: "text-chart-4",
    },
    {
      icon: Bookmark,
      label: "Saved packs",
      value: metrics.savedPacks.toString(),
      sub: "Hook libraries",
      color: "text-accent",
    },
    {
      icon: BarChart3,
      label: "Hook success",
      value: `${metrics.hookSuccessRate}%`,
      sub: "Predicted rate",
      color: "text-chart-2",
    },
    {
      icon: Sparkles,
      label: "AI score",
      value: `${metrics.optimizationScore}%`,
      sub: "Optimization",
      color: "text-chart-3",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-strong rounded-xl p-4 border border-border/40 card-lift group"
        >
          <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {stat.label}
          </p>
          <p className="text-xl font-semibold mt-0.5 tabular-nums">{stat.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}
