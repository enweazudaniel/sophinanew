"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Calculator,
  Beaker,
  Globe,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ContentManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [exercises, setExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "mathematics",
    difficulty: "beginner",
    questions: "",
    estimated_duration: "30",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in and is a teacher
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      // Don't auto-logout, just check if they have permission
      if (parsedUser.role !== "teacher" && parsedUser.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }
      setUser(parsedUser)

      // Fetch exercises
      fetchExercises()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, toast])

  const fetchExercises = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("exercises").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching exercises:", error)
        toast({
          title: "Error",
          description: "Failed to fetch exercises. Please try again.",
          variant: "destructive",
        })
        throw error
      }

      setExercises(data || [])
    } catch (error) {
      console.error("Error fetching exercises:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null) // Clear any previous errors
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null) // Clear any previous errors
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (!formData.questions.trim()) {
      setError("Questions are required")
      return false
    }

    // Try to parse questions as JSON
    try {
      JSON.parse(formData.questions)
    } catch {
      setError("Questions must be valid JSON format")
      return false
    }

    return true
  }

  const handleCreateExercise = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Parse questions JSON
      const questions = JSON.parse(formData.questions)

      // Prepare the data object
      const exerciseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        difficulty: formData.difficulty,
        questions: questions,
        estimated_duration: Number.parseInt(formData.estimated_duration),
        max_score: questions.length || 0,
        created_by: user?.id,
        is_available: true,
        exercise_type: "mcq",
      }

      console.log("Creating exercise with data:", exerciseData)

      const { data, error } = await supabase.from("exercises").insert(exerciseData).select()

      if (error) {
        console.error("Error creating exercise:", error)
        setError(error.message || "Failed to create exercise. Please try again.")
        toast({
          title: "Error",
          description: "Failed to create exercise: " + (error.message || "Unknown error"),
          variant: "destructive",
        })
        throw error
      }

      console.log("Exercise created successfully:", data)

      // Show success message
      toast({
        title: "Success",
        description: "Exercise created successfully!",
      })

      // Refresh exercises
      await fetchExercises()

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        subject: "mathematics",
        difficulty: "beginner",
        questions: "",
        estimated_duration: "30",
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating exercise:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditExercise = (exercise: any) => {
    setSelectedExercise(exercise)
    setFormData({
      title: exercise.title,
      description: exercise.description,
      subject: exercise.subject,
      difficulty: exercise.difficulty,
      questions: JSON.stringify(exercise.questions, null, 2),
      estimated_duration: exercise.estimated_duration?.toString() || "30",
    })
    setError(null)
    setIsCreateDialogOpen(true)
  }

  const handleUpdateExercise = async () => {
    if (!selectedExercise || !validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Parse questions JSON
      const questions = JSON.parse(formData.questions)

      // Prepare the data object
      const exerciseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        difficulty: formData.difficulty,
        questions: questions,
        estimated_duration: Number.parseInt(formData.estimated_duration),
        max_score: questions.length || 0,
        updated_at: new Date().toISOString(),
      }

      console.log("Updating exercise with data:", exerciseData)

      const { error } = await supabase.from("exercises").update(exerciseData).eq("id", selectedExercise.id)

      if (error) {
        console.error("Error updating exercise:", error)
        setError(error.message || "Failed to update exercise. Please try again.")
        toast({
          title: "Error",
          description: "Failed to update exercise: " + (error.message || "Unknown error"),
          variant: "destructive",
        })
        throw error
      }

      console.log("Exercise updated successfully")

      // Show success message
      toast({
        title: "Success",
        description: "Exercise updated successfully!",
      })

      // Refresh exercises
      await fetchExercises()

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        subject: "mathematics",
        difficulty: "beginner",
        questions: "",
        estimated_duration: "30",
      })
      setSelectedExercise(null)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error updating exercise:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeleteExercise = (exercise: any) => {
    setSelectedExercise(exercise)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteExercise = async () => {
    if (!selectedExercise) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("exercises").delete().eq("id", selectedExercise.id)

      if (error) {
        console.error("Error deleting exercise:", error)
        toast({
          title: "Error",
          description: "Failed to delete exercise: " + (error.message || "Unknown error"),
          variant: "destructive",
        })
        throw error
      }

      // Show success message
      toast({
        title: "Success",
        description: "Exercise deleted successfully!",
      })

      // Refresh exercises
      await fetchExercises()

      // Reset and close dialog
      setSelectedExercise(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting exercise:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <Button
            onClick={() => {
              setSelectedExercise(null)
              setFormData({
                title: "",
                description: "",
                subject: "mathematics",
                difficulty: "beginner",
                questions: "",
                estimated_duration: "30",
              })
              setError(null)
              setIsCreateDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Exercise
          </Button>
        </div>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="social_studies">Social Studies</TabsTrigger>
            <TabsTrigger value="civic_education">Civic Education</TabsTrigger>
            <TabsTrigger value="general_knowledge">General Knowledge</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <ContentTable
              exercises={filteredExercises}
              loading={loading}
              onEdit={handleEditExercise}
              onDelete={confirmDeleteExercise}
              getSubjectIcon={getSubjectIcon}
              getSubjectName={getSubjectName}
            />
          </TabsContent>

          {["mathematics", "science", "social_studies", "civic_education", "general_knowledge"].map((subject) => (
            <TabsContent key={subject} value={subject} className="mt-4">
              <ContentTable
                exercises={filteredExercises.filter((exercise) => exercise.subject === subject)}
                loading={loading}
                onEdit={handleEditExercise}
                onDelete={confirmDeleteExercise}
                getSubjectIcon={getSubjectIcon}
                getSubjectName={getSubjectName}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Create/Edit Exercise Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedExercise ? "Edit Exercise" : "Create New Exercise"}</DialogTitle>
              <DialogDescription>
                {selectedExercise
                  ? "Update the exercise details below."
                  : "Fill in the details to create a new exercise."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Exercise title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social_studies">Social Studies</SelectItem>
                      <SelectItem value="civic_education">Civic Education</SelectItem>
                      <SelectItem value="general_knowledge">General Knowledge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_duration">Duration (minutes)</Label>
                  <Input
                    id="estimated_duration"
                    name="estimated_duration"
                    type="number"
                    value={formData.estimated_duration}
                    onChange={handleInputChange}
                    placeholder="30"
                    min="1"
                    max="180"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the exercise"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions">Questions (JSON Format)</Label>
                <Textarea
                  id="questions"
                  name="questions"
                  value={formData.questions}
                  onChange={handleInputChange}
                  placeholder={`[
  {
    "id": 1,
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "explanation": "2 + 2 equals 4"
  }
]`}
                  className="min-h-[300px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter questions in JSON format. Each question should have: id, question, options (array),
                  correctAnswer (index), and explanation.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={selectedExercise ? handleUpdateExercise : handleCreateExercise} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedExercise ? "Update Exercise" : "Create Exercise"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the exercise "{selectedExercise?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteExercise} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Exercise
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </div>
  )
}

interface ContentTableProps {
  exercises: any[]
  loading: boolean
  onEdit: (exercise: any) => void
  onDelete: (exercise: any) => void
  getSubjectIcon: (subject: string) => React.ReactNode
  getSubjectName: (subject: string) => string
}

function ContentTable({ exercises, loading, onEdit, onDelete, getSubjectIcon, getSubjectName }: ContentTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No exercises found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className="font-medium">{exercise.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getSubjectIcon(exercise.subject)}
                  <span>{getSubjectName(exercise.subject)}</span>
                </div>
              </TableCell>
              <TableCell className="capitalize">{exercise.difficulty}</TableCell>
              <TableCell>{exercise.questions?.length || 0}</TableCell>
              <TableCell>{exercise.estimated_duration}m</TableCell>
              <TableCell>{new Date(exercise.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(exercise)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(exercise)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
