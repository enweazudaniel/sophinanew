import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Verifying lessons table...")

    // Get all lessons
    const { data: lessons, error: lessonsError } = await supabase.from("lessons").select("*").order("id")

    if (lessonsError) {
      console.error("Error fetching lessons:", lessonsError)
      return NextResponse.json({ success: false, error: lessonsError.message }, { status: 500 })
    }

    console.log(`Found ${lessons?.length || 0} lessons`)

    // Check if we have lessons in the database
    if (!lessons || lessons.length === 0) {
      console.log("No lessons found. Creating sample lessons...")

      // Create sample lessons if none exist
      const sampleLessons = [
        {
          id: 1,
          title: "Basic Grammar",
          category: "grammar",
          difficulty: "Beginner",
          estimated_duration: 15,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Intermediate Grammar",
          category: "grammar",
          difficulty: "Intermediate",
          estimated_duration: 20,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Advanced Grammar",
          category: "grammar",
          difficulty: "Advanced",
          estimated_duration: 30,
          created_at: new Date().toISOString(),
        },
        {
          id: 4,
          title: "Basic Vocabulary",
          category: "vocabulary",
          difficulty: "Beginner",
          estimated_duration: 15,
          created_at: new Date().toISOString(),
        },
        {
          id: 5,
          title: "Intermediate Vocabulary",
          category: "vocabulary",
          difficulty: "Intermediate",
          estimated_duration: 20,
          created_at: new Date().toISOString(),
        },
      ]

      const { error: insertError } = await supabase.from("lessons").insert(sampleLessons)

      if (insertError) {
        console.error("Error creating sample lessons:", insertError)
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
      }

      console.log("Sample lessons created successfully")
    } else {
      // Check for ID sequence issues
      let hasSequenceIssue = false
      for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].id !== i + 1) {
          hasSequenceIssue = true
          break
        }
      }

      if (hasSequenceIssue) {
        console.log("Found ID sequence issue in lessons table. Fixing...")

        // Get the highest ID
        const maxId = Math.max(...lessons.map((l) => l.id))

        // Reset the sequence
        await supabase.query(`
          ALTER SEQUENCE lessons_id_seq RESTART WITH ${maxId + 1};
        `)

        console.log(`Reset lessons_id_seq to ${maxId + 1}`)
      } else {
        console.log("Lesson IDs are in proper sequence")
      }
    }

    // Check for lesson completion records
    const { data: completions, error: completionsError } = await supabase.from("lesson_completions").select("*")

    if (completionsError) {
      console.error("Error fetching lesson completions:", completionsError)
      return NextResponse.json({ success: false, error: completionsError.message }, { status: 500 })
    }

    console.log(`Found ${completions?.length || 0} lesson completion records`)

    return NextResponse.json({
      success: true,
      message: "Lessons verification complete",
      lessonCount: lessons?.length || 0,
      completionCount: completions?.length || 0,
    })
  } catch (error) {
    console.error("Error verifying lessons:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
