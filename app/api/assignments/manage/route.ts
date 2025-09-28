import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Get assignments for a teacher
export async function GET(request: Request) {
  const url = new URL(request.url)
  const teacherId = url.searchParams.get("teacherId")

  if (!teacherId) {
    return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
  }

  try {
    const { data: assignments, error } = await supabase
      .from("assignments")
      .select(`
        *,
        submissions:submissions(count)
      `)
      .eq("created_by", Number.parseInt(teacherId))
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 })
  }
}

// Create new assignment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, assignmentType, dueDate, teacherId } = body

    if (!title || !description || !assignmentType || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        title,
        description,
        assignment_type: assignmentType,
        due_date: dueDate,
        created_by: teacherId,
      })
      .select()

    if (error) throw error

    // Create notifications for students in teacher's classes
    const { data: students } = await supabase.from("students").select("id").eq("classes.teacher_id", teacherId)

    if (students && students.length > 0) {
      const notifications = students.map((student) => ({
        user_id: student.id,
        title: "New Assignment",
        message: `New assignment: ${title}`,
        type: "assignment",
      }))

      await supabase.from("notifications").insert(notifications)
    }

    return NextResponse.json({ assignment: data[0] })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 })
  }
}
