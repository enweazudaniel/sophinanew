import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Submit exercise attempt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exerciseId, studentId, answers, timeSpent } = body

    // Get exercise details
    const { data: exercise, error: exerciseError } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", exerciseId)
      .single()

    if (exerciseError || !exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
    }

    // Check if student has attempts remaining
    const { data: existingAttempts, error: attemptsError } = await supabase
      .from("exercise_attempts")
      .select("attempt_number")
      .eq("exercise_id", exerciseId)
      .eq("student_id", studentId)
      .order("attempt_number", { ascending: false })

    if (attemptsError) throw attemptsError

    const attemptNumber = (existingAttempts?.[0]?.attempt_number || 0) + 1

    if (attemptNumber > exercise.attempts_allowed) {
      return NextResponse.json({ error: "Maximum attempts exceeded" }, { status: 400 })
    }

    // Calculate score for auto-gradable exercises
    let score = 0
    let maxScore = 0
    let feedback = ""

    if (exercise.auto_grade && exercise.questions) {
      const questions = exercise.questions as any[]
      maxScore = questions.length

      questions.forEach((question, index) => {
        if (answers[question.id] === question.correctAnswer) {
          score++
        }
      })

      score = Math.round((score / maxScore) * 100)

      if (score >= exercise.passing_score) {
        feedback = "Congratulations! You passed this exercise."
      } else {
        feedback = `You scored ${score}%. The passing score is ${exercise.passing_score}%.`
      }
    }

    // Save attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("exercise_attempts")
      .insert({
        exercise_id: exerciseId,
        student_id: studentId,
        attempt_number: attemptNumber,
        answers: answers,
        score: score,
        max_score: maxScore,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
        is_completed: true,
        feedback: feedback,
      })
      .select()

    if (attemptError) throw attemptError

    // Update exercise analytics
    await updateExerciseAnalytics(exerciseId)

    return NextResponse.json({
      success: true,
      attempt: attempt[0],
      score,
      maxScore,
      feedback,
      showResults: exercise.show_results_immediately,
    })
  } catch (error) {
    console.error("Error submitting exercise attempt:", error)
    return NextResponse.json({ error: "Failed to submit attempt" }, { status: 500 })
  }
}

async function updateExerciseAnalytics(exerciseId: number) {
  try {
    const { data: attempts } = await supabase
      .from("exercise_attempts")
      .select("score, student_id")
      .eq("exercise_id", exerciseId)
      .eq("is_completed", true)

    if (attempts && attempts.length > 0) {
      const totalAttempts = attempts.length
      const averageScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / totalAttempts
      const uniqueStudents = new Set(attempts.map((attempt) => attempt.student_id)).size

      // Get total students who should have attempted this exercise
      const { data: classExercises } = await supabase
        .from("class_exercises")
        .select("class_id")
        .eq("exercise_id", exerciseId)

      let totalStudents = 0
      if (classExercises) {
        for (const classExercise of classExercises) {
          const { count } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("class_id", classExercise.class_id)
            .eq("role", "student")

          totalStudents += count || 0
        }
      }

      const completionRate = totalStudents > 0 ? (uniqueStudents / totalStudents) * 100 : 0

      await supabase.from("exercise_analytics").upsert({
        exercise_id: exerciseId,
        total_attempts: totalAttempts,
        average_score: averageScore,
        completion_rate: completionRate,
        last_updated: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error updating analytics:", error)
  }
}
