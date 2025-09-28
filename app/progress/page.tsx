"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Trophy, TrendingUp, Download, Award, BarChart3 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatTime } from "@/lib/tracking-utils"

interface ProgressData {
  lessonsCompleted: number
  totalLessons: number
  overallProgress: number
  timeSpent: number
  weeklyProgress: number
  achievements: Achievement[]
  recentLessons: CompletedLesson[]
  categoryProgress: CategoryProgress[]
}

interface Achievement {
  id: string
  achievement_id: string
  achievement_name: string
  achievement_description: string
  earned_at: string
  progress: number
}

interface CompletedLesson {
  id: string
  lesson_id: string
  lesson_title: string
  category: string
  completed_at: string
  score: number
  time_spent: number
}

interface CategoryProgress {
  category: string
  completed: number
  total: number
  progress: number
}

export default function ProgressPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null)
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchProgressData(parsedUser.id)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchProgressData = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch student metrics
      const { data: metrics, error: metricsError } = await supabase
        .from("student_metrics")
        .select("*")
        .eq("student_id", userId)
        .single()

      // Fetch achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from("student_achievements")
        .select("*")
        .eq("student_id", userId)
        .order("earned_at", { ascending: false })

      // Fetch recent lesson completions with lesson details
      const { data: completions, error: completionsError } = await supabase
        .from("lesson_completions")
        .select(`
          id,
          lesson_id,
          completed_at,
          score,
          time_spent,
          lessons (
            title,
            category
          )
        `)
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(10)

      // Fetch category progress
      const { data: categoryData, error: categoryError } = await supabase.from("lessons").select("category")

      if (metricsError && metricsError.code !== "PGRST116") {
        throw metricsError
      }

      // Process category progress
      const categoryProgress: CategoryProgress[] = []
      if (categoryData && completions) {
        const categories = [...new Set(categoryData.map((l) => l.category))]

        for (const category of categories) {
          const totalInCategory = categoryData.filter((l) => l.category === category).length
          const completedInCategory = completions.filter(
            (c) => c.lessons && (c.lessons as any).category === category,
          ).length

          categoryProgress.push({
            category,
            completed: completedInCategory,
            total: totalInCategory,
            progress: totalInCategory > 0 ? (completedInCategory / totalInCategory) * 100 : 0,
          })
        }
      }

      // Format recent lessons data
      const recentLessons: CompletedLesson[] = (completions || []).map((c) => ({
        id: c.id,
        lesson_id: c.lesson_id,
        lesson_title: (c.lessons as any)?.title || "Unknown Lesson",
        category: (c.lessons as any)?.category || "unknown",
        completed_at: c.completed_at,
        score: c.score || 0,
        time_spent: c.time_spent || 0,
      }))

      const progressData: ProgressData = {
        lessonsCompleted: metrics?.lessons_completed || 0,
        totalLessons: metrics?.total_lessons || 0,
        overallProgress: metrics?.overall_progress || 0,
        timeSpent: metrics?.time_spent || 0,
        weeklyProgress: 0, // Calculate this based on recent completions
        achievements: achievements || [],
        recentLessons,
        categoryProgress,
      }

      // Calculate weekly progress
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const weeklyCompletions = recentLessons.filter((lesson) => new Date(lesson.completed_at) >= oneWeekAgo)
      progressData.weeklyProgress = weeklyCompletions.length

      setProgressData(progressData)
    } catch (error) {
      console.error("Error fetching progress data:", error)
      setError("Failed to load progress data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async () => {
    if (!progressData || !user) return

    try {
      // Ensure completedLessons is always an array
      const completedLessons = Array.isArray(progressData.recentLessons) ? progressData.recentLessons : []

      // Create report content
      const reportContent = `
PROGRESS REPORT
===============

Student: ${user.username}
Generated: ${new Date().toLocaleDateString()}

OVERALL PROGRESS
================
Lessons Completed: ${progressData.lessonsCompleted}/${progressData.totalLessons}
Overall Progress: ${progressData.overallProgress.toFixed(1)}%
Total Time Spent: ${formatTime(progressData.timeSpent)}
Weekly Progress: ${progressData.weeklyProgress} lessons

CATEGORY PROGRESS
=================
${progressData.categoryProgress
  .map((cat) => `${cat.category.toUpperCase()}: ${cat.completed}/${cat.total} (${cat.progress.toFixed(1)}%)`)
  .join("\n")}

RECENT LESSONS
==============
${completedLessons
  .slice(0, 10)
  .map(
    (lesson) =>
      `${lesson.lesson_title} - Score: ${lesson.score}% - ${new Date(lesson.completed_at).toLocaleDateString()}`,
  )
  .join("\n")}

ACHIEVEMENTS
============
${progressData.achievements
  .map((achievement) => `${achievement.achievement_name} - ${new Date(achievement.earned_at).toLocaleDateString()}`)
  .join("\n")}
      `

      // Create and download file
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `progress-report-${user.username}-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating report:", error)
      setError("Failed to generate report. Please try again.")
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading progress data...</p>
            </div>
          </div>
        </DashboardShell>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchProgressData(user.id)}>Try Again</Button>
            </div>
          </div>
        </DashboardShell>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <p>No progress data available.</p>
          </div>
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Progress Report</h1>
            <p className="text-muted-foreground">Track your learning journey and achievements</p>
          </div>
          <Button onClick={downloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progressData.lessonsCompleted}/{progressData.totalLessons}
              </div>
              <p className="text-xs text-muted-foreground">{progressData.overallProgress.toFixed(1)}% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(progressData.timeSpent)}</div>
              <p className="text-xs text-muted-foreground">Total learning time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.weeklyProgress}</div>
              <p className="text-xs text-muted-foreground">Lessons completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.achievements.length}</div>
              <p className="text-xs text-muted-foreground">Badges earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Progress
            </CardTitle>
            <CardDescription>Your learning progress across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm text-muted-foreground">{progressData.overallProgress.toFixed(1)}%</span>
                </div>
                <Progress value={progressData.overallProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="categories" className="mt-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent Lessons</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Progress</CardTitle>
                <CardDescription>Your progress in different learning categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.categoryProgress.map((category) => (
                    <div key={category.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{category.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.completed}/{category.total} ({category.progress.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={category.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Lessons</CardTitle>
                <CardDescription>Your most recently completed lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.recentLessons.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No lessons completed yet. Start learning to see your progress here!
                    </p>
                  ) : (
                    progressData.recentLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">{lesson.lesson_title}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {lesson.category} • {new Date(lesson.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{lesson.score}% Score</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{formatTime(lesson.time_spent)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Badges and milestones you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {progressData.achievements.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 col-span-2">
                      No achievements yet. Keep learning to unlock badges!
                    </p>
                  ) : (
                    progressData.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-4 border rounded-lg">
                        <Award className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium">{achievement.achievement_name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.achievement_description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
