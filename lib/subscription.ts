import { PLANS, type SubscriptionTier } from "./plans"

export interface UserSubscription {
  tier: SubscriptionTier
  status: string
  generationsThisMonth: number
}

export function getGenerationLimit(tier: SubscriptionTier): number {
  return PLANS[tier].generationsPerDay
}

export function canGenerate(
  sub: UserSubscription,
  generationsToday: number
): { allowed: boolean; reason?: string } {
  const limit = getGenerationLimit(sub.tier)
  if (limit === Infinity) return { allowed: true }
  if (generationsToday >= limit) {
    return {
      allowed: false,
      reason: `Free plan limit reached (${limit}/day). Upgrade to Pro for unlimited generations.`,
    }
  }
  return { allowed: true }
}

export function isPro(tier: SubscriptionTier): boolean {
  return tier === "pro"
}

export function hasPremiumFeature(tier: SubscriptionTier): boolean {
  return tier === "pro"
}
