"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, ImageIcon, Music, Video, X, Download, Eye, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUpload {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  url?: string
  error?: string
}

interface EnhancedFileUploaderProps {
  onFilesUploaded: (files: { url: string; name: string; type: string; size: number }[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  context?: string
  contextId?: number
  className?: string
}

const ACCEPTED_FILE_TYPES = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
  "video/*": [".mp4", ".webm", ".ogg", ".avi", ".mov"],
  "text/plain": [".txt"],
  "application/json": [".json"],
}

export function EnhancedFileUploader({
  onFilesUploaded,
  maxFiles = 10,
  maxSize = 50, // 50MB default
  acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES),
  context = "general",
  contextId,
  className = "",
}: EnhancedFileUploaderProps) {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (file.type === "application/pdf") return <File className="h-4 w-4" />
    if (file.type.startsWith("audio/")) return <Music className="h-4 w-4" />
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("context", context)
    if (contextId) formData.append("contextId", contextId.toString())

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Upload failed")
    }

    const result = await response.json()
    return result.url
  }

  const handleUpload = async (files: File[]) => {
    if (uploads.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const newUploads: FileUpload[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploads((prev) => [...prev, ...newUploads])

    const uploadPromises = newUploads.map(async (upload) => {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id && u.progress < 90 ? { ...u, progress: u.progress + 10 } : u)),
          )
        }, 200)

        const url = await uploadFile(upload.file)

        clearInterval(progressInterval)

        setUploads((prev) =>
          prev.map((u) => (u.id === upload.id ? { ...u, progress: 100, status: "completed" as const, url } : u)),
        )

        return {
          url,
          name: upload.file.name,
          type: upload.file.type,
          size: upload.file.size,
        }
      } catch (error) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, status: "error" as const, error: error instanceof Error ? error.message : "Upload failed" }
              : u,
          ),
        )
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(Boolean) as { url: string; name: string; type: string; size: number }[]

    if (successfulUploads.length > 0) {
      onFilesUploaded(successfulUploads)
      toast({
        title: "Upload successful",
        description: `${successfulUploads.length} file(s) uploaded successfully`,
      })
    }

    setIsUploading(false)
  }

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ errors }) => errors[0]?.message).join(", ")
      toast({
        title: "File rejected",
        description: errors,
        variant: "destructive",
      })
    }

    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = ACCEPTED_FILE_TYPES[type as keyof typeof ACCEPTED_FILE_TYPES] || []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize: maxSize * 1024 * 1024,
    multiple: maxFiles > 1,
  })

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">{isDragActive ? "Drop files here" : "Drag & drop files here"}</p>
              <p className="text-sm text-muted-foreground">or click to browse files</p>
              <p className="text-xs text-muted-foreground">
                Max {maxFiles} files, {maxSize}MB each
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          {uploads.map((upload) => (
            <Card key={upload.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(upload.file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{upload.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(upload.file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {upload.status === "uploading" && (
                      <div className="flex items-center space-x-2">
                        <Progress value={upload.progress} className="w-20" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}

                    {upload.status === "completed" && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Completed</Badge>
                        {upload.url && (
                          <>
                            <Button size="sm" variant="ghost" asChild>
                              <a href={upload.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="ghost" asChild>
                              <a href={upload.url} download={upload.file.name}>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {upload.status === "error" && <Badge variant="destructive">Error</Badge>}

                    <Button size="sm" variant="ghost" onClick={() => removeUpload(upload.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {upload.status === "error" && upload.error && (
                  <p className="text-xs text-destructive mt-2">{upload.error}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
