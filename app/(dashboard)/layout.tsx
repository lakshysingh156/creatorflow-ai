import { WorkspaceProvider } from "@/contexts/workspace-context"

export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>
}
