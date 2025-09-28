import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Applying all database fixes...")

    const fixes = [
      // Fix notifications table
      `ALTER TABLE notifications ALTER COLUMN user_type DROP NOT NULL;`,
      `ALTER TABLE notifications ALTER COLUMN user_type SET DEFAULT 'student';`,
      `UPDATE notifications SET user_type = 'student' WHERE user_type IS NULL;`,

      // Fix lessons table
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_by INTEGER;`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;`,

      // Ensure assignment_classes table exists
      `CREATE TABLE IF NOT EXISTS assignment_classes (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(assignment_id, class_id)
      );`,

      // Add missing columns
      `ALTER TABLE student_metrics ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;`,

      // Create indexes
      `CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(user_type);`,
      `CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);`,
      `CREATE INDEX IF NOT EXISTS idx_lesson_completions_student_id ON lesson_completions(student_id);`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);`,
      `CREATE INDEX IF NOT EXISTS idx_assignment_classes_class_id ON assignment_classes(class_id);`,
    ]

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const sql of fixes) {
      try {
        const { error } = await supabase.rpc("execute_sql", { sql })
        if (error) {
          console.error(`SQL Error: ${error.message}`)
          errors.push(`${sql.substring(0, 50)}...: ${error.message}`)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.error(`Execution Error:`, err)
        errors.push(`${sql.substring(0, 50)}...: ${err}`)
        errorCount++
      }
    }

    // Insert sample data
    try {
      const { error: classError } = await supabase.from("classes").upsert(
        [
          { id: 1, name: "English Beginners", description: "Basic English learning class" },
          { id: 2, name: "English Intermediate", description: "Intermediate English learning class" },
        ],
        { onConflict: "id" },
      )

      if (classError) {
        console.error("Class insert error:", classError)
      }

      const { error: lessonError } = await supabase.from("lessons").upsert(
        [
          {
            id: 1,
            title: "Basic Grammar",
            description: "Introduction to English grammar",
            category: "grammar",
            difficulty: "beginner",
            content: "Learn the basics of English grammar",
            is_published: true,
          },
          {
            id: 2,
            title: "Vocabulary Building",
            description: "Essential English vocabulary",
            category: "vocabulary",
            difficulty: "beginner",
            content: "Build your English vocabulary",
            is_published: true,
          },
          {
            id: 3,
            title: "Reading Comprehension",
            description: "Improve your reading skills",
            category: "reading",
            difficulty: "intermediate",
            content: "Practice reading and understanding",
            is_published: true,
          },
        ],
        { onConflict: "id" },
      )

      if (lessonError) {
        console.error("Lesson insert error:", lessonError)
      }
    } catch (err) {
      console.error("Sample data error:", err)
    }

    return NextResponse.json({
      success: true,
      message: `Database fixes applied successfully. ${successCount} successful, ${errorCount} errors.`,
      successCount,
      errorCount,
      errors: errors.slice(0, 5), // Limit error details
    })
  } catch (error) {
    console.error("Error applying fixes:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
