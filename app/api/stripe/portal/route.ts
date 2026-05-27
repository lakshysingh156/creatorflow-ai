import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 })
  }

  try {
    const { requireUser, getUserProfile } = await import("@/lib/auth")
    const { getStripe } = await import("@/lib/stripe")

    const user = await requireUser()
    const profile = await getUserProfile(user.id)

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 400 }
      )
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: "Portal failed" }, { status: 500 })
  }
}
