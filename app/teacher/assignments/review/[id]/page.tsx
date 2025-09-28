"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

type Submission = {
  id: number
  assignment_id: number
  student_id: number
  content: string
  status: string
  score: number | null
  feedback: string | null
  submitted_at: string
  graded_at: string | null
  graded_by: number | null
  assignment: {
    title: string
    description: string
    assignment_type: string
    due_date: string
  }
  student: {
    username: string
    full_name: string
    avatar_url: string
  }
}

export default function AssignmentReviewPage() {
  const router = useRouter()
  const params = useParams()
  const submissionId = params.id as string

  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

      // Fetch submission
      fetchSubmission()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, submissionId])

  const fetchSubmission = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          assignment:assignments(*),
          student:students(*)
        `)
        .eq("id", submissionId)
        .single()

      if (error) throw error

      setSubmission(data as Submission)
      setScore(data.score)
      setFeedback(data.feedback || "")
    } catch (error) {
      console.error("Error fetching submission:", error)
      setError("Failed to load submission")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      if (score === null || score < 0 || score > 100) {
        throw new Error("Please enter a valid score between 0 and 100")
      }

      const { error } = await supabase
        .from("submissions")
        .update({
          score,
          feedback,
          status: "graded",
          graded_at: new Date().toISOString(),
          graded_by: user?.id,
        })
        .eq("id", submissionId)

      if (error) throw error

      setSuccess("Assignment graded successfully")

      // Refresh submission data
      fetchSubmission()
    } catch (error: any) {
      console.error("Error grading submission:", error)
      setError(error.message || "Failed to grade submission")
    } finally {
      setIsSaving(false)
    }
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

  if (!submission) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Alert variant="destructive">
            <AlertDescription>{error || "Submission not found"}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
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
            <h1 className="text-3xl font-bold tracking-tight">{submission.assignment.title}</h1>
            <p className="text-muted-foreground">Assignment Review</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Assignments
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Submission</CardTitle>
                <CardDescription>
                  Submitted on {format(new Date(submission.submitted_at), "PPP 'at' p")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={submission.student.avatar_url} alt={submission.student.full_name} />
                    <AvatarFallback>{submission.student.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{submission.student.full_name}</p>
                    <p className="text-sm text-muted-foreground">ID: {submission.student.username}</p>
                  </div>
                </div>

                <div className="border rounded-md p-4 whitespace-pre-wrap">{submission.content}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Grading</CardTitle>
                <CardDescription>
                  {submission.status === "graded"
                    ? `Graded on ${format(new Date(submission.graded_at!), "PPP")}`
                    : "Provide feedback and score"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="score">Score (0-100)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={score === null ? "" : score}
                      onChange={(e) => setScore(e.target.value ? Number.parseInt(e.target.value) : null)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback to the student..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : submission.status === "graded" ? (
                      "Update Grading"
                    ) : (
                      "Submit Grading"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{submission.assignment.assignment_type}</p>
                  </div>

                  {submission.assignment.due_date && (
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(submission.assignment.due_date), "PPP")}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{submission.assignment.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}
