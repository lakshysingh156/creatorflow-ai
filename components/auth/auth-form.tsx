"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertTriangle, ExternalLink, Loader2, Sparkles } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Name is required"),
})

type LoginValues = z.infer<typeof loginSchema>
type SignupValues = z.infer<typeof signupSchema>

interface AuthFormProps {
  mode: "login" | "signup"
  redirectTo?: string
  supabaseConfigured: boolean
}

export function AuthForm({
  mode,
  redirectTo = "/dashboard",
  supabaseConfigured,
}: AuthFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const isSignup = mode === "signup"
  const schema = isSignup ? signupSchema : loginSchema

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues | LoginValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: SignupValues | LoginValues) => {
    if (!supabaseConfigured) return
    setServerError(null)

    // Dynamically import Supabase client — safe because we checked it's configured
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    if (isSignup) {
      const v = values as SignupValues
      const { error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          data: { full_name: v.fullName },
          emailRedirectTo: `${window.location.origin}/callback?next=/dashboard`,
        },
      })
      if (error) { setServerError(error.message); return }
      router.push("/login?check_email=1")
      router.refresh()
      return
    }

    const v = values as LoginValues
    const { error } = await supabase.auth.signInWithPassword({
      email: v.email,
      password: v.password,
    })
    if (error) { setServerError(error.message); return }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/60 items-center justify-center mb-4">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {isSignup
            ? "Start building content with your AI creator OS"
            : "Sign in to your CreatorFlow workspace"}
        </p>
      </div>

      {!supabaseConfigured ? (
        <div className="glass-strong rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Supabase not configured
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Auth requires Supabase. Add your env vars to{" "}
                <code className="px-1 py-0.5 rounded bg-muted text-xs">.env.local</code>{" "}
                and restart the dev server.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-secondary/40 p-3 text-xs font-mono text-muted-foreground space-y-1">
            <p>NEXT_PUBLIC_SUPABASE_URL=...</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</p>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-accent hover:underline"
          >
            Get your keys at supabase.com
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              In the meantime, try the{" "}
              <Link href="/#generator" className="text-accent hover:underline">
                demo generator
              </Link>{" "}
              — it works without any setup.
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-strong rounded-2xl border border-border/50 p-6 space-y-4"
        >
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                placeholder="Alex Creator"
                className="bg-input/80 h-11"
                {...register("fullName")}
              />
              {"fullName" in errors && errors.fullName && (
                <p className="text-xs text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-input/80 h-11"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-input/80 h-11"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 btn-glow"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSignup ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-accent hover:underline font-medium"
        >
          {isSignup ? "Sign in" : "Sign up free"}
        </Link>
      </p>
    </motion.div>
  )
}
