"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLANS } from "@/lib/plans"
import { toast } from "sonner"

export function Pricing() {
  const [loading, setLoading] = useState(false)

  const handleProCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      if (res.status === 401) {
        window.location.href = "/signup?redirect=/dashboard/billing"
        return
      }
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? "Checkout not configured yet")
    } catch {
      toast.error("Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      ...PLANS.free,
      price: "$0",
      description: "Get started with the basics",
      cta: "Get started free",
      href: "/signup",
      highlighted: false,
      onClick: undefined as (() => void) | undefined,
    },
    {
      ...PLANS.pro,
      price: "$19",
      period: "/mo",
      description: "For serious creators",
      cta: "Start Pro trial",
      highlighted: true,
      onClick: handleProCheckout,
      href: undefined,
    },
  ]

  return (
    <section id="pricing" className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-xs font-medium tracking-widest text-accent uppercase mb-4">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-5">
              Simple, transparent{" "}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Start free. Upgrade when you need unlimited AI and premium insights.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {plan.highlighted && (
                <div className="absolute -inset-1 bg-accent/10 rounded-2xl blur-xl" />
              )}

              <div
                className={`relative h-full p-7 rounded-2xl border transition-all duration-500 ${
                  plan.highlighted
                    ? "border-accent/40 bg-accent/5 backdrop-blur-sm"
                    : "border-border/50 bg-card/30 hover:border-border/80"
                } card-lift`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-accent text-accent-foreground shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </span>
                  </div>
                )}

                <div className="mb-7">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-7 pb-7 border-b border-border/30">
                  <span className="text-5xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  {"period" in plan && plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-chart-3/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-chart-3" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.onClick ? (
                  <Button
                    onClick={plan.onClick}
                    disabled={loading}
                    className="w-full h-12 font-medium bg-foreground text-background hover:bg-foreground/90 btn-glow"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      plan.cta
                    )}
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full h-12 font-medium bg-secondary/80 text-foreground hover:bg-secondary border border-border/50"
                  >
                    <Link href={plan.href!}>{plan.cta}</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
