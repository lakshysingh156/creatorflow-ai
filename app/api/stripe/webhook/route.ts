import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const { getStripe } = await import("@/lib/stripe")
  const { createServiceClient } = await import("@/lib/supabase/server")

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createServiceClient()
  if (!supabase) return NextResponse.json({ received: true })

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (userId) {
        await supabase
          .from("profiles")
          .update({
            subscription_tier: "pro",
            subscription_status: "active",
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
        await supabase
          .from("subscription_states")
          .upsert(
            {
              user_id: userId,
              tier: "pro",
              status: "active",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            },
            { onConflict: "user_id" }
          )
        await supabase.from("ai_activity").insert({
          user_id: userId,
          type: "billing",
          message: "Upgraded to CreatorFlow Pro",
        })
      }
      break
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single()

      if (profile) {
        const isActive = subscription.status === "active"
        const currentPeriodEnd =
          "current_period_end" in subscription &&
          typeof subscription.current_period_end === "number"
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null
        await supabase
          .from("profiles")
          .update({
            subscription_tier: isActive ? "pro" : "free",
            subscription_status: subscription.status,
            stripe_subscription_id: isActive ? subscription.id : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id)
        await supabase
          .from("subscription_states")
          .upsert(
            {
              user_id: profile.id,
              tier: isActive ? "pro" : "free",
              status: subscription.status,
              stripe_customer_id: customerId,
              stripe_subscription_id: isActive ? subscription.id : null,
              current_period_end: currentPeriodEnd,
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
            { onConflict: "user_id" }
          )
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
