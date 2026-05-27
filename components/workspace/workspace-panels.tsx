"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  Activity,
  Bookmark,
  Clock,
  History,
  Sparkles,
  TrendingUp,
  Zap,
  Trash2,
} from "lucide-react"
import { useWorkspace } from "@/contexts/workspace-context"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

const chartData = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 71 },
  { day: "Thu", score: 74 },
  { day: "Fri", score: 78 },
  { day: "Sat", score: 82 },
  { day: "Sun", score: 85 },
]

function Panel({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string
  icon: typeof Activity
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-strong rounded-xl border border-border/40 p-4", className)}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

export function WorkspacePanels() {
  const { history, savedPacks, activity, trending, metrics, loading, removeSavedPack } =
    useWorkspace()

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-strong rounded-xl border border-border/40 p-4 h-32 animate-pulse bg-secondary/20"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Panel title="AI optimization" icon={Sparkles}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-3xl font-semibold text-chart-2 tabular-nums">
              {metrics.optimizationScore}%
            </span>
            <p className="text-[10px] text-muted-foreground mt-1">
              Profile optimized
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-chart-3/10 text-chart-3 border border-chart-3/20">
            Active
          </span>
        </div>
        <div className="space-y-2">
          {[
            { label: "Hook patterns", value: 94 },
            { label: "Caption structure", value: 88 },
            { label: "CTA placement", value: 82 },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="text-foreground">{row.value}%</span>
              </div>
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.value}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-accent to-chart-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Engagement forecast" icon={TrendingUp}>
        <div className="h-24 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 265)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.65 0.18 265)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.11 0.01 265)",
                  border: "1px solid oklch(0.22 0.01 265)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="oklch(0.65 0.18 265)"
                fill="url(#engGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="text-chart-2 font-medium">
            +{metrics.avgEngagementLift}%
          </span>{" "}
          avg lift this week
        </p>
      </Panel>

      <Panel title="Trending topics" icon={Zap}>
        <ul className="space-y-2">
          {trending.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-secondary/40 transition-colors cursor-default"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{t.topic}</p>
                <p className="text-[10px] text-muted-foreground">{t.platform}</p>
              </div>
              <span className="text-[10px] font-medium text-chart-2 shrink-0">
                {t.growth}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Recent generations" icon={History}>
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No generations yet. Create your first batch.
          </p>
        ) : (
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {history.slice(0, 5).map((gen) => (
              <li
                key={gen.id}
                className="p-2.5 rounded-lg bg-secondary/30 border border-border/30"
              >
                <p className="text-xs font-medium truncate">{gen.input.niche}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(gen.timestamp), {
                    addSuffix: true,
                  })}
                  <span>·</span>
                  <span>{gen.input.platform}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Saved hook packs" icon={Bookmark}>
        {savedPacks.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Save hooks from any generation to build packs.
          </p>
        ) : (
          <ul className="space-y-2">
            {savedPacks.slice(0, 4).map((pack) => (
              <li
                key={pack.id}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
              >
                <div>
                  <p className="text-xs font-medium">{pack.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {pack.hooks.length} hooks · {pack.niche}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeSavedPack(pack.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete saved pack"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="AI activity" icon={Activity}>
        {activity.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Activity appears here as you generate and save content.
          </p>
        ) : (
          <ul className="space-y-2 max-h-36 overflow-y-auto">
            {activity.slice(0, 6).map((event) => (
              <li key={event.id} className="flex gap-2 text-xs">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    event.type === "generation" && "bg-accent",
                    event.type === "save" && "bg-chart-3",
                    event.type === "optimize" && "bg-chart-2",
                    event.type === "trend" && "bg-chart-4"
                  )}
                />
                <div>
                  <p className="text-muted-foreground leading-snug">
                    {event.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {formatDistanceToNow(new Date(event.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}
