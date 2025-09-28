import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const studentId = url.searchParams.get("studentId")

    console.log("Fetching assignments for student:", studentId)

    // Get all assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from("assignments")
      .select("*")
      .order("created_at", { ascending: false })

    if (assignmentsError) {
      console.error("Error fetching assignments:", assignmentsError)
      return NextResponse.json({ error: "Failed to fetch assignments: " + assignmentsError.message }, { status: 500 })
    }

    // If studentId is provided, get their submissions
    let submissions = []
    if (studentId) {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select("*")
        .eq("student_id", studentId)

      if (submissionsError) {
        console.error("Error fetching submissions:", submissionsError)
      } else {
        submissions = submissionsData || []
      }
    }

    // Combine assignments with submission status
    const assignmentsWithSubmissions = assignments.map((assignment) => {
      const submission = submissions.find((sub) => sub.assignment_id === assignment.id)
      return {
        ...assignment,
        submission: submission || null,
      }
    })

    return NextResponse.json({
      success: true,
      assignments: assignmentsWithSubmissions,
    })
  } catch (error) {
    console.error("Error in assignments API:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
