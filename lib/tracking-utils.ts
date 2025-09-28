import { supabase } from "./supabase"

export interface StudentMetrics {
  student_id: number
  lessons_completed: number
  total_lessons: number
  exercises_completed: number
  total_exercises: number
  overall_progress: number
  average_score: number
  time_spent: number
  streak_days: number
  last_active: string
}

export interface Achievement {
  id: number
  student_id: number
  achievement_name: string
  achievement_description: string
  category: string
  earned_at: string
  progress: number
}

export interface CompletedLesson {
  id: number
  lesson_id: number
  student_id: number
  score: number
  completed_at: string
  time_spent: number
  attempts: number
}

// Format time in seconds to readable format
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
}

// Mark a lesson as completed
export async function markLessonCompleted(
  studentId: number,
  lessonId: number,
  score = 100,
  timeSpent = 0,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("lesson_completions").upsert({
      student_id: studentId,
      lesson_id: lessonId,
      score,
      time_spent: timeSpent,
      completed_at: new Date().toISOString(),
      attempts: 1,
    })

    if (error) {
      console.error("Error marking lesson completed:", error)
      return false
    }

    // Award achievements if applicable
    await checkAndAwardAchievements(studentId)

    return true
  } catch (error) {
    console.error("Error in markLessonCompleted:", error)
    return false
  }
}

// Refresh student metrics
export async function refreshStudentMetrics(studentId: number): Promise<StudentMetrics | null> {
  try {
    // Get lesson completions
    const { data: completions, error: completionsError } = await supabase
      .from("lesson_completions")
      .select("*")
      .eq("student_id", studentId)

    if (completionsError) {
      console.error("Error fetching completions:", completionsError)
      return null
    }

    // Get exercise submissions
    const { data: exercises, error: exercisesError } = await supabase
      .from("exercise_submissions")
      .select("*")
      .eq("student_id", studentId)

    if (exercisesError) {
      console.error("Error fetching exercises:", exercisesError)
    }

    // Get total counts
    const { count: totalLessons } = await supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)

    const { count: totalExercises } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true })
      .eq("is_available", true)

    // Calculate metrics
    const lessonsCompleted = completions?.length || 0
    const exercisesCompleted = exercises?.length || 0
    const totalTimeSpent =
      (completions || []).reduce((sum, c) => sum + (c.time_spent || 0), 0) +
      (exercises || []).reduce((sum, e) => sum + (e.time_spent || 0), 0)
    const averageScore =
      completions && completions.length > 0
        ? completions.reduce((sum, c) => sum + (c.score || 0), 0) / completions.length
        : 0
    const overallProgress = totalLessons && totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0

    const metrics: StudentMetrics = {
      student_id: studentId,
      lessons_completed: lessonsCompleted,
      total_lessons: totalLessons || 0,
      exercises_completed: exercisesCompleted,
      total_exercises: totalExercises || 0,
      overall_progress: overallProgress,
      average_score: averageScore,
      time_spent: totalTimeSpent,
      streak_days: 0, // Calculate based on consecutive days
      last_active: new Date().toISOString(),
    }

    // Update metrics in database
    const { error: updateError } = await supabase.from("student_metrics").upsert(metrics)

    if (updateError) {
      console.error("Error updating metrics:", updateError)
    }

    return metrics
  } catch (error) {
    console.error("Error refreshing student metrics:", error)
    return null
  }
}

// Get lesson completion status
export async function getLessonCompletionStatus(studentId: number, lessonId: number): Promise<CompletedLesson | null> {
  try {
    const { data, error } = await supabase
      .from("lesson_completions")
      .select("*")
      .eq("student_id", studentId)
      .eq("lesson_id", lessonId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error getting completion status:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getLessonCompletionStatus:", error)
    return null
  }
}

// Track time spent on a lesson
export async function trackTimeSpent(studentId: number, lessonId: number, timeSpent: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("lesson_completions").upsert({
      student_id: studentId,
      lesson_id: lessonId,
      time_spent: timeSpent,
      completed_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error tracking time:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in trackTimeSpent:", error)
    return false
  }
}

// Get student achievements
export async function getStudentAchievements(studentId: number): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from("student_achievements")
      .select("*")
      .eq("student_id", studentId)
      .order("earned_at", { ascending: false })

    if (error) {
      console.error("Error fetching achievements:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getStudentAchievements:", error)
    return []
  }
}

// Get completed lessons for a student
export async function getCompletedLessons(studentId: number): Promise<CompletedLesson[]> {
  try {
    const { data, error } = await supabase
      .from("lesson_completions")
      .select("*")
      .eq("student_id", studentId)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Error fetching completed lessons:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCompletedLessons:", error)
    return []
  }
}

// Check and award achievements
async function checkAndAwardAchievements(studentId: number): Promise<void> {
  try {
    const completions = await getCompletedLessons(studentId)
    const achievements = await getStudentAchievements(studentId)
    const existingAchievements = new Set(achievements.map((a) => a.achievement_name))

    // First lesson achievement
    if (completions.length >= 1 && !existingAchievements.has("First Lesson Complete")) {
      await supabase.from("student_achievements").insert({
        student_id: studentId,
        achievement_name: "First Lesson Complete",
        achievement_description: "Completed your first lesson",
        category: "milestone",
      })
    }

    // High scorer achievement
    const highScores = completions.filter((c) => c.score >= 90)
    if (highScores.length >= 1 && !existingAchievements.has("High Scorer")) {
      await supabase.from("student_achievements").insert({
        student_id: studentId,
        achievement_name: "High Scorer",
        achievement_description: "Scored 90% or higher on a lesson",
        category: "performance",
      })
    }

    // Consistent learner achievement
    if (completions.length >= 5 && !existingAchievements.has("Consistent Learner")) {
      await supabase.from("student_achievements").insert({
        student_id: studentId,
        achievement_name: "Consistent Learner",
        achievement_description: "Completed 5 lessons",
        category: "milestone",
      })
    }
  } catch (error) {
    console.error("Error checking achievements:", error)
  }
}
