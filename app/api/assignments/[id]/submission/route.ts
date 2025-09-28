import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const assignmentId = params.id
    const url = new URL(request.url)
    const studentId = url.searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    console.log("Fetching submission for assignment:", assignmentId, "student:", studentId)

    const { data: submission, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .eq("student_id", studentId)
      .maybeSingle()

    if (error) {
      console.error("Error fetching submission:", error)
      return NextResponse.json({ error: "Failed to fetch submission: " + error.message }, { status: 500 })
    }

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error in submission API:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
