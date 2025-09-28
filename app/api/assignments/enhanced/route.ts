import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Get enhanced assignments with file support
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const studentId = url.searchParams.get("studentId")
  const classId = url.searchParams.get("classId")

  try {
    let query = supabase.from("assignments").select(`
        *,
        assignment_files(
          id,
          file_name,
          file_path,
          file_size,
          file_type
        ),
        submissions(
          id,
          content,
          status,
          score,
          feedback,
          submitted_at,
          files,
          auto_score,
          manual_score,
          rubric_scores
        )
      `)

    if (classId) {
      query = query.eq("class_id", classId)
    }

    if (studentId) {
      query = query.eq("submissions.student_id", studentId)
    }

    const { data: assignments, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 })
  }
}

// Create enhanced assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      instructions,
      assignmentType,
      dueDate,
      classId,
      teacherId,
      maxFileSize,
      allowedFileTypes,
      rubric,
      autoGrade,
      resources,
    } = body

    const assignmentData = {
      title,
      description,
      instructions,
      assignment_type: assignmentType,
      due_date: dueDate,
      class_id: classId,
      created_by: teacherId,
      max_file_size: maxFileSize || 10485760, // 10MB default
      allowed_file_types: allowedFileTypes || ["pdf", "doc", "docx", "txt"],
      rubric,
      auto_grade: autoGrade || false,
      resources,
    }

    const { data: assignment, error } = await supabase.from("assignments").insert(assignmentData).select()

    if (error) throw error

    // Create notifications for students
    const { data: students } = await supabase.from("users").select("id").eq("class_id", classId).eq("role", "student")

    if (students && students.length > 0) {
      const notifications = students.map((student) => ({
        user_id: student.id,
        type: "assignment",
        title: "New Assignment",
        message: `New assignment: ${title}`,
        is_read: false,
      }))

      await supabase.from("notifications").insert(notifications)
    }

    return NextResponse.json({ success: true, assignment: assignment[0] })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 })
  }
}
