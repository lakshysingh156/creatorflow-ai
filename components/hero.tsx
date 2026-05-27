"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardPreview } from "./dashboard-preview"
import { useRef } from "react"

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Floating Orbs */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full animate-orb-1"
      >
        <div className="w-full h-full bg-accent/15 rounded-full blur-[120px]" />
      </motion.div>
      
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] rounded-full animate-orb-2"
      >
        <div className="w-full h-full bg-chart-2/10 rounded-full blur-[100px]" />
      </motion.div>

      <motion.div 
        className="absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full animate-pulse-glow"
      >
        <div className="w-full h-full bg-chart-5/8 rounded-full blur-[80px]" />
      </motion.div>

      {/* Small floating particles */}
      <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-accent/60 rounded-full animate-float blur-[1px]" />
      <div className="absolute top-[60%] left-[15%] w-1.5 h-1.5 bg-chart-2/50 rounded-full animate-float-slow" />
      <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-foreground/30 rounded-full animate-float-reverse" />
      <div className="absolute bottom-[30%] left-[40%] w-2 h-2 bg-chart-3/40 rounded-full animate-float" style={{ animationDelay: "2s" }} />

      {/* Gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 md:py-24"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content - takes 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/60 bg-secondary/30 backdrop-blur-sm text-xs text-muted-foreground mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-3 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-3" />
                </span>
                AI-powered content workflow
              </div>

              {/* Headline - tighter, more cinematic */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.05]">
                Your AI operating system{" "}
                <br className="hidden sm:block" />
                for{" "}
                <span className="gradient-text">creators</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-muted-foreground leading-relaxed max-w-md"
            >
              Generate hooks, captions, CTAs, and content angles in one workflow.
              Built for TikTok, Instagram, and YouTube creators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 h-12 px-6 btn-glow"
                asChild
              >
                <Link href="/signup">
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 h-12 px-6 border-border/60 hover:bg-secondary/50 hover:border-border"
                asChild
              >
                <Link href="#generator">
                  <Play className="w-4 h-4" />
                  Try generator
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/30"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Free plan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Dashboard Preview - takes 7 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            {/* Dashboard glow backdrop */}
            <div className="absolute -inset-10 bg-accent/5 rounded-[40px] blur-3xl animate-pulse-glow" />
            <DashboardPreview />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
