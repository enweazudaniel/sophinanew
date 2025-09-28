"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BookOpen, Trophy, Target, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface MetricData {
  label: string
  value: number
  total?: number
  percentage?: number
  trend?: "up" | "down" | "stable"
  color?: string
}

interface SkillProgress {
  skill: string
  current: number
  target: number
  exercises_completed: number
  last_activity: string
}

interface FunctionalMetricsDashboardProps {
  userType: "student" | "teacher"
  userId: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function FunctionalMetricsDashboard({ userType, userId }: FunctionalMetricsDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [overallMetrics, setOverallMetrics] = useState<MetricData[]>([])
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([])
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([])
  const [assignmentStats, setAssignmentStats] = useState<any[]>([])

  useEffect(() => {
    fetchMetricsData()
  }, [userId, userType])

  const fetchMetricsData = async () => {
    setLoading(true)
    try {
      if (userType === "student") {
        await fetchStudentMetrics()
      } else {
        await fetchTeacherMetrics()
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentMetrics = async () => {
    // Fetch overall student metrics
    const { data: submissions } = await supabase
      .from("submissions")
      .select(`
        score,
        submitted_at,
        assignments(assignment_type, max_score)
      `)
      .eq("student_id", userId)

    const { data: completions } = await supabase
      .from("lesson_completions")
      .select("completed_at, lesson_type")
      .eq("student_id", userId)

    // Calculate overall metrics
    const totalSubmissions = submissions?.length || 0
    const averageScore = submissions?.reduce((sum, s) => sum + (s.score || 0), 0) / Math.max(totalSubmissions, 1)
    const completedLessons = completions?.length || 0

    setOverallMetrics([
      {
        label: "Assignments Completed",
        value: totalSubmissions,
        color: "text-blue-600",
      },
      {
        label: "Average Score",
        value: Math.round(averageScore),
        color: "text-green-600",
      },
      {
        label: "Lessons Completed",
        value: completedLessons,
        color: "text-purple-600",
      },
      {
        label: "Study Streak",
        value: 7, // Mock data - would calculate from activity
        color: "text-orange-600",
      },
    ])

    // Calculate skill progress
    const skillTypes = ["grammar", "vocabulary", "reading", "speaking", "listening"]
    const skillData = skillTypes.map((skill) => {
      const skillSubmissions =
        submissions?.filter((s) => s.assignments?.assignment_type?.toLowerCase().includes(skill)) || []

      const skillCompletions = completions?.filter((c) => c.lesson_type?.toLowerCase().includes(skill)) || []

      return {
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        current: skillSubmissions.length + skillCompletions.length,
        target: 20, // Mock target
        exercises_completed: skillSubmissions.length,
        last_activity: skillSubmissions[0]?.submitted_at || skillCompletions[0]?.completed_at || "Never",
      }
    })

    setSkillProgress(skillData)

    // Weekly activity data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        exercises: Math.floor(Math.random() * 10), // Mock data
        score: Math.floor(Math.random() * 100),
      }
    }).reverse()

    setWeeklyActivity(weeklyData)

    // Assignment type distribution
    const typeStats = skillTypes.map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: submissions?.filter((s) => s.assignments?.assignment_type?.toLowerCase().includes(type)).length || 0,
    }))

    setAssignmentStats(typeStats)
  }

  const fetchTeacherMetrics = async () => {
    // Fetch teacher's classes and students
    const { data: classes } = await supabase
      .from("class_teachers")
      .select(`
        classes(
          id,
          name,
          students(id)
        )
      `)
      .eq("teacher_id", userId)

    const classIds = classes?.map((ct) => ct.classes?.id).filter(Boolean) || []
    const totalStudents = classes?.reduce((sum, ct) => sum + (ct.classes?.students?.length || 0), 0) || 0

    // Fetch assignments created by teacher
    const { data: assignments } = await supabase
      .from("assignments")
      .select(`
        id,
        title,
        assignment_type,
        submissions(score, submitted_at)
      `)
      .eq("created_by", userId)

    const totalAssignments = assignments?.length || 0
    const totalSubmissions = assignments?.reduce((sum, a) => sum + (a.submissions?.length || 0), 0) || 0
    const averageScore =
      assignments?.reduce((sum, a) => {
        const assignmentAvg =
          a.submissions?.reduce((s, sub) => s + (sub.score || 0), 0) / Math.max(a.submissions?.length || 1, 1)
        return sum + assignmentAvg
      }, 0) / Math.max(totalAssignments, 1)

    setOverallMetrics([
      {
        label: "Total Students",
        value: totalStudents,
        color: "text-blue-600",
      },
      {
        label: "Assignments Created",
        value: totalAssignments,
        color: "text-green-600",
      },
      {
        label: "Submissions Received",
        value: totalSubmissions,
        color: "text-purple-600",
      },
      {
        label: "Class Average",
        value: Math.round(averageScore),
        color: "text-orange-600",
      },
    ])

    // Mock skill progress for teacher view (class performance)
    const skillTypes = ["Grammar", "Vocabulary", "Reading", "Speaking", "Listening"]
    const teacherSkillData = skillTypes.map((skill) => ({
      skill,
      current: Math.floor(Math.random() * 80) + 20,
      target: 100,
      exercises_completed: Math.floor(Math.random() * 50),
      last_activity: new Date().toISOString(),
    }))

    setSkillProgress(teacherSkillData)

    // Weekly activity for teacher (class activity)
    const teacherWeeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        exercises: Math.floor(Math.random() * 50),
        score: Math.floor(Math.random() * 100),
      }
    }).reverse()

    setWeeklyActivity(teacherWeeklyData)

    // Assignment type distribution
    const teacherTypeStats = skillTypes.map((type) => ({
      name: type,
      value:
        assignments?.filter((a) => a.assignment_type?.toLowerCase().includes(type.toLowerCase())).length ||
        Math.floor(Math.random() * 10),
    }))

    setAssignmentStats(teacherTypeStats)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overallMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <div className={metric.color}>
                {index === 0 && <BookOpen className="h-4 w-4" />}
                {index === 1 && <Trophy className="h-4 w-4" />}
                {index === 2 && <Target className="h-4 w-4" />}
                {index === 3 && <TrendingUp className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.percentage && (
                <p className="text-xs text-muted-foreground">{metric.percentage}% from last month</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skills">Skill Progress</TabsTrigger>
          <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
          <TabsTrigger value="distribution">Assignment Types</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{userType === "student" ? "Your Skill Progress" : "Class Skill Performance"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillProgress.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="outline">{skill.exercises_completed} exercises</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.current}/{skill.target}
                      </span>
                    </div>
                    <Progress value={(skill.current / skill.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="exercises"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Exercises Completed"
                  />
                  <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={2} name="Average Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assignmentStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assignmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assignmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
