"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/admin-dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, BookOpen, Award, Clock, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>({
    totalStudents: 0,
    activeStudents: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    averageTimeSpent: 0,
    categoryBreakdown: [],
    weeklyActivity: [],
    studentProgress: [],
  })

  useEffect(() => {
    // Check if user is logged in and is an admin
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login/admin")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.role !== "admin") {
        router.push("/login/admin")
        return
      }
      setUser(parsedUser)

      // Fetch analytics data
      fetchAnalyticsData()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login/admin")
    }
  }, [router])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      // Fetch total students
      const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

      // Fetch active students (active in the last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: activeStudents } = await supabase
        .from("student_metrics")
        .select("*", { count: "exact", head: true })
        .gte("last_active", sevenDaysAgo.toISOString())

      // Fetch total lessons
      const { count: totalLessons } = await supabase.from("lessons").select("*", { count: "exact", head: true })

      // Fetch completed lessons
      const { count: completedLessons } = await supabase
        .from("lesson_completions")
        .select("*", { count: "exact", head: true })

      // Fetch average score
      const { data: scores } = await supabase.from("lesson_completions").select("score")

      const averageScore =
        scores && scores.length > 0 ? Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length) : 0

      // Fetch average time spent
      const { data: timeSpent } = await supabase.from("student_metrics").select("time_spent")

      const averageTimeSpent =
        timeSpent && timeSpent.length > 0
          ? Math.round(timeSpent.reduce((sum, item) => sum + item.time_spent, 0) / timeSpent.length)
          : 0

      // Fetch category breakdown
      const { data: categories } = await supabase.from("lessons").select("category")

      const categoryCount: Record<string, number> = {}
      categories?.forEach((item) => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
      })

      const categoryBreakdown = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value,
      }))

      // Generate weekly activity data (mock data for now)
      const weeklyActivity = [
        { day: "Mon", lessons: 12, students: 45 },
        { day: "Tue", lessons: 19, students: 52 },
        { day: "Wed", lessons: 15, students: 49 },
        { day: "Thu", lessons: 21, students: 58 },
        { day: "Fri", lessons: 18, students: 51 },
        { day: "Sat", lessons: 9, students: 30 },
        { day: "Sun", lessons: 5, students: 25 },
      ]

      // Generate student progress data (mock data for now)
      const studentProgress = [
        { name: "Grammar", score: 78 },
        { name: "Vocabulary", score: 82 },
        { name: "Reading", score: 74 },
        { name: "Listening", score: 68 },
        { name: "Speaking", score: 65 },
        { name: "Writing", score: 70 },
      ]

      setAnalytics({
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        totalLessons: totalLessons || 0,
        completedLessons: completedLessons || 0,
        averageScore,
        averageTimeSpent,
        categoryBreakdown,
        weeklyActivity,
        studentProgress,
      })
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h ${minutes}m`
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B"]

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {analytics.activeStudents} active in the last 7 days
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.completedLessons}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Out of {analytics.totalLessons} total lessons
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageScore}%</div>
                  <Progress value={analytics.averageScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatTime(analytics.averageTimeSpent)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Per student</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Lessons completed and active students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.weeklyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="lessons" name="Lessons Completed" fill="#8884d8" />
                        <Bar dataKey="students" name="Active Students" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Content Distribution</CardTitle>
                  <CardDescription>Lessons by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.categoryBreakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Performance by Category</CardTitle>
                <CardDescription>Average scores across different skill areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.studentProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" name="Average Score (%)" fill="#8884d8">
                        {analytics.studentProgress.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Analytics</CardTitle>
                <CardDescription>Detailed student performance and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Student analytics content will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Analytics</CardTitle>
                <CardDescription>Insights about lesson engagement and effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content analytics will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User activity and retention data</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Engagement metrics will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
