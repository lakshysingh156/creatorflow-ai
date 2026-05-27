"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "CreatorFlow cut my content creation time in half. The hooks are genuinely better than what I was writing myself.",
    author: "Sarah Chen",
    role: "Fitness Creator",
    avatar: "SC"
  },
  {
    quote: "Finally, an AI tool that understands short-form content. The output is clean and ready to use.",
    author: "Marcus Johnson",
    role: "YouTuber, 500K subs",
    avatar: "MJ"
  },
  {
    quote: "I use it every day for my client work. The consistency and quality is exactly what agencies need.",
    author: "Elena Rodriguez",
    role: "Content Agency Owner",
    avatar: "ER"
  }
]

export function Testimonials() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-chart-4/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-xs font-medium tracking-widest text-accent uppercase mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5">
              Trusted by{" "}
              <span className="gradient-text">creators</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join thousands of creators shipping content faster.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 bg-chart-4/5 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full p-7 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border/80 transition-all duration-500 card-lift">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-chart-4 text-chart-4" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground/90 leading-relaxed mb-8 text-[15px]">
                  {`"${testimonial.quote}"`}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center text-sm font-medium text-foreground border border-border/50">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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
