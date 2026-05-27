import { Suspense } from "react"
import { BillingPanel } from "@/components/billing/billing-panel"
import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      <WorkspaceHeader />
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
          <BillingPanel />
        </Suspense>
      </main>
    </div>
  )
}
