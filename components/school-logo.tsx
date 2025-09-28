import { BookOpen } from "lucide-react"

export function SchoolLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BookOpen className="h-4 w-4" />
      </div>
      <span className="font-bold">Sophina</span>
    </div>
  )
}
