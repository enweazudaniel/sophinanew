import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // Get all exercises from database
    const { data: lessons, error } = await supabase.from("lessons").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
    }

    // Map database lessons to exercise format
    const exercises =
      lessons?.map((lesson) => ({
        id: lesson.slug || lesson.id.toString(),
        title: lesson.title,
        description: lesson.description || "",
        category: lesson.category || "general",
        difficulty: lesson.difficulty || "beginner",
        estimatedTime: lesson.estimated_time || 30,
        isAvailable: lesson.is_available || false,
        content: lesson.content || "",
        href: `/exercises/${lesson.category}/${lesson.slug || lesson.id}`,
      })) || []

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, exerciseId, isAvailable, content, title, description, estimatedTime } = body

    if (action === "toggle_availability") {
      const { error } = await supabase
        .from("lessons")
        .update({ is_available: isAvailable })
        .eq("slug", exerciseId)
        .or(`id.eq.${exerciseId}`)

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ error: "Failed to update exercise" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (action === "update_content") {
      const { error } = await supabase
        .from("lessons")
        .update({
          content,
          title,
          description,
          estimated_time: estimatedTime,
        })
        .eq("slug", exerciseId)
        .or(`id.eq.${exerciseId}`)

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating exercise:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
