"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

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

interface SimpleAssignmentSubmissionProps {
  assignment: Assignment
  existingSubmission?: Submission
  studentId: number
  onSubmissionComplete?: (submission: Submission) => void
}

export function SimpleAssignmentSubmission({
  assignment,
  existingSubmission,
  studentId,
  onSubmissionComplete,
}: SimpleAssignmentSubmissionProps) {
  const [content, setContent] = useState(existingSubmission?.content || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter your response",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: assignment.id,
          studentId: studentId,
          content: content,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit assignment")
      }

      toast({
        title: "Success!",
        description: result.message,
      })

      if (onSubmissionComplete) {
        onSubmissionComplete(result.submission)
      }
    } catch (error) {
      console.error("Error submitting assignment:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOverdue = assignment.due_date && new Date() > new Date(assignment.due_date)
  const canSubmit = !isOverdue || existingSubmission

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{assignment.title}</CardTitle>
            <CardDescription>{assignment.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {assignment.due_date && (
              <Badge variant={isOverdue ? "destructive" : "secondary"}>
                <Clock className="mr-1 h-3 w-3" />
                Due: {format(new Date(assignment.due_date), "PPP")}
              </Badge>
            )}
            {existingSubmission && (
              <Badge variant="default">
                <CheckCircle className="mr-1 h-3 w-3" />
                Submitted
              </Badge>
            )}
          </div>
        </div>

        {isOverdue && !existingSubmission && (
          <Alert variant="destructive">
            <AlertDescription>This assignment is overdue. You can no longer submit new work.</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-medium">
              Your Response
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your response here..."
              className="min-h-[300px] resize-y"
              disabled={!canSubmit || isSubmitting}
            />
            <div className="text-xs text-muted-foreground">{content.length} characters</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {existingSubmission ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Last submitted: {format(new Date(existingSubmission.submitted_at), "PPP 'at' p")}
                </span>
              ) : (
                <span>Make sure to review your work before submitting</span>
              )}
            </div>

            <Button type="submit" disabled={!canSubmit || isSubmitting || !content.trim()} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {existingSubmission ? "Update Submission" : "Submit Assignment"}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Assignment Info */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Max Score:</span> {assignment.max_score} points
            </div>
            <div>
              <span className="font-medium">Type:</span> <Badge variant="outline">{assignment.assignment_type}</Badge>
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              {existingSubmission ? (
                <Badge variant="default">Submitted</Badge>
              ) : (
                <Badge variant="outline">Not Started</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Existing Submission Display */}
        {existingSubmission && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Your Submission:</h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="whitespace-pre-wrap">{existingSubmission.content}</p>
            </div>
            {existingSubmission.feedback && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Teacher Feedback:</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{existingSubmission.feedback}</p>
                </div>
              </div>
            )}
            {existingSubmission.score !== null && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Score:</h4>
                <div className="text-2xl font-bold">
                  {existingSubmission.score}/{assignment.max_score}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
