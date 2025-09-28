import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Submitting assignment:", body)

    const { assignmentId, studentId, content } = body

    // Validate required fields
    if (!assignmentId || !studentId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: assignmentId, studentId, or content" },
        { status: 400 },
      )
    }

    // Check if assignment exists
    const { data: assignment, error: assignmentError } = await supabase
      .from("assignments")
      .select("*")
      .eq("id", assignmentId)
      .single()

    if (assignmentError) {
      console.error("Assignment not found:", assignmentError)
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Check if submission already exists
    const { data: existingSubmission } = await supabase
      .from("submissions")
      .select("id, status")
      .eq("assignment_id", assignmentId)
      .eq("student_id", studentId)
      .maybeSingle()

    const submissionData = {
      assignment_id: Number.parseInt(assignmentId),
      student_id: Number.parseInt(studentId),
      content: content.trim(),
      status: "submitted",
      submitted_at: new Date().toISOString(),
    }

    let submission
    if (existingSubmission) {
      // Update existing submission
      const { data, error } = await supabase
        .from("submissions")
        .update({
          ...submissionData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubmission.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating submission:", error)
        return NextResponse.json({ error: "Failed to update submission: " + error.message }, { status: 500 })
      }
      submission = data
    } else {
      // Create new submission
      const { data, error } = await supabase.from("submissions").insert(submissionData).select().single()

      if (error) {
        console.error("Error creating submission:", error)
        return NextResponse.json({ error: "Failed to create submission: " + error.message }, { status: 500 })
      }
      submission = data
    }

    console.log("Submission successful:", submission)

    return NextResponse.json({
      success: true,
      submission,
      message: existingSubmission ? "Assignment updated successfully" : "Assignment submitted successfully",
    })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
