import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const studentId = url.searchParams.get("studentId")

  if (!studentId) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
  }

  try {
    // Get student metrics
    const { data: metricsData, error: metricsError } = await supabase
      .from("student_metrics")
      .select("*")
      .eq("student_id", studentId)
      .single()

    if (metricsError && metricsError.code !== "PGRST116") {
      console.error("Error fetching student metrics:", metricsError)
      return NextResponse.json({ error: "Failed to fetch student metrics" }, { status: 500 })
    }

    // If no metrics exist yet, get total lessons count to initialize
    if (!metricsData) {
      const { count: totalLessons, error: countError } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })

      if (countError) {
        console.error("Error counting lessons:", countError)
        return NextResponse.json({ error: "Failed to count lessons" }, { status: 500 })
      }

      // Return default metrics
      return NextResponse.json({
        metrics: {
          student_id: Number.parseInt(studentId),
          overall_progress: 0,
          lessons_completed: 0,
          total_lessons: totalLessons || 0,
          time_spent: 0,
          last_active: new Date().toISOString(),
        },
      })
    }

    // Return existing metrics
    return NextResponse.json({ metrics: metricsData })
  } catch (error) {
    console.error("Error in student metrics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
