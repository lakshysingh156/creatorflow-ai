import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export async function POST() {
  const priceId = process.env.STRIPE_PRO_PRICE_ID
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!stripeKey || !priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID." },
      { status: 503 }
    )
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Auth not configured. Add Supabase env vars." },
      { status: 503 }
    )
  }

  try {
    const { requireUser, getUserProfile } = await import("@/lib/auth")
    const { getStripe } = await import("@/lib/stripe")
    const { createServiceClient } = await import("@/lib/supabase/server")

    let user
    try {
      user = await requireUser()
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    let customerId = profile?.stripe_customer_id

    const stripe = getStripe()

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      const supabase = await createServiceClient()
      await supabase
        ?.from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
      await supabase
        ?.from("subscription_states")
        .upsert(
          {
            user_id: user.id,
            tier: "free",
            status: "inactive",
            stripe_customer_id: customerId,
          },
          { onConflict: "user_id" }
        )
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: { supabase_user_id: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
