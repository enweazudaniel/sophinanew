"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Loader2, BookOpen, Award, Clock, TrendingUp } from "lucide-react"
import { AvatarDisplay } from "@/components/avatar-selector"
import { getAvatarIdByName } from "@/lib/avatar-mapping"

type Student = {
  id: number
  username: string
  full_name: string
  avatar_url?: string
  created_at: string
  class_id?: string
}

type StudentMetrics = {
  overall_progress: number
  lessons_completed: number
  total_lessons: number
  time_spent: number
  last_active: string
}

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is a teacher
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.role !== "teacher") {
        router.push("/login")
        return
      }
      setUser(parsedUser)

      // Fetch student data
      fetchStudentData()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, studentId])

  const fetchStudentData = async () => {
    setIsLoading(true)
    try {
      // Get student info
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single()

      if (studentError) throw studentError
      setStudent(studentData)

      // Get student metrics
      const { data: metricsData } = await supabase
        .from("student_metrics")
        .select("*")
        .eq("student_id", studentId)
        .single()

      if (metricsData) {
        setMetrics(metricsData)
      }

      // Get recent lesson completions
      const { data: activityData } = await supabase
        .from("lesson_completions")
        .select(`
          *,
          lesson:lessons(title, category)
        `)
        .eq("student_id", studentId)
        .order("completed_at", { ascending: false })
        .limit(5)

      setRecentActivity(activityData || [])

      // Get achievements
      const { data: achievementsData } = await supabase
        .from("student_achievements")
        .select("*")
        .eq("student_id", studentId)
        .order("earned_at", { ascending: false })

      setAchievements(achievementsData || [])
    } catch (error) {
      console.error("Error fetching student data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardShell>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Card>
            <CardHeader>
              <CardTitle>Student Not Found</CardTitle>
              <CardDescription>The student you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/teacher/students")}>Back to Students</Button>
            </CardContent>
          </Card>
        </DashboardShell>
      </div>
    )
  }

  // Get the correct avatar ID based on the student's name
  const avatarId = getAvatarIdByName(student.full_name, false)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{student.full_name}</h1>
            <p className="text-muted-foreground">Student Profile</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/teacher/students")}>
            Back to Students
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <AvatarDisplay avatarId={avatarId} isTeacher={false} size="lg" fallback={student.full_name.charAt(0)} />
                <div className="text-center">
                  <h3 className="font-semibold">{student.full_name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {student.username}</p>
                  <p className="text-sm text-muted-foreground">Joined: {format(new Date(student.created_at), "PPP")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.round(metrics?.overall_progress || 0)}%</span>
                  </div>
                  <Progress value={metrics?.overall_progress || 0} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics?.lessons_completed || 0}</div>
                    <div className="text-xs text-muted-foreground">Lessons Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatTime(metrics?.time_spent || 0)}</div>
                    <div className="text-xs text-muted-foreground">Time Spent</div>
                  </div>
                </div>

                {metrics?.last_active && (
                  <div className="text-sm text-muted-foreground">
                    Last active: {format(new Date(metrics.last_active), "PPP")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    Lessons: {metrics?.lessons_completed || 0}/{metrics?.total_lessons || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Achievements: {achievements.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Study Time: {formatTime(metrics?.time_spent || 0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Progress: {Math.round(metrics?.overall_progress || 0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest lesson completions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{activity.lesson?.title || "Unknown Lesson"}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {activity.lesson?.category || "General"} • {format(new Date(activity.completed_at), "MMM d")}
                        </p>
                      </div>
                      <Badge
                        variant={activity.score >= 80 ? "default" : activity.score >= 60 ? "secondary" : "destructive"}
                      >
                        {activity.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Student accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No achievements yet</p>
              ) : (
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{achievement.icon || "🏆"}</div>
                      <div>
                        <p className="font-medium">{achievement.achievement_name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.achievement_description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(achievement.earned_at), "PPP")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
