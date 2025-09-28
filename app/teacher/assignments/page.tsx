"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SimpleAssignmentForm } from "@/components/simple-assignment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import { format } from "date-fns"

interface Assignment {
  id: number
  title: string
  description: string
  assignment_type: string
  due_date: string | null
  max_score: number
  created_at: string
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/assignments")
      const result = await response.json()

      if (response.ok) {
        setAssignments(result.assignments || [])
      }
    } catch (error) {
      console.error("Error fetching assignments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Manage Assignments</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showCreateForm ? "Cancel" : "Create Assignment"}
          </Button>
        </div>

        {showCreateForm && (
          <div className="mt-6">
            <SimpleAssignmentForm />
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Existing Assignments</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : assignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No assignments created yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {assignment.assignment_type}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{format(new Date(assignment.created_at), "PPP")}</span>
                      </div>
                      {assignment.due_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due:</span>
                          <span>{format(new Date(assignment.due_date), "PPP")}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Score:</span>
                        <span>{assignment.max_score} points</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </div>
  )
}
