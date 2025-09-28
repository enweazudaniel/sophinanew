"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ClipboardList, Calendar, CheckCircle, PlayCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { supabase } from "@/lib/supabase"
import { AvatarDisplay } from "@/components/avatar-selector"
import Link from "next/link"

interface Assignment {
  id: number
  title: string
  description: string
  due_date: string
  status: "pending" | "submitted" | "graded"
  score?: number
  max_score: number
  subject: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (
        !parsedUser.role ||
        (parsedUser.role !== "student" && parsedUser.role !== "teacher" && parsedUser.role !== "admin")
      ) {
        router.push("/login")
        return
      }
      setUser(parsedUser)

      if (parsedUser.role === "student") {
        loadDashboardData(parsedUser.id)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const loadDashboardData = async (studentId: number) => {
    try {
      setLoading(true)

      // Get student's class
      const { data: student } = await supabase.from("students").select("class_id").eq("id", studentId).single()

      if (student?.class_id) {
        // Load assignments for the student's class
        const { data: assignmentClasses } = await supabase
          .from("assignment_classes")
          .select(`
            assignments (
              id,
              title,
              description,
              due_date,
              max_score,
              subject
            )
          `)
          .eq("class_id", student.class_id)

        // Get submissions for this student
        const { data: submissions } = await supabase
          .from("submissions")
          .select("assignment_id, score, submitted_at, status")
          .eq("student_id", studentId)

        const submissionMap = new Map(submissions?.map((s) => [s.assignment_id, s]) || [])

        const formattedAssignments =
          assignmentClasses
            ?.map((ac) => {
              const assignment = ac.assignments
              if (!assignment) return null
              const submission = submissionMap.get(assignment.id)

              return {
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                due_date: assignment.due_date,
                max_score: assignment.max_score,
                subject: assignment.subject,
                status: submission?.status || "pending",
                score: submission?.score,
              }
            })
            .filter(Boolean) || []

        setAssignments(formattedAssignments)
      }

      // Load available exercises
      const { data: exercisesData } = await supabase.from("exercises").select("*").eq("is_available", true).limit(6)

      setExercises(exercisesData || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const upcomingAssignments = assignments.filter((a) => a.status === "pending").slice(0, 3)

  // If teacher, redirect to teacher dashboard
  if (user && (user.role === "teacher" || user.role === "admin")) {
    router.push("/teacher/dashboard")
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <AvatarDisplay alt="Student avatar" size="xl" />
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.fullName || user?.username}!</h1>
              <p className="text-muted-foreground">Ready to continue your learning journey?</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Exercises</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exercises.length}</div>
              <p className="text-xs text-muted-foreground">Ready to practice</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.filter((a) => a.status === "graded").length}</div>
              <p className="text-xs text-muted-foreground">Assignments graded</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Available Exercises
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exercises.slice(0, 3).map((exercise) => (
                    <Button key={exercise.id} variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href={`/exercises/${exercise.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        {exercise.title}
                      </Link>
                    </Button>
                  ))}
                  {exercises.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No exercises available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{assignment.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {assignment.subject} • Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Assignments</CardTitle>
                <CardDescription>View and manage your assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="secondary">{assignment.subject}</Badge>
                            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                            <span>Max Score: {assignment.max_score}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {assignment.score !== undefined && (
                            <Badge variant="secondary">
                              {assignment.score}/{assignment.max_score}
                            </Badge>
                          )}
                          <Badge
                            variant={
                              assignment.status === "graded"
                                ? "default"
                                : assignment.status === "submitted"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {assignment.status}
                          </Badge>
                          <Button size="sm" asChild>
                            <Link href={`/assignments/${assignment.id}`}>
                              {assignment.status === "pending" ? "Start" : "View"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No assignments found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Exercises</CardTitle>
                <CardDescription>Practice with interactive exercises</CardDescription>
              </CardHeader>
              <CardContent>
                {exercises.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {exercises.map((exercise) => (
                      <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{exercise.title}</CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary">{exercise.subject}</Badge>
                            <Badge variant="outline">{exercise.difficulty}</Badge>
                          </div>
                          <Button asChild className="w-full">
                            <Link href={`/exercises/${exercise.id}`}>Start Exercise</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No exercises available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
