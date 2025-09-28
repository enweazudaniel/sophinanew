import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Starting simple seed...")

    // Create a teacher directly with raw SQL if needed
    const teacherData = {
      username: "teacher1",
      password: "password123",
      full_name: "Ms. Sarah Johnson",
      email: "teacher1@school.com",
      role: "teacher",
    }

    // Try to insert teacher
    const { data: teacher, error: teacherError } = await supabase
      .from("users")
      .upsert(teacherData, { onConflict: "username" })
      .select()
      .single()

    if (teacherError) {
      console.error("Teacher creation failed:", teacherError)
      return NextResponse.json(
        {
          error: "Failed to create teacher",
          details: teacherError.message,
        },
        { status: 500 },
      )
    }

    console.log("Teacher created/found:", teacher)

    // Create students
    const studentsData = [
      {
        username: "student1",
        password: "password123",
        full_name: "Alice Johnson",
        email: "alice@school.com",
        role: "student",
      },
      {
        username: "student2",
        password: "password123",
        full_name: "Bob Smith",
        email: "bob@school.com",
        role: "student",
      },
      {
        username: "student3",
        password: "password123",
        full_name: "Carol Davis",
        email: "carol@school.com",
        role: "student",
      },
    ]

    const { data: students, error: studentsError } = await supabase
      .from("users")
      .upsert(studentsData, { onConflict: "username" })
      .select()

    if (studentsError) {
      console.error("Students creation failed:", studentsError)
    }

    console.log("Students created/found:", students?.length || 0)

    // Create simple assignments
    const assignmentsData = [
      {
        title: "Basic Grammar Test",
        description: "Complete the basic grammar exercises",
        assignment_type: "grammar",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: teacher.id,
        status: "active",
      },
      {
        title: "Vocabulary Quiz",
        description: "Learn 10 new vocabulary words",
        assignment_type: "vocabulary",
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: teacher.id,
        status: "active",
      },
    ]

    const { data: assignments, error: assignmentsError } = await supabase
      .from("assignments")
      .insert(assignmentsData)
      .select()

    if (assignmentsError) {
      console.error("Assignments creation failed:", assignmentsError)
      return NextResponse.json(
        {
          error: "Failed to create assignments",
          details: assignmentsError.message,
        },
        { status: 500 },
      )
    }

    console.log("Assignments created:", assignments?.length || 0)

    return NextResponse.json({
      success: true,
      message: "Simple seed completed successfully",
      data: {
        teacher: teacher.username,
        students: students?.length || 0,
        assignments: assignments?.length || 0,
      },
    })
  } catch (error) {
    console.error("Simple seed error:", error)
    return NextResponse.json(
      {
        error: "Simple seed failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
