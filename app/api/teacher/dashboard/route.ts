import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const teacherId = url.searchParams.get("teacherId")

  if (!teacherId) {
    return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
  }

  try {
    // Get comprehensive dashboard data using our database function
    const { data, error } = await supabase.rpc("get_teacher_dashboard", {
      p_teacher_id: Number.parseInt(teacherId),
    })

    if (error) {
      console.error("Error fetching teacher dashboard:", error)
      return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }

    return NextResponse.json({ dashboard: data })
  } catch (error) {
    console.error("Error in teacher dashboard API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
