"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  ImageIcon,
  LucideComponent as FileIconComponent,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Save,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Assignment {
  id: number
  title: string
  description: string
  instructions?: string
  assignment_type: "text" | "file" | "mixed"
  due_date: string
  max_file_size: number
  allowed_file_types: string[]
  max_score: number
  rubric?: any
  resources?: any
}

interface Submission {
  id: number
  content: string
  submission_type: string
  files: any[]
  status: string
  is_completed: boolean
  submitted_at: string
  updated_at?: string
  score?: number
  feedback?: string
}

interface EnhancedAssignmentSubmissionProps {
  assignment: Assignment
  existingSubmission?: Submission
  studentId: number
  onSubmissionComplete?: (submission: Submission) => void
}

interface FormData {
  content: string
  submissionType: "text" | "file" | "mixed"
}

export default function EnhancedAssignmentSubmission({
  assignment,
  existingSubmission,
  studentId,
  onSubmissionComplete,
}: EnhancedAssignmentSubmissionProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      content: existingSubmission?.content || "",
      submissionType: (existingSubmission?.submission_type as "text" | "file" | "mixed") || assignment.assignment_type,
    },
  })

  const submissionType = watch("submissionType")
  const content = watch("content")

  // File handling
  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const newFiles = Array.from(selectedFiles)
      const validFiles: File[] = []
      const errors: string[] = []

      newFiles.forEach((file) => {
        // Check file size
        if (file.size > assignment.max_file_size) {
          errors.push(`${file.name} exceeds maximum size of ${(assignment.max_file_size / (1024 * 1024)).toFixed(1)}MB`)
          return
        }

        // Check file type
        const fileExtension = file.name.split(".").pop()?.toLowerCase()
        if (fileExtension && !assignment.allowed_file_types.includes(fileExtension)) {
          errors.push(`${file.name} has unsupported file type. Allowed: ${assignment.allowed_file_types.join(", ")}`)
          return
        }

        validFiles.push(file)
      })

      if (errors.length > 0) {
        toast({
          title: "File Upload Errors",
          description: errors.join(". "),
          variant: "destructive",
        })
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles])
        toast({
          title: "Files Added",
          description: `${validFiles.length} file(s) added successfully`,
        })
      }
    },
    [assignment.max_file_size, assignment.allowed_file_types, toast],
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  // Form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("assignmentId", assignment.id.toString())
      formData.append("studentId", studentId.toString())
      formData.append("content", data.content)
      formData.append("submissionType", data.submissionType)

      // Add files if any
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

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

      // Clear form if it's a new submission
      if (!existingSubmission) {
        setFiles([])
        setValue("content", "")
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
      setUploadProgress(0)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      default:
        return <FileIconComponent className="h-4 w-4 text-gray-500" />
    }
  }

  const isOverdue = new Date() > new Date(assignment.due_date)
  const canSubmit = !isOverdue || existingSubmission
  const hasContent = content.trim().length > 0 || files.length > 0

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{assignment.title}</CardTitle>
            <CardDescription>{assignment.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOverdue ? "destructive" : "secondary"}>
              <Clock className="mr-1 h-3 w-3" />
              Due: {new Date(assignment.due_date).toLocaleDateString()}
            </Badge>
            {existingSubmission && (
              <Badge variant={existingSubmission.is_completed ? "default" : "secondary"}>
                {existingSubmission.is_completed ? "Submitted" : "Draft"}
              </Badge>
            )}
          </div>
        </div>

        {assignment.instructions && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions:</strong> {assignment.instructions}
            </AlertDescription>
          </Alert>
        )}

        {isOverdue && !existingSubmission && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>This assignment is overdue. You can no longer submit new work.</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Submission Type Selection */}
          {assignment.assignment_type === "mixed" && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Submission Type</Label>
              <RadioGroup
                value={submissionType}
                onValueChange={(value) => setValue("submissionType", value as "text" | "file" | "mixed")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Text Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file">File Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Text + Files</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Text Content */}
          {(submissionType === "text" || submissionType === "mixed") && (
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-medium">
                Your Response
              </Label>
              <Textarea
                id="content"
                placeholder="Enter your response here..."
                className="min-h-[200px] resize-y"
                disabled={!canSubmit}
                {...register("content", {
                  required: submissionType === "text" ? "Response content is required" : false,
                })}
              />
              {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
            </div>
          )}

          {/* File Upload */}
          {(submissionType === "file" || submissionType === "mixed") && (
            <div className="space-y-4">
              <Label className="text-base font-medium">File Upload</Label>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
                } ${!canSubmit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (canSubmit) {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.multiple = true
                    input.accept = assignment.allowed_file_types.map((type) => `.${type}`).join(",")
                    input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files)
                    input.click()
                  }
                }}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">
                  Allowed types: {assignment.allowed_file_types.join(", ")} • Max size:{" "}
                  {(assignment.max_file_size / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Files ({files.length})</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={!canSubmit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <Separator />

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {existingSubmission ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Last updated:{" "}
                  {new Date(existingSubmission.updated_at || existingSubmission.submitted_at).toLocaleString()}
                </span>
              ) : (
                <span>Make sure to review your work before submitting</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={!canSubmit || isSubmitting || !hasContent} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : existingSubmission ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
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
                <Badge variant={existingSubmission.is_completed ? "default" : "secondary"}>
                  {existingSubmission.is_completed ? "Submitted" : "Draft"}
                </Badge>
              ) : (
                <Badge variant="outline">Not Started</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
