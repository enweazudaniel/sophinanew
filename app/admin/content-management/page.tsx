"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Edit, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Exercise {
  id: number
  title: string
  description: string
  content: any
  exercise_type: string
  category: string
  difficulty: string
  is_available: boolean
  estimated_duration: number
  max_score: number
}

interface Lesson {
  id: number
  title: string
  description: string
  content: any
  category: string
  difficulty: string
  is_available: boolean
  estimated_duration: number
}

export default function ContentManagementPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<{ type: "exercise" | "lesson"; id: number } | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      // Fetch exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from("exercises")
        .select("*")
        .order("category", { ascending: true })

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("category", { ascending: true })

      if (exercisesError) throw exercisesError
      if (lessonsError) throw lessonsError

      setExercises(exercisesData || [])
      setLessons(lessonsData || [])
    } catch (error) {
      console.error("Error fetching content:", error)
      setMessage({ type: "error", text: "Failed to load content" })
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (type: "exercise" | "lesson", id: number, currentStatus: boolean) => {
    try {
      const table = type === "exercise" ? "exercises" : "lessons"
      const { error } = await supabase.from(table).update({ is_available: !currentStatus }).eq("id", id)

      if (error) throw error

      // Update local state
      if (type === "exercise") {
        setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, is_available: !currentStatus } : ex)))
      } else {
        setLessons((prev) =>
          prev.map((lesson) => (lesson.id === id ? { ...lesson, is_available: !currentStatus } : lesson)),
        )
      }

      setMessage({
        type: "success",
        text: `${type === "exercise" ? "Exercise" : "Lesson"} ${!currentStatus ? "enabled" : "disabled"} successfully`,
      })
    } catch (error) {
      console.error("Error toggling availability:", error)
      setMessage({ type: "error", text: "Failed to update availability" })
    }
  }

  const startEditing = (type: "exercise" | "lesson", item: Exercise | Lesson) => {
    setEditingItem({ type, id: item.id })
    setEditForm({
      title: item.title,
      description: item.description,
      content: typeof item.content === "string" ? item.content : JSON.stringify(item.content, null, 2),
      difficulty: item.difficulty,
      estimated_duration: item.estimated_duration,
    })
  }

  const saveEdit = async () => {
    if (!editingItem) return

    setSaving(true)
    try {
      const table = editingItem.type === "exercise" ? "exercises" : "lessons"
      let content = editForm.content

      // Try to parse JSON content
      try {
        content = JSON.parse(editForm.content)
      } catch {
        // If not valid JSON, keep as string
      }

      const { error } = await supabase
        .from(table)
        .update({
          title: editForm.title,
          description: editForm.description,
          content: content,
          difficulty: editForm.difficulty,
          estimated_duration: Number.parseInt(editForm.estimated_duration),
        })
        .eq("id", editingItem.id)

      if (error) throw error

      setMessage({ type: "success", text: "Content updated successfully" })
      setEditingItem(null)
      setEditForm({})
      fetchContent() // Refresh data
    } catch (error) {
      console.error("Error saving content:", error)
      setMessage({ type: "error", text: "Failed to save content" })
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditForm({})
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage exercises and lessons availability and content</p>
        </div>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList>
            <TabsTrigger value="exercises">Exercises ({exercises.length})</TabsTrigger>
            <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises">
            <div className="grid gap-4">
              {exercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {exercise.title}
                          <Badge variant="outline" className="capitalize">
                            {exercise.category}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {exercise.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {exercise.is_available ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={exercise.is_available}
                          onCheckedChange={() => toggleAvailability("exercise", exercise.id, exercise.is_available)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingItem?.type === "exercise" && editingItem.id === exercise.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content (JSON)</Label>
                          <Textarea
                            id="content"
                            value={editForm.content}
                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                            rows={10}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <select
                              id="difficulty"
                              value={editForm.difficulty}
                              onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                              className="w-full p-2 border rounded"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={editForm.estimated_duration}
                              onChange={(e) => setEditForm({ ...editForm, estimated_duration: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveEdit} disabled={saving}>
                            {saving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Duration: {exercise.estimated_duration} min • Max Score: {exercise.max_score}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => startEditing("exercise", exercise)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Content
                          </Button>
                        </div>
                        <div className="text-sm">
                          <strong>Content Preview:</strong>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                            {typeof exercise.content === "string"
                              ? exercise.content
                              : JSON.stringify(exercise.content, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {lesson.title}
                          <Badge variant="outline" className="capitalize">
                            {lesson.category}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {lesson.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{lesson.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.is_available ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={lesson.is_available}
                          onCheckedChange={() => toggleAvailability("lesson", lesson.id, lesson.is_available)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingItem?.type === "lesson" && editingItem.id === lesson.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="lesson-title">Title</Label>
                          <Input
                            id="lesson-title"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lesson-description">Description</Label>
                          <Input
                            id="lesson-description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lesson-content">Content (JSON)</Label>
                          <Textarea
                            id="lesson-content"
                            value={editForm.content}
                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                            rows={10}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="lesson-difficulty">Difficulty</Label>
                            <select
                              id="lesson-difficulty"
                              value={editForm.difficulty}
                              onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                              className="w-full p-2 border rounded"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                            <Input
                              id="lesson-duration"
                              type="number"
                              value={editForm.estimated_duration}
                              onChange={(e) => setEditForm({ ...editForm, estimated_duration: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveEdit} disabled={saving}>
                            {saving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">Duration: {lesson.estimated_duration} min</div>
                          <Button variant="outline" size="sm" onClick={() => startEditing("lesson", lesson)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Content
                          </Button>
                        </div>
                        <div className="text-sm">
                          <strong>Content Preview:</strong>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                            {typeof lesson.content === "string"
                              ? lesson.content
                              : JSON.stringify(lesson.content, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
