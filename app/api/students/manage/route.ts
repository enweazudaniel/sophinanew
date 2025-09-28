import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Get students for a teacher's classes
export async function GET(request: Request) {
  const url = new URL(request.url)
  const teacherId = url.searchParams.get("teacherId")

  if (!teacherId) {
    return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
  }

  try {
    const { data: students, error } = await supabase
      .from("students")
      .select(`
        *,
        classes:classes(name, teacher_id),
        student_metrics:student_metrics(*)
      `)
      .eq("classes.teacher_id", Number.parseInt(teacherId))

    if (error) throw error

    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

// Add student to class
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, classId } = body

    if (!studentId || !classId) {
      return NextResponse.json({ error: "Student ID and Class ID are required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("students").update({ class_id: classId }).eq("id", studentId).select()

    if (error) throw error

    return NextResponse.json({ student: data[0] })
  } catch (error) {
    console.error("Error adding student to class:", error)
    return NextResponse.json({ error: "Failed to add student to class" }, { status: 500 })
  }
}
