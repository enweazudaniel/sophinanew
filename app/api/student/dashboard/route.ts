import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const studentId = url.searchParams.get("studentId")

  if (!studentId) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
  }

  try {
    // Get comprehensive dashboard data using our database function
    const { data, error } = await supabase.rpc("get_student_dashboard", {
      p_student_id: Number.parseInt(studentId),
    })

    if (error) {
      console.error("Error fetching student dashboard:", error)
      return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }

    return NextResponse.json({ dashboard: data })
  } catch (error) {
    console.error("Error in student dashboard API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
