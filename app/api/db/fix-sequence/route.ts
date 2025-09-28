import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Fixing lessons sequence...")

    // Fix the lessons sequence
    const { data: sequenceData, error: sequenceError } = await supabase.rpc("fix_lessons_sequence")

    if (sequenceError) {
      console.error("Error fixing sequence with RPC:", sequenceError)

      // Try alternative approach with direct SQL
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("lessons")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)

      if (maxIdError) {
        console.error("Error getting max ID:", maxIdError)
        return NextResponse.json(
          {
            error: "Failed to get max ID",
            details: maxIdError.message,
          },
          { status: 500 },
        )
      }

      const maxId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id : 0
      const nextId = maxId + 1

      console.log(`Max ID found: ${maxId}, setting sequence to: ${nextId}`)

      // Try to reset sequence manually
      const { error: resetError } = await supabase.rpc("reset_lessons_sequence", { next_val: nextId })

      if (resetError) {
        console.error("Error resetting sequence:", resetError)
        return NextResponse.json(
          {
            error: "Failed to reset sequence",
            details: resetError.message,
          },
          { status: 500 },
        )
      }
    }

    // Test by creating a dummy lesson and then deleting it
    const testLesson = {
      title: "Test Lesson - DELETE ME",
      description: "This is a test lesson to verify sequence works",
      category: "grammar",
      difficulty: "beginner",
      created_by: 1,
      is_published: false,
    }

    const { data: testData, error: testError } = await supabase.from("lessons").insert(testLesson).select()

    if (testError) {
      console.error("Test lesson creation failed:", testError)
      return NextResponse.json(
        {
          error: "Sequence fix failed - test lesson creation error",
          details: testError.message,
        },
        { status: 500 },
      )
    }

    // Delete the test lesson
    if (testData && testData.length > 0) {
      await supabase.from("lessons").delete().eq("id", testData[0].id)
    }

    return NextResponse.json({
      success: true,
      message: "Lessons sequence fixed successfully",
      testId: testData?.[0]?.id,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
