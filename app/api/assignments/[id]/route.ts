import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const assignmentId = params.id
    console.log("Fetching assignment:", assignmentId)

    const { data: assignment, error } = await supabase.from("assignments").select("*").eq("id", assignmentId).single()

    if (error) {
      console.error("Assignment not found:", error)
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("Error fetching assignment:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
