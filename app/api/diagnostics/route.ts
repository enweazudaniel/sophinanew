import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const diagnostics = {
      tables: {},
      functions: {},
      data: {},
      issues: [],
    }

    // Check if tables exist and have data
    const tables = [
      "students",
      "teachers",
      "classes",
      "lessons",
      "assignments",
      "lesson_completions",
      "student_metrics",
      "notifications",
      "submissions",
    ]

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

        diagnostics.tables[table] = {
          exists: !error,
          count: count || 0,
          error: error?.message,
        }

        if (error) {
          diagnostics.issues.push(`Table ${table}: ${error.message}`)
        }
      } catch (err) {
        diagnostics.tables[table] = {
          exists: false,
          count: 0,
          error: err.message,
        }
        diagnostics.issues.push(`Table ${table}: ${err.message}`)
      }
    }

    // Check if functions exist
    try {
      const { data: functions } = await supabase.rpc("get_student_dashboard", { p_student_id: 1 })
      diagnostics.functions.get_student_dashboard = { exists: true, working: true }
    } catch (err) {
      diagnostics.functions.get_student_dashboard = { exists: false, error: err.message }
      diagnostics.issues.push(`Function get_student_dashboard: ${err.message}`)
    }

    try {
      const { data: functions } = await supabase.rpc("get_teacher_dashboard", { p_teacher_id: 1 })
      diagnostics.functions.get_teacher_dashboard = { exists: true, working: true }
    } catch (err) {
      diagnostics.functions.get_teacher_dashboard = { exists: false, error: err.message }
      diagnostics.issues.push(`Function get_teacher_dashboard: ${err.message}`)
    }

    // Check sample data
    const { data: sampleStudent } = await supabase.from("students").select("*").limit(1)
    const { data: sampleTeacher } = await supabase.from("teachers").select("*").limit(1)
    const { data: lessonsCount } = await supabase.from("lessons").select("*", { count: "exact", head: true })

    diagnostics.data = {
      hasStudents: sampleStudent && sampleStudent.length > 0,
      hasTeachers: sampleTeacher && sampleTeacher.length > 0,
      lessonsCount: lessonsCount || 0,
      sampleStudent: sampleStudent?.[0],
      sampleTeacher: sampleTeacher?.[0],
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    console.error("Diagnostics error:", error)
    return NextResponse.json(
      {
        error: "Failed to run diagnostics",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
