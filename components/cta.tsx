"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Multiple layered glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-chart-2/5 rounded-full blur-[120px] animate-orb-1" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-chart-5/5 rounded-full blur-[100px] animate-orb-2" />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-[20%] w-2 h-2 bg-accent/50 rounded-full animate-float blur-[1px]" />
      <div className="absolute top-1/2 right-[25%] w-1.5 h-1.5 bg-chart-2/40 rounded-full animate-float-slow" />
      <div className="absolute bottom-1/3 left-[30%] w-1 h-1 bg-foreground/20 rounded-full animate-float-reverse" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm text-xs text-muted-foreground mb-8">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Start creating today
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] leading-[1.1] mb-7">
            Ready to create content{" "}
            <br className="hidden md:block" />
            that <span className="gradient-text">actually performs</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of creators using AI to ship better content, faster. 
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 gap-2 h-14 px-8 text-base btn-glow"
              asChild
            >
              <Link href="/signup">
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-border/60 hover:bg-secondary/50 hover:border-border h-14 px-8 text-base"
              asChild
            >
              <Link href="#pricing">View pricing</Link>
            </Button>
          </div>
          
          {/* Trust note */}
          <p className="text-sm text-muted-foreground/60 mt-8">
            Free forever plan available. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
