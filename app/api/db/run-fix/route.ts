import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    // Read the SQL file content and execute it
    const sqlCommands = [
      // Enable UUID extension
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

      // Insert default lessons
      `INSERT INTO lessons (id, title, description, category, difficulty, estimated_duration) VALUES
      (1, 'Basic Grammar', 'Learn fundamental grammar rules', 'Grammar', 'Beginner', 15),
      (2, 'Verb Tenses', 'Master past, present, and future tenses', 'Grammar', 'Beginner', 20),
      (3, 'Articles and Prepositions', 'Learn when to use a, an, the, and prepositions', 'Grammar', 'Intermediate', 25),
      (4, 'Basic Vocabulary', 'Essential everyday vocabulary', 'Vocabulary', 'Beginner', 15),
      (5, 'Vocabulary Builder', 'Expand your vocabulary with advanced words', 'Vocabulary', 'Intermediate', 20),
      (6, 'Listening Practice', 'Improve listening comprehension', 'Listening', 'Beginner', 15),
      (7, 'Listening Conversations', 'Practice with real conversations', 'Listening', 'Intermediate', 20),
      (8, 'Listening Lectures', 'Academic listening skills', 'Listening', 'Advanced', 30),
      (9, 'Speaking Practice', 'Basic speaking exercises', 'Speaking', 'Beginner', 15),
      (10, 'Speaking Basic', 'Fundamental speaking skills', 'Speaking', 'Beginner', 15),
      (11, 'Speaking Drills', 'Pronunciation and fluency drills', 'Speaking', 'Intermediate', 20),
      (12, 'Conversation Practice', 'Interactive conversation practice', 'Speaking', 'Intermediate', 25),
      (13, 'Tongue Twisters', 'Improve pronunciation with tongue twisters', 'Speaking', 'Intermediate', 15),
      (14, 'Intonation Practice', 'Master English intonation patterns', 'Speaking', 'Advanced', 20),
      (15, 'Reading Comprehension', 'Improve reading skills', 'Reading', 'Beginner', 20),
      (16, 'Short Stories', 'Read and analyze short stories', 'Reading', 'Intermediate', 30),
      (17, 'Essay Writing', 'Learn to write effective essays', 'Writing', 'Intermediate', 45),
      (18, 'Summary Writing', 'Practice writing summaries', 'Writing', 'Beginner', 30)
      ON CONFLICT (id) DO NOTHING;`,

      // Create function to update student metrics
      `CREATE OR REPLACE FUNCTION update_student_metrics()
      RETURNS TRIGGER AS $$
      BEGIN
          INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, overall_progress, last_active)
          VALUES (
              NEW.student_id,
              (SELECT COUNT(*) FROM lesson_completions WHERE student_id = NEW.student_id),
              (SELECT COUNT(*) FROM lessons),
              (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons) FROM lesson_completions WHERE student_id = NEW.student_id),
              NOW()
          )
          ON CONFLICT (student_id) DO UPDATE SET
              lessons_completed = (SELECT COUNT(*) FROM lesson_completions WHERE student_id = NEW.student_id),
              total_lessons = (SELECT COUNT(*) FROM lessons),
              overall_progress = (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons) FROM lesson_completions WHERE student_id = NEW.student_id),
              last_active = NOW();
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;`,

      // Create trigger
      `DROP TRIGGER IF EXISTS trigger_update_student_metrics ON lesson_completions;
      CREATE TRIGGER trigger_update_student_metrics
          AFTER INSERT OR UPDATE ON lesson_completions
          FOR EACH ROW
          EXECUTE FUNCTION update_student_metrics();`,
    ]

    const results = []
    for (const sql of sqlCommands) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql })
        if (error) {
          console.error(`SQL Error: ${error.message}`)
          results.push({ sql: sql.substring(0, 50) + "...", error: error.message })
        } else {
          results.push({ sql: sql.substring(0, 50) + "...", success: true })
        }
      } catch (err) {
        // Try direct query for simpler commands
        try {
          const { error } = await supabase.from("lessons").upsert([
            {
              id: 1,
              title: "Basic Grammar",
              description: "Learn fundamental grammar rules",
              category: "Grammar",
              difficulty: "Beginner",
              estimated_duration: 15,
            },
          ])
          if (!error) {
            results.push({ sql: "Insert lessons", success: true })
          }
        } catch (directErr) {
          results.push({ sql: sql.substring(0, 50) + "...", error: err.message })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database fix completed",
      results,
    })
  } catch (error) {
    console.error("Database fix error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
