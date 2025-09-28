import { supabase } from "./supabase"

export interface LessonCompletionData {
  studentId: number
  lessonId: number
  score: number
  timeSpent?: number
  answers?: any[]
}

export async function trackLessonCompletion(data: LessonCompletionData) {
  const { studentId, lessonId, score, timeSpent = 0 } = data

  try {
    console.log(`Tracking completion for student ${studentId}, lesson ${lessonId} with score ${score}`)

    // Check if completion record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("lesson_completions")
      .select("*")
      .eq("student_id", studentId)
      .eq("lesson_id", lessonId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking lesson completion:", checkError)
      return { success: false, error: checkError }
    }

    const completionData = {
      student_id: studentId,
      lesson_id: lessonId,
      score,
      completed_at: new Date().toISOString(),
      time_spent: timeSpent,
    }

    let result

    if (existingRecord) {
      console.log(`Found existing record for lesson ${lessonId}, updating...`)
      if (score > existingRecord.score) {
        const { data, error } = await supabase
          .from("lesson_completions")
          .update({
            ...completionData,
            attempts: (existingRecord.attempts || 0) + 1,
          })
          .eq("id", existingRecord.id)
          .select()

        if (error) {
          console.error("Error updating lesson completion:", error)
          return { success: false, error }
        }
        result = data
      } else {
        const { data, error } = await supabase
          .from("lesson_completions")
          .update({ attempts: (existingRecord.attempts || 0) + 1 })
          .eq("id", existingRecord.id)
          .select()

        if (error) {
          console.error("Error updating lesson attempts:", error)
          return { success: false, error }
        }
        result = data
      }
    } else {
      console.log(`No existing record for lesson ${lessonId}, creating new one...`)
      const { data, error } = await supabase
        .from("lesson_completions")
        .insert({
          ...completionData,
          attempts: 1,
        })
        .select()

      if (error) {
        console.error("Error inserting lesson completion:", error)
        return { success: false, error }
      }
      result = data
    }

    // Create notification for achievement with proper user_type
    if (score >= 90) {
      await createNotification({
        userId: studentId,
        userType: "student",
        type: "achievement",
        title: "High Score Achievement",
        message: `You scored ${score}% on a lesson!`,
        metadata: { lessonId, score },
      })
    }

    // Update student metrics
    await updateStudentMetrics(studentId)

    console.log(`Successfully tracked completion for lesson ${lessonId}`)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error tracking lesson completion:", error)
    return { success: false, error }
  }
}

async function updateStudentMetrics(studentId: number) {
  try {
    const { data: completions, error } = await supabase
      .from("lesson_completions")
      .select("*")
      .eq("student_id", studentId)

    if (error) throw error

    const { count: totalLessons, error: countError } = await supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    const uniqueLessons = new Set(completions?.map((c) => c.lesson_id) || [])
    const lessonsCompleted = uniqueLessons.size
    const totalTimeSpent = completions?.reduce((sum, c) => sum + (c.time_spent || 0), 0) || 0
    const averageScore = completions?.length ? completions.reduce((sum, c) => sum + c.score, 0) / completions.length : 0
    const progress = totalLessons ? (lessonsCompleted / totalLessons) * 100 : 0

    const { data: existingMetrics, error: metricsError } = await supabase
      .from("student_metrics")
      .select("*")
      .eq("student_id", studentId)
      .single()

    if (metricsError && metricsError.code !== "PGRST116") throw metricsError

    if (existingMetrics) {
      await supabase
        .from("student_metrics")
        .update({
          lessons_completed: lessonsCompleted,
          total_lessons: totalLessons,
          overall_progress: progress,
          average_score: averageScore,
          time_spent: totalTimeSpent,
          last_active: new Date().toISOString(),
        })
        .eq("student_id", studentId)
    } else {
      await supabase.from("student_metrics").insert({
        student_id: studentId,
        lessons_completed: lessonsCompleted,
        total_lessons: totalLessons,
        overall_progress: progress,
        average_score: averageScore,
        time_spent: totalTimeSpent,
        last_active: new Date().toISOString(),
      })
    }

    return true
  } catch (error) {
    console.error("Error updating student metrics:", error)
    return false
  }
}

export async function createNotification({
  userId,
  userType = "student",
  type,
  title,
  message,
  metadata = {},
}: {
  userId: number
  userType?: "student" | "teacher" | "admin"
  type: string
  title: string
  message: string
  metadata?: any
}) {
  try {
    const { data, error } = await supabase.from("notifications").insert({
      user_id: userId,
      user_type: userType,
      type,
      title,
      message,
      metadata: JSON.stringify(metadata),
      created_at: new Date().toISOString(),
      is_read: false,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error }
  }
}
