"use client"

import { motion } from "framer-motion"
import { 
  Zap, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  Layers 
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI Hook Generation",
    description: "Multiple retention-driven hook angles with tone control."
  },
  {
    icon: FileText,
    title: "Caption Optimization",
    description: "Structure captions for skimmability with consistent voice."
  },
  {
    icon: TrendingUp,
    title: "Trend-Aware Ideas",
    description: "Content formats tuned for short-form viral potential."
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    description: "AI recommendations based on your niche performance."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track engagement, saves, and content performance."
  },
  {
    icon: Layers,
    title: "Content Library",
    description: "Save and organize your best performing content."
  }
]

export function Features() {
  return (
    <section id="features" className="relative py-32 md:py-40 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-xs font-medium tracking-widest text-accent uppercase mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5">
              Everything you need to{" "}
              <span className="gradient-text">create faster</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Built to reduce time-to-post while improving message clarity, 
              structure, and retention.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-accent/30 hover:bg-card/50 transition-all duration-500 card-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-300 border border-border/50 group-hover:border-accent/30">
                    <feature.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1.5 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
