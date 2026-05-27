import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { WorkspaceMetricsBar } from "@/components/workspace/workspace-metrics-bar"
import { CreatorStudio } from "@/components/workspace/creator-studio"
import { WorkspacePanels } from "@/components/workspace/workspace-panels"
import { WorkflowPipeline } from "@/components/workspace/workflow-pipeline"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-chart-2/5 rounded-full blur-[120px] pointer-events-none" />

      <WorkspaceHeader />

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <WorkspaceMetricsBar />

        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-6 min-w-0">
            <CreatorStudio />
            <WorkflowPipeline />
          </div>
          <aside className="lg:col-span-4 min-w-0">
            <WorkspacePanels />
          </aside>
        </div>
      </main>
    </div>
  )
}
