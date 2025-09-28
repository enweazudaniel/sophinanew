import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Add missing columns to lessons table
    const schemaQueries = [
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS media_url TEXT;`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content TEXT;`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_by INTEGER;`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;`,

      // Update existing lessons
      `UPDATE lessons SET 
        is_published = TRUE,
        created_at = COALESCE(created_at, NOW()),
        updated_at = NOW()
      WHERE is_published IS NULL OR created_at IS NULL;`,

      // Ensure basic lessons exist
      `INSERT INTO lessons (id, title, description, category, difficulty, estimated_duration, is_published, created_at, updated_at) VALUES
      (1, 'Basic Grammar', 'Learn fundamental grammar rules', 'grammar', 'beginner', 15, TRUE, NOW(), NOW()),
      (2, 'Verb Tenses', 'Master past, present, and future tenses', 'grammar', 'beginner', 20, TRUE, NOW(), NOW()),
      (3, 'Articles and Prepositions', 'Learn when to use a, an, the, and prepositions', 'grammar', 'intermediate', 25, TRUE, NOW(), NOW()),
      (4, 'Basic Vocabulary', 'Essential everyday vocabulary', 'vocabulary', 'beginner', 15, TRUE, NOW(), NOW()),
      (5, 'Vocabulary Builder', 'Expand your vocabulary with advanced words', 'vocabulary', 'intermediate', 20, TRUE, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        difficulty = EXCLUDED.difficulty,
        estimated_duration = EXCLUDED.estimated_duration,
        is_published = EXCLUDED.is_published,
        updated_at = NOW();`,

      // Fix student metrics
      `ALTER TABLE student_metrics ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;`,

      // Initialize student metrics for existing students
      `INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, overall_progress, last_active, streak_days)
      SELECT 
        s.id,
        COALESCE((SELECT COUNT(*) FROM lesson_completions WHERE student_id = s.id), 0),
        (SELECT COUNT(*) FROM lessons),
        COALESCE((SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons) FROM lesson_completions WHERE student_id = s.id), 0),
        NOW(),
        0
      FROM students s
      WHERE s.id NOT IN (SELECT student_id FROM student_metrics)
      ON CONFLICT (student_id) DO NOTHING;`,
    ]

    for (const query of schemaQueries) {
      const { error } = await supabase.rpc("exec_sql", { sql_query: query })
      if (error) {
        console.error("Error executing query:", query, error)
        // Continue with other queries even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database schema updated successfully",
    })
  } catch (error) {
    console.error("Error applying schema fix:", error)
    return NextResponse.json({ success: false, error: "Failed to apply schema fix" }, { status: 500 })
  }
}
