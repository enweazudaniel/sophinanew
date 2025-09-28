import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Get all classes for a teacher
export async function GET(request: Request) {
  const url = new URL(request.url)
  const teacherId = url.searchParams.get("teacherId")

  if (!teacherId) {
    return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
  }

  try {
    const { data: classes, error } = await supabase
      .from("classes")
      .select(`
        *,
        students:students(count)
      `)
      .eq("teacher_id", Number.parseInt(teacherId))

    if (error) throw error

    return NextResponse.json({ classes })
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

// Create a new class
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, teacherId } = body

    if (!name || !teacherId) {
      return NextResponse.json({ error: "Name and teacher ID are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("classes")
      .insert({
        name,
        description,
        teacher_id: teacherId,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ class: data[0] })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
