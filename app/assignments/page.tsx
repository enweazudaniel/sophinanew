"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Assignment {
  id: number
  title: string
  description: string
  assignment_type: string
  due_date: string | null
  max_score: number
  created_at: string
  submission?: {
    id: number
    status: string
    score: number | null
    submitted_at: string
  }
}

export default function AssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)

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
      fetchAssignments(parsedUser.id)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchAssignments = async (studentId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/assignments?studentId=${studentId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch assignments")
      }

      setAssignments(result.assignments || [])
    } catch (error) {
      console.error("Error fetching assignments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (assignment: Assignment) => {
    if (!assignment.submission) {
      const isOverdue = assignment.due_date && new Date() > new Date(assignment.due_date)
      return (
        <div className="flex items-center gap-1 text-yellow-600">
          {isOverdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          <span>{isOverdue ? "Overdue" : "Not Submitted"}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>Submitted</span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : assignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No assignments found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                        {assignment.assignment_type}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      {assignment.due_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="font-medium">{format(new Date(assignment.due_date), "PPP")}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(assignment)}
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Score:</span>
                        <span className="font-medium">{assignment.max_score} points</span>
                      </div>

                      {assignment.submission?.score !== null && assignment.submission?.score !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your Score:</span>
                          <span className="font-medium">
                            {assignment.submission.score}/{assignment.max_score}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/assignments/${assignment.id}`}>
                        {assignment.submission ? "View Submission" : "Start Assignment"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </div>
  )
}
