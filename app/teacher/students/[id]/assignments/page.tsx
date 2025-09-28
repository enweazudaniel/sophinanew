"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Loader2, Eye, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

type Student = {
  id: number
  username: string
  full_name: string
}

type Submission = {
  id: number
  assignment_id: number
  content: string
  status: string
  score: number | null
  submitted_at: string
  graded_at: string | null
  assignment: {
    title: string
    assignment_type: string
    due_date: string | null
  }
}

export default function StudentAssignmentsPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
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

      // Fetch student and submissions
      fetchStudentAssignments()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, studentId])

  const fetchStudentAssignments = async () => {
    setIsLoading(true)
    try {
      // Get student info
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id, username, full_name")
        .eq("id", studentId)
        .single()

      if (studentError) throw studentError
      setStudent(studentData)

      // Get submissions with assignment details
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select(`
          *,
          assignment:assignments(title, assignment_type, due_date)
        `)
        .eq("student_id", studentId)
        .order("submitted_at", { ascending: false })

      if (submissionsError) throw submissionsError
      setSubmissions(submissionsData || [])
    } catch (error) {
      console.error("Error fetching student assignments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string, score: number | null) => {
    if (status === "graded") {
      if (score === null) return <Badge variant="secondary">Graded</Badge>
      if (score >= 80) return <Badge className="bg-green-500">Excellent ({score}%)</Badge>
      if (score >= 60) return <Badge className="bg-blue-500">Good ({score}%)</Badge>
      return <Badge className="bg-red-500">Needs Improvement ({score}%)</Badge>
    }
    if (status === "submitted") return <Badge variant="outline">Awaiting Review</Badge>
    return <Badge variant="secondary">{status}</Badge>
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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{student.full_name} - Assignments</h1>
            <p className="text-muted-foreground">View all assignments for this student</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/teacher/students/${studentId}`)}>
              View Profile
            </Button>
            <Button variant="outline" onClick={() => router.push("/teacher/students")}>
              Back to Students
            </Button>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Assignment Submissions</CardTitle>
            <CardDescription>All assignments submitted by {student.full_name}</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assignments submitted yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.assignment.title}</TableCell>
                      <TableCell className="capitalize">{submission.assignment.assignment_type}</TableCell>
                      <TableCell>{format(new Date(submission.submitted_at), "PPP")}</TableCell>
                      <TableCell>{getStatusBadge(submission.status, submission.score)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/assignments/review/${submission.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
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
      </DashboardShell>
    </div>
  )
}
