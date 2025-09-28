"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FixLessonTracking } from "@/components/fix-lesson-tracking"
import { VerifyLessons } from "@/components/verify-lessons"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FixTrackingPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Redirect if not admin
        if (parsedUser.role !== "admin") {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Fix Lesson Tracking</h1>
        </div>
        <div className="grid gap-6">
          <VerifyLessons />
          <FixLessonTracking />
        </div>
      </DashboardShell>
    </div>
  )
}
