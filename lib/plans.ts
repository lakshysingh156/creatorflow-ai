export const PLANS = {
  free: {
    id: "free" as const,
    name: "Free",
    price: 0,
    generationsPerDay: 10,
    features: [
      "10 generations per day",
      "Hooks, captions & CTAs",
      "Basic analytics",
      "Community support",
    ],
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    price: 19,
    generationsPerDay: Infinity,
    features: [
      "Unlimited AI generations",
      "Strategy & viral insights",
      "Advanced analytics",
      "Saved hook packs",
      "Workflow pipeline",
      "Priority support",
    ],
  },
} as const

export type SubscriptionTier = keyof typeof PLANS
