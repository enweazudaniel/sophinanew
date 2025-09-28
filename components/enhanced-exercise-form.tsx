"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Loader2, Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points?: number
}

interface Class {
  id: number
  name: string
  grade_level: string
}

interface ExerciseFormData {
  title: string
  description: string
  instructions: string
  subject: string
  difficulty: string
  estimatedDuration: number
  attemptsAllowed: number
  passingScore: number
  autoGrade: boolean
  showResultsImmediately: boolean
  selectedClasses: number[]
  questions: Question[]
  tags: string[]
}

interface EnhancedExerciseFormProps {
  onSubmit: (data: ExerciseFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<ExerciseFormData>
  isEditing?: boolean
}

export function EnhancedExerciseForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: EnhancedExerciseFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [currentTag, setCurrentTag] = useState("")

  const [formData, setFormData] = useState<ExerciseFormData>({
    title: "",
    description: "",
    instructions: "",
    subject: "mathematics",
    difficulty: "beginner",
    estimatedDuration: 30,
    attemptsAllowed: 3,
    passingScore: 60,
    autoGrade: true,
    showResultsImmediately: true,
    selectedClasses: [],
    questions: [],
    tags: [],
    ...initialData,
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase.from("classes").select("id, name, grade_level").order("name")

      if (error) throw error
      setClasses(data || [])
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof ExerciseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 1,
    }
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleClassToggle = (classId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter((id) => id !== classId)
        : [...prev.selectedClasses, classId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (formData.questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one question is required",
        variant: "destructive",
      })
      return
    }

    if (formData.selectedClasses.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one class",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewExercise = () => {
    // Open preview modal or navigate to preview page
    toast({
      title: "Preview",
      description: "Preview functionality would open here",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Information</CardTitle>
              <CardDescription>Basic details about the exercise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Exercise title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger>
                      <SelectValue />
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

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the exercise"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange("instructions", e.target.value)}
                  placeholder="Detailed instructions for students"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Settings</CardTitle>
              <CardDescription>Configure how the exercise behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange("estimatedDuration", Number.parseInt(e.target.value))}
                    min="5"
                    max="180"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attempts">Attempts Allowed</Label>
                  <Input
                    id="attempts"
                    type="number"
                    value={formData.attemptsAllowed}
                    onChange={(e) => handleInputChange("attemptsAllowed", Number.parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => handleInputChange("passingScore", Number.parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Grade</Label>
                    <p className="text-sm text-muted-foreground">Automatically grade multiple choice questions</p>
                  </div>
                  <Switch
                    checked={formData.autoGrade}
                    onCheckedChange={(checked) => handleInputChange("autoGrade", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Results Immediately</Label>
                    <p className="text-sm text-muted-foreground">Show results and explanations after submission</p>
                  </div>
                  <Switch
                    checked={formData.showResultsImmediately}
                    onCheckedChange={(checked) => handleInputChange("showResultsImmediately", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>Add multiple choice questions</CardDescription>
                </div>
                <Button type="button" onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No questions added yet. Click "Add Question" to get started.
                </div>
              ) : (
                formData.questions.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-medium">Question {index + 1}</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeQuestion(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(index, "question", e.target.value)}
                        placeholder="Enter your question"
                        required
                      />

                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                            <Checkbox
                              checked={question.correctAnswer === optionIndex}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateQuestion(index, "correctAnswer", optionIndex)
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <Textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(index, "explanation", e.target.value)}
                        placeholder="Explanation for the correct answer"
                        required
                      />
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign to Classes</CardTitle>
              <CardDescription>Select which classes can access this exercise</CardDescription>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <p className="text-muted-foreground">No classes available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`class-${cls.id}`}
                        checked={formData.selectedClasses.includes(cls.id)}
                        onCheckedChange={() => handleClassToggle(cls.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`class-${cls.id}`} className="font-medium">
                          {cls.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">Grade {cls.grade_level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Preview</CardTitle>
              <CardDescription>Preview how the exercise will appear to students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-xl font-bold mb-2">{formData.title || "Exercise Title"}</h3>
                  <p className="text-muted-foreground mb-4">{formData.description || "Exercise description"}</p>

                  <div className="flex gap-2 mb-4">
                    <Badge>{formData.subject}</Badge>
                    <Badge variant="outline">{formData.difficulty}</Badge>
                    <Badge variant="outline">{formData.estimatedDuration} min</Badge>
                    <Badge variant="outline">{formData.questions.length} questions</Badge>
                  </div>

                  {formData.instructions && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm">{formData.instructions}</p>
                    </div>
                  )}
                </div>

                <Button type="button" onClick={previewExercise} variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Full Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Exercise" : "Create Exercise"}
        </Button>
      </div>
    </form>
  )
}
