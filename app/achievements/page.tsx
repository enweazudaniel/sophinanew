"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, Loader2 } from "lucide-react"
import { getStudentAchievements } from "@/lib/tracking-utils"

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; username: string; fullName?: string } | null>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }, [])

  useEffect(() => {
    async function fetchAchievements() {
      if (!user?.id) return

      setIsLoading(true)
      try {
        const achievementsData = await getStudentAchievements(user.id)
        setAchievements(achievementsData || [])
      } catch (error) {
        console.error("Failed to fetch achievements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>You need to be logged in to view your achievements.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/login">Log In</a>
              </Button>
            </CardFooter>
          </Card>
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Achievements</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{achievement.achievement_name}</CardTitle>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardDescription>{achievement.achievement_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Earned on</span>
                      <span className="font-medium">{new Date(achievement.earned_at).toLocaleDateString()}</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>No Achievements Yet</CardTitle>
              <CardDescription>
                Complete exercises and assignments to earn achievements and track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground max-w-md">
                As you progress through your English learning journey, you'll earn achievements that recognize your
                accomplishments. Keep practicing to unlock your first achievement!
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/exercises">Start Practicing</a>
              </Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
