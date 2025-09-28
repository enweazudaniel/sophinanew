"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, LinkIcon, X } from "lucide-react"

interface MediaUploaderProps {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function MediaUploader({ onUpload, currentUrl }: MediaUploaderProps) {
  const [url, setUrl] = useState(currentUrl || "")
  const [isUploading, setIsUploading] = useState(false)

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onUpload(url.trim())
    }
  }

  const handleClear = () => {
    setUrl("")
    onUpload("")
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // For now, we'll just create a placeholder URL
      // In a real app, you'd upload to a service like Supabase Storage
      const mockUrl = `https://placeholder.com/${file.name}`
      setUrl(mockUrl)
      onUpload(mockUrl)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input placeholder="Enter media URL" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
        <Button type="button" variant="outline" size="icon" onClick={handleUrlSubmit}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        {url && (
          <Button type="button" variant="outline" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">or</span>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button type="button" variant="outline" size="sm" disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </label>
      </div>

      {url && <div className="text-xs text-muted-foreground">Current: {url}</div>}
    </div>
  )
}
