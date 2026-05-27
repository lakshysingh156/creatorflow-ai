"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, CreditCard, Loader2, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWorkspace } from "@/contexts/workspace-context"
import { PLANS } from "@/lib/plans"
import { toast } from "sonner"

export function BillingPanel() {
  const { subscription, isPro, loading } = useWorkspace()
  const searchParams = useSearchParams()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Welcome to CreatorFlow Pro!")
    }
    if (searchParams.get("canceled")) {
      toast.info("Checkout canceled")
    }
  }, [searchParams])

  const handleUpgrade = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? "Checkout unavailable")
    } catch {
      toast.error("Checkout failed")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? "Billing portal unavailable")
    } catch {
      toast.error("Could not open billing portal")
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your CreatorFlow subscription
        </p>
      </div>

      <div className="glass-strong rounded-2xl border border-border/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-2xl font-semibold flex items-center gap-2 mt-1">
              {isPro ? (
                <>
                  <Sparkles className="w-5 h-5 text-accent" />
                  Pro
                </>
              ) : (
                "Free"
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              Status: {subscription.status}
            </p>
          </div>
          {isPro ? (
            <Button
              variant="outline"
              onClick={handlePortal}
              disabled={portalLoading}
              className="gap-2"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Manage subscription
            </Button>
          ) : (
            <Button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="bg-foreground text-background gap-2 btn-glow"
            >
              {checkoutLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Upgrade to Pro — $19/mo
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.values(PLANS).map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 ${
              plan.id === "pro"
                ? "border-accent/40 bg-accent/5"
                : "border-border/50 bg-card/30"
            }`}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-3xl font-semibold mt-2">
              ${plan.price}
              {plan.price > 0 && (
                <span className="text-sm text-muted-foreground font-normal">
                  /mo
                </span>
              )}
            </p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-chart-3 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
