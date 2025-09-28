import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")
  const type = url.searchParams.get("type") || "all"

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    const results: any = { exercises: [], lessons: [], assignments: [] }

    // Search exercises
    if (type === "all" || type === "exercises") {
      const { data: exercises, error: exercisesError } = await supabase
        .from("lessons")
        .select("id, title, description, category, difficulty")
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(10)

      if (exercisesError) throw exercisesError
      results.exercises = exercises || []
    }

    // Search assignments
    if (type === "all" || type === "assignments") {
      const { data: assignments, error: assignmentsError } = await supabase
        .from("assignments")
        .select("id, title, description, assignment_type, due_date")
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(10)

      if (assignmentsError) throw assignmentsError
      results.assignments = assignments || []
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}
