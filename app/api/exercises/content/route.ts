import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter required" }, { status: 400 })
    }

    const { data: lesson, error } = await supabase.from("lessons").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      category: lesson.category,
      difficulty: lesson.difficulty,
      estimatedTime: lesson.estimated_time,
      isAvailable: lesson.is_available,
    })
  } catch (error) {
    console.error("Error fetching lesson content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
