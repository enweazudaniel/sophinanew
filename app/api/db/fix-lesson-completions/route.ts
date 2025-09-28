import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // 1. Get all students
    const { data: students, error: studentsError } = await supabase.from("users").select("id").eq("role", "student")

    if (studentsError) {
      console.error("Error fetching students:", studentsError)
      return NextResponse.json({ success: false, error: studentsError.message }, { status: 500 })
    }

    const results = {
      totalStudents: students?.length || 0,
      processedStudents: 0,
      fixedCompletions: 0,
      errors: [],
    }

    // 2. For each student, check and fix their lesson completions
    for (const student of students || []) {
      try {
        // Get all lesson completions for this student
        const { data: completions, error: completionsError } = await supabase
          .from("lesson_completions")
          .select("*")
          .eq("student_id", student.id)

        if (completionsError) {
          console.error(`Error fetching completions for student ${student.id}:`, completionsError)
          results.errors.push(`Failed to fetch completions for student ${student.id}: ${completionsError.message}`)
          continue
        }

        // Check for missing fields and fix them
        for (const completion of completions || []) {
          let needsUpdate = false
          const updates: any = {}

          if (!completion.attempts) {
            updates.attempts = 1
            needsUpdate = true
          }

          if (!completion.last_attempt_at) {
            updates.last_attempt_at = completion.completed_at
            needsUpdate = true
          }

          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from("lesson_completions")
              .update(updates)
              .eq("id", completion.id)

            if (updateError) {
              console.error(`Error updating completion ${completion.id}:`, updateError)
              results.errors.push(`Failed to update completion ${completion.id}: ${updateError.message}`)
            } else {
              results.fixedCompletions++
            }
          }
        }

        // Update student metrics
        await supabase.rpc("recalculate_student_metrics", { student_id: student.id })

        results.processedStudents++
      } catch (error) {
        console.error(`Error processing student ${student.id}:`, error)
        results.errors.push(
          `Failed to process student ${student.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    }

    // 3. Return the results
    return NextResponse.json({
      success: true,
      message: "Lesson completion data fixed successfully",
      results,
    })
  } catch (error) {
    console.error("Fix operation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
