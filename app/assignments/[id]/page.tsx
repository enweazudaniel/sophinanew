"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import { SimpleAssignmentSubmission } from "@/components/simple-assignment-submission"

interface Assignment {
  id: number
  title: string
  description: string
  assignment_type: string
  due_date: string | null
  max_score: number
}

interface Submission {
  id: number
  content: string
  status: string
  score: number | null
  feedback: string | null
  submitted_at: string
}

export default function AssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params.id as string

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock student ID - in a real app, this would come from authentication
  const studentId = 7

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch assignment
        const assignmentResponse = await fetch(`/api/assignments/${assignmentId}`)
        if (!assignmentResponse.ok) {
          throw new Error("Assignment not found")
        }
        const assignmentData = await assignmentResponse.json()
        setAssignment(assignmentData)

        // Fetch existing submission
        try {
          const submissionResponse = await fetch(`/api/assignments/${assignmentId}/submission?studentId=${studentId}`)
          if (submissionResponse.ok) {
            const submissionData = await submissionResponse.json()
            setSubmission(submissionData)
          }
        } catch (submissionError) {
          // It's okay if there's no existing submission
          console.log("No existing submission found")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load assignment")
      } finally {
        setLoading(false)
      }
    }

    if (assignmentId) {
      fetchData()
    }
  }, [assignmentId, studentId])

  const handleSubmissionComplete = (newSubmission: Submission) => {
    setSubmission(newSubmission)
  }

  if (loading) {
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

  if (error || !assignment) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/assignments")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assignments
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertDescription>{error || "Assignment not found"}</AlertDescription>
          </Alert>
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push("/assignments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Button>
        </div>

        <SimpleAssignmentSubmission
          assignment={assignment}
          existingSubmission={submission || undefined}
          studentId={studentId}
          onSubmissionComplete={handleSubmissionComplete}
        />
      </DashboardShell>
    </div>
  )
}
