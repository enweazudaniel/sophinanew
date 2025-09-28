import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Starting lesson_completions schema fix...")

    // Check if answers column exists
    const { data: answersExists, error: answersCheckError } = await supabase.rpc("column_exists", {
      table_name: "lesson_completions",
      column_name: "answers",
    })

    if (answersCheckError) {
      console.error("Error checking if answers column exists:", answersCheckError)

      // Create the function if it doesn't exist
      await supabase.query(`
        CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text)
        RETURNS boolean AS $$
        DECLARE
          exists boolean;
        BEGIN
          SELECT COUNT(*) > 0 INTO exists
          FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2;
          RETURN exists;
        END;
        $$ LANGUAGE plpgsql;
      `)

      // Try again
      const { data: retryAnswersExists } = await supabase.rpc("column_exists", {
        table_name: "lesson_completions",
        column_name: "answers",
      })

      if (!retryAnswersExists) {
        console.log("Adding answers column to lesson_completions table...")
        await supabase.query(`
          ALTER TABLE lesson_completions 
          ADD COLUMN IF NOT EXISTS answers JSONB;
        `)
      }
    } else if (!answersExists) {
      console.log("Adding answers column to lesson_completions table...")
      await supabase.query(`
        ALTER TABLE lesson_completions 
        ADD COLUMN IF NOT EXISTS answers JSONB;
      `)
    } else {
      console.log("answers column already exists")
    }

    // Check if last_attempt_at column exists
    const { data: lastAttemptExists, error: lastAttemptCheckError } = await supabase.rpc("column_exists", {
      table_name: "lesson_completions",
      column_name: "last_attempt_at",
    })

    if (lastAttemptCheckError && !lastAttemptCheckError.message.includes("function column_exists")) {
      console.error("Error checking if last_attempt_at column exists:", lastAttemptCheckError)
    } else if (!lastAttemptExists) {
      console.log("Adding last_attempt_at column to lesson_completions table...")
      await supabase.query(`
        ALTER TABLE lesson_completions 
        ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMP WITH TIME ZONE;
      `)
    } else {
      console.log("last_attempt_at column already exists")
    }

    // Check for duplicate records
    console.log("Checking for duplicate records...")
    const { data: duplicates, error: duplicatesError } = await supabase.query(`
      SELECT student_id, lesson_id, COUNT(*) 
      FROM lesson_completions 
      GROUP BY student_id, lesson_id 
      HAVING COUNT(*) > 1
    `)

    if (duplicatesError) {
      console.error("Error checking for duplicates:", duplicatesError)
    } else if (duplicates && duplicates.length > 0) {
      console.log(`Found ${duplicates.length} sets of duplicate records. Fixing...`)

      // Keep only the highest score for each student-lesson pair
      await supabase.query(`
        DELETE FROM lesson_completions
        WHERE id IN (
          SELECT id FROM (
            SELECT id, 
                   ROW_NUMBER() OVER (PARTITION BY student_id, lesson_id ORDER BY score DESC, completed_at DESC) as rn
            FROM lesson_completions
          ) t
          WHERE t.rn > 1
        )
      `)

      console.log("Duplicate records removed")
    } else {
      console.log("No duplicate records found")
    }

    return NextResponse.json({
      success: true,
      message: "Lesson completions schema and data fixed successfully",
    })
  } catch (error) {
    console.error("Error fixing lesson_completions schema:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
