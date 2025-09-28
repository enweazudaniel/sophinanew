"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

type Assignment = {
  id: number
  title: string
  description: string
  assignment_type: string
  due_date: string | null
  class_id: string | null
  created_at: string
}

export default function EditAssignmentPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id as string

  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignmentType, setAssignmentType] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [classId, setClassId] = useState("")
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])

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

      // Fetch assignment
      fetchAssignment()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, assignmentId])

  const fetchAssignment = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("assignments").select("*").eq("id", assignmentId).single()

      if (error) throw error

      setAssignment(data)
      setTitle(data.title)
      setDescription(data.description || "")
      setAssignmentType(data.assignment_type)
      setDueDate(data.due_date ? data.due_date.split("T")[0] : "")
      setClassId(data.class_id || "all")

      // Fetch classes
      const { data: classesData } = await supabase.from("classes").select("id, name").order("name")

      if (classesData) {
        setClasses(classesData)
      }
    } catch (error) {
      console.error("Error fetching assignment:", error)
      setError("Failed to load assignment")
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
      if (!title.trim()) {
        throw new Error("Title is required")
      }

      if (!assignmentType) {
        throw new Error("Assignment type is required")
      }

      const updateData: any = {
        title: title.trim(),
        description: description.trim(),
        assignment_type: assignmentType,
        due_date: dueDate || null,
        class_id: classId === "all" ? null : classId,
      }

      const { error } = await supabase.from("assignments").update(updateData).eq("id", assignmentId)

      if (error) throw error

      setSuccess("Assignment updated successfully!")

      // Redirect back to assignments page after a short delay
      setTimeout(() => {
        router.push("/teacher/assignments")
      }, 1500)
    } catch (error: any) {
      console.error("Error updating assignment:", error)
      setError(error.message || "Failed to update assignment")
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

  if (!assignment) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Alert variant="destructive">
            <AlertDescription>{error || "Assignment not found"}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.push("/teacher/assignments")}>
            Back to Assignments
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Assignment</h1>
            <p className="text-muted-foreground">Update assignment details</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/teacher/assignments")}>
            Back to Assignments
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Update the assignment information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter assignment description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Assignment Type *</Label>
                <Select value={assignmentType} onValueChange={setAssignmentType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Assign To</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class or all students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Assignment...
                  </>
                ) : (
                  "Update Assignment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DashboardShell>
    </div>
  )
}
