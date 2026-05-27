"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { TrendingUp, Zap, Copy, Check, Activity, Users, Eye } from "lucide-react"
import { useState, useRef } from "react"

export function DashboardPreview() {
  const [copied, setCopied] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { stiffness: 100, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleCopy = (index: number) => {
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="relative perspective-1000" style={{ perspective: "1000px" }}>
      {/* Layered glow effects */}
      <div className="absolute -inset-8 bg-accent/8 rounded-[32px] blur-3xl" />
      <div className="absolute -inset-4 bg-chart-2/5 rounded-3xl blur-2xl animate-pulse-glow" />
      
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Main dashboard container */}
        <div className="relative glass-strong rounded-2xl p-5 glow border-glow">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 rounded-2xl shimmer pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-chart-5/60 hover:bg-chart-5 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-chart-4/60 hover:bg-chart-4 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-chart-3/60 hover:bg-chart-3 transition-colors cursor-pointer" />
              </div>
              <span className="text-xs font-medium text-muted-foreground tracking-wide">CreatorFlow AI</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-chart-3/10 border border-chart-3/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-3 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-3" />
              </span>
              <span className="text-[10px] font-medium text-chart-3">Live</span>
            </div>
          </div>

          {/* Floating Stats Cards - layered above */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: Users, label: "Followers", value: "24.8K", change: "+12%", color: "chart-2" },
              { icon: Eye, label: "Views", value: "142K", change: "+28%", color: "chart-3" },
              { icon: Activity, label: "Engagement", value: "8.4%", change: "+4%", color: "accent" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative group"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className={`absolute inset-0 bg-${stat.color}/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative bg-secondary/60 rounded-xl p-3 border border-border/40 hover:border-border/60 transition-colors card-lift">
                  <stat.icon className={`w-4 h-4 text-${stat.color} mb-2`} />
                  <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-semibold text-foreground">{stat.value}</span>
                    <span className={`text-[10px] font-medium text-${stat.color}`}>{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Preview */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-input/80 rounded-xl px-4 py-3 border border-border/30">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-1">Niche</span>
              <span className="text-sm font-medium text-foreground">fitness coaching</span>
            </div>
            <div className="bg-input/80 rounded-xl px-4 py-3 border border-border/30">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-1">Tone</span>
              <span className="text-sm font-medium text-foreground">confident</span>
            </div>
          </div>

          {/* Generated Hooks with enhanced styling */}
          <div className="space-y-2.5 mb-4">
            {[
              "Stop scrolling if you want results in 30 days",
              "The workout hack nobody talks about"
            ].map((hook, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="group relative"
                style={{ transform: `translateZ(${10 + i * 5}px)` }}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-accent/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-secondary/40 rounded-xl p-4 border border-border/40 hover:border-accent/30 transition-all duration-300 card-lift">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                          Hook #{i + 1}
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">Generated</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">{hook}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(i)}
                      className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-muted rounded-lg"
                    >
                      {copied === i ? (
                        <Check className="w-4 h-4 text-chart-3" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Analytics Panel with animated chart */}
          <div className="bg-secondary/30 rounded-xl p-5 border border-border/30" style={{ transform: "translateZ(25px)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block">Performance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-semibold text-foreground">+32%</span>
                  <span className="text-xs text-muted-foreground">this week</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-2/10 border border-chart-2/20">
                <TrendingUp className="w-3.5 h-3.5 text-chart-2" />
                <span className="text-[11px] font-medium text-chart-2">Optimized</span>
              </div>
            </div>
            
            {/* Enhanced Chart */}
            <svg className="w-full h-16" viewBox="0 0 200 64" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradientPremium" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 265)" />
                  <stop offset="50%" stopColor="oklch(0.72 0.16 200)" />
                  <stop offset="100%" stopColor="oklch(0.75 0.15 185)" />
                </linearGradient>
                <linearGradient id="chartFillPremium" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 265 / 0.4)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.18 265 / 0)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Area fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                d="M0 50 C15 45, 30 48, 50 40 C70 32, 90 28, 110 30 C130 32, 150 22, 170 15 L200 10 L200 64 L0 64 Z"
                fill="url(#chartFillPremium)"
              />
              
              {/* Main line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                d="M0 50 C15 45, 30 48, 50 40 C70 32, 90 28, 110 30 C130 32, 150 22, 170 15 L200 10"
                fill="none"
                stroke="url(#chartGradientPremium)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              
              {/* Data points */}
              {[
                { cx: 50, cy: 40 },
                { cx: 110, cy: 30 },
                { cx: 170, cy: 15 }
              ].map((point, i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.2, type: "spring" }}
                  cx={point.cx}
                  cy={point.cy}
                  r="4"
                  fill="oklch(0.72 0.16 200)"
                  stroke="oklch(0.08 0.01 265)"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* Micro Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/20">
              {[
                { label: "CTR", value: "4.8%" },
                { label: "Saves", value: "1.2K" },
                { label: "Shares", value: "847" },
                { label: "Comments", value: "324" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-[10px] text-muted-foreground/60 block">{stat.label}</span>
                  <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-chart-4" />
              <span className="text-xs text-muted-foreground">Ready in <strong className="text-foreground">12s</strong></span>
            </div>
            <div className="flex gap-1.5">
              {["Hooks", "Captions", "CTAs"].map((tag, i) => (
                <span 
                  key={tag}
                  className={`text-[10px] px-2.5 py-1 rounded-full transition-all ${
                    i === 0 
                      ? "bg-accent/15 text-accent border border-accent/25" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
