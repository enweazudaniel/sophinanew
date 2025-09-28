import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FixLessonSchema } from "@/components/fix-lesson-schema"

export default function FixSchemaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Database Schema Fix</h1>
        </div>
        <div className="grid gap-6">
          <FixLessonSchema />
        </div>
      </DashboardShell>
    </div>
  )
}
