import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating assignment:", body)

    const { title, description, assignment_type, due_date, created_by } = body

    // Validate required fields
    if (!title || !description || !created_by) {
      return NextResponse.json({ error: "Missing required fields: title, description, or created_by" }, { status: 400 })
    }

    // Create assignment
    const { data: assignment, error } = await supabase
      .from("assignments")
      .insert({
        title: title.trim(),
        description: description.trim(),
        assignment_type: assignment_type || "text",
        due_date: due_date || null,
        created_by: Number.parseInt(created_by),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Assignment creation error:", error)
      return NextResponse.json({ error: "Failed to create assignment: " + error.message }, { status: 500 })
    }

    console.log("Assignment created successfully:", assignment)

    return NextResponse.json({
      success: true,
      assignment,
      message: "Assignment created successfully",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
