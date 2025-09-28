"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, ClipboardList, TrendingUp, Plus, Settings, Eye, FileText, MoreHorizontal } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface QuickStat {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  color?: string
}

interface RecentActivity {
  id: number
  type: string
  description: string
  timestamp: string
  student_name?: string
  class_name?: string
}

interface Student {
  id: number
  username: string
  full_name: string
  avatar_url?: string
  created_at: string
  average_score?: number
  completed_exercises?: number
}

interface Assignment {
  id: number
  title: string
  description: string
  assignment_type: string
  due_date: string | null
  created_at: string
}

interface Lesson {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  created_at: string
}

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [quickStats, setQuickStats] = useState<QuickStat[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

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
      fetchDashboardData(parsedUser.id)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchDashboardData = async (teacherId: number) => {
    setLoading(true)
    try {
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .order("full_name", { ascending: true })
        .limit(5)

      if (studentsError) throw studentsError

      // Get exercise scores for each student
      const studentsWithScores = await Promise.all(
        (studentsData || []).map(async (student) => {
          const { data: scores } = await supabase
            .from("exercise_scores")
            .select("score, max_score")
            .eq("student_id", student.id)

          let averageScore = 0
          if (scores && scores.length > 0) {
            const totalPercentage = scores.reduce((sum, item) => {
              return sum + (item.score / item.max_score) * 100
            }, 0)
            averageScore = Math.round(totalPercentage / scores.length)
          }

          return {
            ...student,
            average_score: averageScore,
            completed_exercises: scores?.length || 0,
          }
        }),
      )

      setStudents(studentsWithScores)

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (assignmentsError) throw assignmentsError
      setAssignments(assignmentsData || [])

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (lessonsError) throw lessonsError
      setLessons(lessonsData || [])

      // Set quick stats
      setQuickStats([
        {
          label: "Total Students",
          value: studentsWithScores.length,
          icon: <Users className="h-4 w-4" />,
          color: "text-blue-600",
        },
        {
          label: "Active Assignments",
          value: assignmentsData?.length || 0,
          icon: <ClipboardList className="h-4 w-4" />,
          color: "text-green-600",
        },
        {
          label: "Lessons Created",
          value: lessonsData?.length || 0,
          icon: <BookOpen className="h-4 w-4" />,
          color: "text-purple-600",
        },
        {
          label: "Average Score",
          value:
            studentsWithScores.length > 0
              ? Math.round(
                  studentsWithScores.reduce((sum, s) => sum + (s.average_score || 0), 0) / studentsWithScores.length,
                ) + "%"
              : "0%",
          icon: <TrendingUp className="h-4 w-4" />,
          color: "text-orange-600",
        },
      ])

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: "submission",
          description: "New student submissions received",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: "assignment",
          description: "Assignment deadline approaching",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          type: "lesson",
          description: "New lesson content available",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.username}! Here's what's happening with your classes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/teacher/assignments")}>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
            <Button variant="outline" onClick={() => router.push("/teacher/content")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Content
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <div className={stat.color}>{stat.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.trend && <p className="text-xs text-muted-foreground">{stat.trend}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                    onClick={() => router.push("/teacher/assignments")}
                  >
                    <ClipboardList className="h-6 w-6 mb-2" />
                    Assignments
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                    onClick={() => router.push("/teacher/students")}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Students
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                    onClick={() => router.push("/teacher/content")}
                  >
                    <BookOpen className="h-6 w-6 mb-2" />
                    Content
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                    onClick={() => router.push("/teacher/settings")}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No recent activity to display</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            {activity.student_name && (
                              <Badge variant="secondary" className="mt-1">
                                {activity.student_name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Students</CardTitle>
                <Button onClick={() => router.push("/teacher/students")}>View All Students</Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading students...</div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No students found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead className="text-right">Average Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.full_name}</TableCell>
                          <TableCell>{student.username}</TableCell>
                          <TableCell className="text-right">{student.average_score || 0}%</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/teacher/students/${student.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Assignments</CardTitle>
                <Button onClick={() => router.push("/teacher/assignments")}>View All Assignments</Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading assignments...</div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No assignments found</p>
                    <Button className="mt-4" onClick={() => router.push("/teacher/assignments")}>
                      Create First Assignment
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell className="capitalize">{assignment.assignment_type}</TableCell>
                          <TableCell>
                            {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/teacher/assignments/edit/${assignment.id}`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Edit Assignment
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Lessons</CardTitle>
                <Button onClick={() => router.push("/teacher/content")}>Manage All Content</Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading lessons...</div>
                ) : lessons.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No lessons found</p>
                    <Button className="mt-4" onClick={() => router.push("/teacher/content")}>
                      Create First Lesson
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons.map((lesson) => (
                        <TableRow key={lesson.id}>
                          <TableCell className="font-medium">{lesson.title}</TableCell>
                          <TableCell className="capitalize">{lesson.category}</TableCell>
                          <TableCell className="capitalize">{lesson.difficulty}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/teacher/content`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
