"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EnhancedFileUploader } from "./enhanced-file-uploader"
import { CalendarIcon, Users, FileText, Settings, Plus, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface Class {
  id: number
  name: string
  grade_level: string
  student_count?: number
}

interface GradingScale {
  id: number
  name: string
  min_score: number
  max_score: number
  description: string
}

interface AssignmentFormData {
  title: string
  description: string
  instructions: string
  assignment_type: string
  due_date: Date | null
  max_score: number
  grading_scale_id: number
  selected_classes: number[]
  attachments: { url: string; name: string; type: string; size: number }[]
  time_limit: number | null
  allow_late_submission: boolean
  show_correct_answers: boolean
}

interface EnhancedAssignmentFormProps {
  onSubmit: (data: AssignmentFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<AssignmentFormData>
  isEditing?: boolean
}

export function EnhancedAssignmentForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: EnhancedAssignmentFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [gradingScales, setGradingScales] = useState<GradingScale[]>([])
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: "",
    description: "",
    instructions: "",
    assignment_type: "homework",
    due_date: null,
    max_score: 100,
    grading_scale_id: 2, // Default to 0-10 scale
    selected_classes: [],
    attachments: [],
    time_limit: null,
    allow_late_submission: true,
    show_correct_answers: false,
    ...initialData,
  })

  useEffect(() => {
    fetchClasses()
    fetchGradingScales()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          id,
          name,
          grade_level,
          students:students(count)
        `)
        .order("name")

      if (error) throw error

      const classesWithCount =
        data?.map((cls) => ({
          ...cls,
          student_count: cls.students?.[0]?.count || 0,
        })) || []

      setClasses(classesWithCount)
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      })
    }
  }

  const fetchGradingScales = async () => {
    try {
      const { data, error } = await supabase.from("grading_scales").select("*").order("min_score")

      if (error) throw error
      setGradingScales(data || [])
    } catch (error) {
      console.error("Error fetching grading scales:", error)
    }
  }

  const handleInputChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClassToggle = (classId: number) => {
    setFormData((prev) => ({
      ...prev,
      selected_classes: prev.selected_classes.includes(classId)
        ? prev.selected_classes.filter((id) => id !== classId)
        : [...prev.selected_classes, classId],
    }))
  }

  const handleFilesUploaded = (files: { url: string; name: string; type: string; size: number }[]) => {
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
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

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      })
      return
    }

    if (formData.selected_classes.length === 0) {
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
      console.error("Error submitting assignment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedGradingScale = gradingScales.find((scale) => scale.id === formData.grading_scale_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <FileText className="w-4 h-4 mr-2" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="classes">
            <Users className="w-4 h-4 mr-2" />
            Classes
          </TabsTrigger>
          <TabsTrigger value="files">
            <Plus className="w-4 h-4 mr-2" />
            Attachments
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Assignment title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.assignment_type}
                    onValueChange={(value) => handleInputChange("assignment_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homework">Homework</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
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
                  placeholder="Brief description of the assignment"
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
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.due_date ? format(formData.due_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.due_date || undefined}
                        onSelect={(date) => handleInputChange("due_date", date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    value={formData.time_limit || ""}
                    onChange={(e) =>
                      handleInputChange("time_limit", e.target.value ? Number.parseInt(e.target.value) : null)
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <p className="text-muted-foreground">No classes available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={`class-${cls.id}`}
                        checked={formData.selected_classes.includes(cls.id)}
                        onCheckedChange={() => handleClassToggle(cls.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`class-${cls.id}`} className="font-medium">
                          {cls.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Grade {cls.grade_level} • {cls.student_count} students
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.selected_classes.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected Classes:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.selected_classes.map((classId) => {
                      const cls = classes.find((c) => c.id === classId)
                      return cls ? (
                        <Badge key={classId} variant="secondary">
                          {cls.name}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => handleClassToggle(classId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedFileUploader
                onFilesUploaded={handleFilesUploaded}
                maxFiles={10}
                maxSize={50}
                context="assignment"
                acceptedTypes={[
                  "image/*",
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "text/plain",
                ]}
              />

              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label className="text-sm font-medium">Attached Files:</Label>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grading & Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grading_scale">Grading Scale</Label>
                  <Select
                    value={formData.grading_scale_id.toString()}
                    onValueChange={(value) => handleInputChange("grading_scale_id", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradingScales.map((scale) => (
                        <SelectItem key={scale.id} value={scale.id.toString()}>
                          {scale.name} ({scale.min_score}-{scale.max_score})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_score">Maximum Score</Label>
                  <Input
                    id="max_score"
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => handleInputChange("max_score", Number.parseInt(e.target.value) || 100)}
                    min={selectedGradingScale?.min_score || 0}
                    max={selectedGradingScale?.max_score || 100}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow_late"
                    checked={formData.allow_late_submission}
                    onCheckedChange={(checked) => handleInputChange("allow_late_submission", checked)}
                  />
                  <Label htmlFor="allow_late">Allow late submissions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show_answers"
                    checked={formData.show_correct_answers}
                    onCheckedChange={(checked) => handleInputChange("show_correct_answers", checked)}
                  />
                  <Label htmlFor="show_answers">Show correct answers after submission</Label>
                </div>
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
          {isEditing ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  )
}
