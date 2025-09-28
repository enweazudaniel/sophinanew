import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const context = (formData.get("context") as string) || "general"
    const contextId = formData.get("contextId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const filename = `${timestamp}_${randomString}.${fileExtension}`
    const filePath = `uploads/${context}/${filename}`

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("files").upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(filePath)

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from("file_uploads")
      .insert({
        filename,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: 1, // TODO: Get from session
        uploaded_by_type: "teacher",
        upload_context: context,
        context_id: contextId ? Number.parseInt(contextId) : null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      // Don't fail the upload if DB insert fails
    }

    return NextResponse.json({
      url: publicUrl,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
