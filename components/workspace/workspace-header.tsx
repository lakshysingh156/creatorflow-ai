"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CreditCard,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWorkspace } from "@/contexts/workspace-context"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WorkspaceHeader() {
  const router = useRouter()
  const { metrics, profile, subscription, generationsToday, isPro } =
    useWorkspace()
  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push("/login")
    router.refresh()
  }

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-2xl"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="h-5 w-px bg-border/50 hidden sm:block shrink-0" />
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <div className="min-w-0 hidden xs:block">
              <span className="font-semibold text-sm block leading-tight truncate">
                CreatorFlow
              </span>
              <span className="text-[10px] text-muted-foreground">Creator OS</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              isPro
                ? "bg-accent/15 text-accent border-accent/30"
                : "bg-muted/50 text-muted-foreground border-border/50"
            }`}
          >
            {isPro ? "Pro" : "Free"} · {generationsToday}/day
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {metrics.totalGenerations} total
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="hidden sm:flex h-9 gap-1.5"
            asChild
          >
            <Link href="#studio">
              <Zap className="w-3.5 h-3.5" />
              Generate
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2 sm:px-3 border-border/50 max-w-[140px] sm:max-w-none"
              >
                <span className="truncate text-xs sm:text-sm">
                  {profile?.full_name ?? profile?.email?.split("@")[0] ?? "Account"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Billing ({subscription.tier})
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
