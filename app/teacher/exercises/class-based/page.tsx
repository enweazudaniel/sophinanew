"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EnhancedExerciseForm } from "@/components/enhanced-exercise-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Users,
  BarChart3,
  Search,
  Loader2,
  Calculator,
  Beaker,
  Globe,
  BookOpen,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Exercise {
  id: number
  title: string
  description: string
  subject: string
  difficulty: string
  questions: any[]
  estimated_duration: number
  attempts_allowed: number
  passing_score: number
  auto_grade: boolean
  show_results_immediately: boolean
  is_available: boolean
  created_at: string
  class_exercises?: any[]
  exercise_analytics?: any[]
}

interface Class {
  id: number
  name: string
  grade_level: string
  student_count?: number
}

export default function ClassBasedExercisesPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.role !== "teacher" && parsedUser.role !== "admin") {
        router.push("/dashboard")
        return
      }
      setUser(parsedUser)
      fetchData()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchExercises(), fetchClasses()])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select(`
          *,
          class_exercises(
            id,
            class_id,
            assigned_at,
            due_date,
            is_active,
            classes(name, grade_level)
          ),
          exercise_analytics(
            total_attempts,
            average_score,
            completion_rate
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setExercises(data || [])
    } catch (error) {
      console.error("Error fetching exercises:", error)
      toast({
        title: "Error",
        description: "Failed to fetch exercises",
        variant: "destructive",
      })
    }
  }

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          id,
          name,
          grade_level,
          users!class_id(count)
        `)
        .order("name")

      if (error) throw error

      const classesWithCount =
        data?.map((cls) => ({
          ...cls,
          student_count: cls.users?.[0]?.count || 0,
        })) || []

      setClasses(classesWithCount)
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      })
    }
  }

  const handleCreateExercise = async (formData: any) => {
    if (!user) return

    try {
      const exerciseData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        subject: formData.subject,
        difficulty: formData.difficulty,
        questions: formData.questions,
        estimated_duration: formData.estimatedDuration,
        attempts_allowed: formData.attemptsAllowed,
        passing_score: formData.passingScore,
        auto_grade: formData.autoGrade,
        show_results_immediately: formData.showResultsImmediately,
        tags: formData.tags,
        created_by: user.id,
        is_available: true,
        exercise_type: "mcq",
        max_score: formData.questions.length,
      }

      const { data: exercise, error } = await supabase.from("exercises").insert(exerciseData).select().single()

      if (error) throw error

      // Assign to selected classes
      if (formData.selectedClasses.length > 0) {
        const classAssignments = formData.selectedClasses.map((classId: number) => ({
          exercise_id: exercise.id,
          class_id: classId,
          is_active: true,
        }))

        const { error: assignError } = await supabase.from("class_exercises").insert(classAssignments)

        if (assignError) throw assignError

        // Create notifications for students
        for (const classId of formData.selectedClasses) {
          const { data: students } = await supabase
            .from("users")
            .select("id")
            .eq("class_id", classId)
            .eq("role", "student")

          if (students && students.length > 0) {
            const notifications = students.map((student) => ({
              user_id: student.id,
              type: "exercise_assigned",
              title: "New Exercise Available",
              message: `A new ${formData.subject} exercise "${formData.title}" has been assigned`,
              is_read: false,
            }))

            await supabase.from("notifications").insert(notifications)
          }
        }
      }

      toast({
        title: "Success",
        description: "Exercise created and assigned successfully!",
      })

      await fetchExercises()
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Error creating exercise:", error)
      toast({
        title: "Error",
        description: "Failed to create exercise",
        variant: "destructive",
      })
    }
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setShowCreateDialog(true)
  }

  const handleUpdateExercise = async (formData: any) => {
    if (!editingExercise || !user) return

    try {
      const exerciseData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        subject: formData.subject,
        difficulty: formData.difficulty,
        questions: formData.questions,
        estimated_duration: formData.estimatedDuration,
        attempts_allowed: formData.attemptsAllowed,
        passing_score: formData.passingScore,
        auto_grade: formData.autoGrade,
        show_results_immediately: formData.showResultsImmediately,
        tags: formData.tags,
        max_score: formData.questions.length,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("exercises").update(exerciseData).eq("id", editingExercise.id)

      if (error) throw error

      // Update class assignments
      await supabase.from("class_exercises").delete().eq("exercise_id", editingExercise.id)

      if (formData.selectedClasses.length > 0) {
        const classAssignments = formData.selectedClasses.map((classId: number) => ({
          exercise_id: editingExercise.id,
          class_id: classId,
          is_active: true,
        }))

        await supabase.from("class_exercises").insert(classAssignments)
      }

      toast({
        title: "Success",
        description: "Exercise updated successfully!",
      })

      await fetchExercises()
      setShowCreateDialog(false)
      setEditingExercise(null)
    } catch (error) {
      console.error("Error updating exercise:", error)
      toast({
        title: "Error",
        description: "Failed to update exercise",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExercise = async (exerciseId: number) => {
    if (!confirm("Are you sure you want to delete this exercise? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("exercises").delete().eq("id", exerciseId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Exercise deleted successfully",
      })

      await fetchExercises()
    } catch (error) {
      console.error("Error deleting exercise:", error)
      toast({
        title: "Error",
        description: "Failed to delete exercise",
        variant: "destructive",
      })
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "mathematics":
        return <Calculator className="h-4 w-4 text-blue-500" />
      case "science":
        return <Beaker className="h-4 w-4 text-green-500" />
      case "social_studies":
        return <Globe className="h-4 w-4 text-purple-500" />
      case "civic_education":
        return <Users className="h-4 w-4 text-orange-500" />
      case "general_knowledge":
        return <BookOpen className="h-4 w-4 text-indigo-500" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case "mathematics":
        return "Mathematics"
      case "science":
        return "Science"
      case "social_studies":
        return "Social Studies"
      case "civic_education":
        return "Civic Education"
      case "general_knowledge":
        return "General Knowledge"
      default:
        return subject
    }
  }

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || exercise.subject === selectedSubject
    const matchesClass =
      selectedClass === "all" || exercise.class_exercises?.some((ce) => ce.class_id.toString() === selectedClass)

    return matchesSearch && matchesSubject && matchesClass
  })

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
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
            <h1 className="text-3xl font-bold tracking-tight">Class-Based Exercises</h1>
            <p className="text-muted-foreground">Create and manage exercises for specific classes</p>
          </div>
          <Button
            onClick={() => {
              setEditingExercise(null)
              setShowCreateDialog(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </div>

        <Tabs defaultValue="exercises" className="mt-6">
          <TabsList>
            <TabsTrigger value="exercises">All Exercises</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="assignments">Class Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="social_studies">Social Studies</SelectItem>
                  <SelectItem value="civic_education">Civic Education</SelectItem>
                  <SelectItem value="general_knowledge">General Knowledge</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name} (Grade {cls.grade_level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exercise Grid */}
            {filteredExercises.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Exercises Found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    {searchQuery || selectedSubject !== "all" || selectedClass !== "all"
                      ? "No exercises match your current filters."
                      : "Create your first exercise to get started."}
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Exercise
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSubjectIcon(exercise.subject)}
                          <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        </div>
                        <Badge variant={exercise.is_available ? "default" : "secondary"}>
                          {exercise.is_available ? "Active" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{getSubjectName(exercise.subject)}</Badge>
                        <Badge variant="secondary" className="capitalize">
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="outline">{exercise.questions.length} questions</Badge>
                        <Badge variant="outline">{exercise.estimated_duration}m</Badge>
                      </div>

                      {/* Class assignments */}
                      {exercise.class_exercises && exercise.class_exercises.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Assigned to:</p>
                          <div className="flex flex-wrap gap-1">
                            {exercise.class_exercises.map((ce) => (
                              <Badge key={ce.id} variant="outline" className="text-xs">
                                {ce.classes?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Analytics preview */}
                      {exercise.exercise_analytics && exercise.exercise_analytics.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Attempts: {exercise.exercise_analytics[0].total_attempts}</span>
                            <span>Avg Score: {exercise.exercise_analytics[0].average_score?.toFixed(1)}%</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditExercise(exercise)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/exercises/${exercise.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteExercise(exercise.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{exercises.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Exercises</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{exercises.filter((e) => e.is_available).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {classes.reduce((total, cls) => total + (cls.student_count || 0), 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Exercises by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["mathematics", "science", "social_studies", "civic_education", "general_knowledge"].map(
                    (subject) => {
                      const count = exercises.filter((e) => e.subject === subject).length
                      const percentage = exercises.length > 0 ? (count / exercises.length) * 100 : 0

                      return (
                        <div key={subject} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getSubjectIcon(subject)}
                              <span className="font-medium">{getSubjectName(subject)}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{count} exercises</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Exercise Assignments</CardTitle>
                <CardDescription>Overview of exercises assigned to each class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((cls) => {
                    const assignedExercises = exercises.filter((exercise) =>
                      exercise.class_exercises?.some((ce) => ce.class_id === cls.id),
                    )

                    return (
                      <div key={cls.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{cls.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Grade {cls.grade_level} • {cls.student_count} students
                            </p>
                          </div>
                          <Badge variant="outline">{assignedExercises.length} exercises</Badge>
                        </div>

                        {assignedExercises.length > 0 ? (
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {assignedExercises.map((exercise) => (
                              <div key={exercise.id} className="flex items-center gap-2 p-2 border rounded">
                                {getSubjectIcon(exercise.subject)}
                                <span className="text-sm font-medium truncate">{exercise.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {exercise.difficulty}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No exercises assigned</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Exercise Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExercise ? "Edit Exercise" : "Create New Exercise"}</DialogTitle>
              <DialogDescription>
                {editingExercise
                  ? "Update the exercise details and class assignments"
                  : "Create a new exercise and assign it to classes"}
              </DialogDescription>
            </DialogHeader>

            <EnhancedExerciseForm
              onSubmit={editingExercise ? handleUpdateExercise : handleCreateExercise}
              onCancel={() => {
                setShowCreateDialog(false)
                setEditingExercise(null)
              }}
              initialData={
                editingExercise
                  ? {
                      title: editingExercise.title,
                      description: editingExercise.description,
                      instructions: editingExercise.instructions || "",
                      subject: editingExercise.subject,
                      difficulty: editingExercise.difficulty,
                      estimatedDuration: editingExercise.estimated_duration,
                      attemptsAllowed: editingExercise.attempts_allowed,
                      passingScore: editingExercise.passing_score,
                      autoGrade: editingExercise.auto_grade,
                      showResultsImmediately: editingExercise.show_results_immediately,
                      selectedClasses: editingExercise.class_exercises?.map((ce) => ce.class_id) || [],
                      questions: editingExercise.questions,
                      tags: editingExercise.tags || [],
                    }
                  : undefined
              }
              isEditing={!!editingExercise}
            />
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </div>
  )
}
