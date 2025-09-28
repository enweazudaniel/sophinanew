import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Get exercises for a specific class
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const classId = url.searchParams.get("classId")
  const studentId = url.searchParams.get("studentId")
  const subject = url.searchParams.get("subject")

  try {
    let query = supabase
      .from("exercises")
      .select(`
        *,
        class_exercises!inner(
          assigned_at,
          due_date,
          is_active
        ),
        exercise_attempts(
          id,
          attempt_number,
          score,
          is_completed,
          completed_at
        )
      `)
      .eq("is_available", true)

    if (classId) {
      query = query.eq("class_exercises.class_id", classId)
    }

    if (subject) {
      query = query.eq("subject", subject)
    }

    if (studentId) {
      query = query.eq("exercise_attempts.student_id", studentId)
    }

    const { data: exercises, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    // Process exercises to include attempt information
    const processedExercises =
      exercises?.map((exercise) => ({
        ...exercise,
        attempts: exercise.exercise_attempts || [],
        hasAttempted: exercise.exercise_attempts && exercise.exercise_attempts.length > 0,
        bestScore:
          exercise.exercise_attempts?.reduce((max: number, attempt: any) => Math.max(max, attempt.score || 0), 0) || 0,
        attemptsUsed: exercise.exercise_attempts?.length || 0,
        isCompleted: exercise.exercise_attempts?.some((attempt: any) => attempt.is_completed) || false,
      })) || []

    return NextResponse.json({ exercises: processedExercises })
  } catch (error) {
    console.error("Error fetching class exercises:", error)
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
  }
}

// Assign exercise to class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exerciseId, classId, dueDate, teacherId } = body

    // Verify teacher has permission
    const { data: teacher, error: teacherError } = await supabase
      .from("users")
      .select("role")
      .eq("id", teacherId)
      .single()

    if (teacherError || !teacher || (teacher.role !== "teacher" && teacher.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Assign exercise to class
    const { data, error } = await supabase
      .from("class_exercises")
      .insert({
        exercise_id: exerciseId,
        class_id: classId,
        due_date: dueDate,
        is_active: true,
      })
      .select()

    if (error) throw error

    // Create notifications for students in the class
    const { data: students } = await supabase.from("users").select("id").eq("class_id", classId).eq("role", "student")

    if (students && students.length > 0) {
      const notifications = students.map((student) => ({
        user_id: student.id,
        type: "exercise_assigned",
        title: "New Exercise Assigned",
        message: `A new exercise has been assigned to your class`,
        is_read: false,
      }))

      await supabase.from("notifications").insert(notifications)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error assigning exercise:", error)
    return NextResponse.json({ error: "Failed to assign exercise" }, { status: 500 })
  }
}
