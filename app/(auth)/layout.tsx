export const dynamic = "force-dynamic"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="fixed inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-chart-2/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  )
}
