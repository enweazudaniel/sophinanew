import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Read the migration SQL file
    const migrationSql = `
    -- Check if lesson_completions table exists, if not create it
    CREATE TABLE IF NOT EXISTS lesson_completions (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
      attempts INTEGER DEFAULT 1,
      last_attempt_at TIMESTAMP WITH TIME ZONE,
      UNIQUE(student_id, lesson_id)
    );
    
    -- Check if student_metrics table exists, if not create it
    CREATE TABLE IF NOT EXISTS student_metrics (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL UNIQUE,
      overall_progress FLOAT DEFAULT 0,
      lessons_completed INTEGER DEFAULT 0,
      total_lessons INTEGER DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      last_active TIMESTAMP WITH TIME ZONE
    );
    
    -- Check if lessons table exists, if not create it
    CREATE TABLE IF NOT EXISTS lessons (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL,
      difficulty VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_lesson_completions_student_id ON lesson_completions(student_id);
    CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_student_metrics_student_id ON student_metrics(student_id);
    CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
    
    -- Function to update student metrics when lesson completions change
    CREATE OR REPLACE FUNCTION update_student_metrics()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Count unique completed lessons for this student
      WITH unique_lessons AS (
        SELECT DISTINCT lesson_id
        FROM lesson_completions
        WHERE student_id = NEW.student_id
      )
      UPDATE student_metrics
      SET 
        lessons_completed = (SELECT COUNT(*) FROM unique_lessons),
        last_active = NOW()
      WHERE student_id = NEW.student_id;
      
      -- If no metrics record exists, create one
      IF NOT FOUND THEN
        INSERT INTO student_metrics (
          student_id, 
          lessons_completed, 
          total_lessons,
          overall_progress,
          time_spent,
          last_active
        )
        VALUES (
          NEW.student_id,
          1,
          (SELECT COUNT(*) FROM lessons),
          (1.0 / (SELECT COUNT(*) FROM lessons)) * 100,
          0,
          NOW()
        );
      ELSE
        -- Update overall progress
        UPDATE student_metrics
        SET overall_progress = (
          CASE 
            WHEN total_lessons > 0 THEN 
              (lessons_completed::float / total_lessons) * 100
            ELSE 0
          END
        )
        WHERE student_id = NEW.student_id;
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Create trigger for lesson completions
    DROP TRIGGER IF EXISTS trigger_update_student_metrics ON lesson_completions;
    CREATE TRIGGER trigger_update_student_metrics
    AFTER INSERT OR UPDATE ON lesson_completions
    FOR EACH ROW
    EXECUTE FUNCTION update_student_metrics();
    
    -- Function to update total_lessons in student_metrics when lessons are added/removed
    CREATE OR REPLACE FUNCTION update_total_lessons()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update total_lessons for all student metrics
      UPDATE student_metrics
      SET 
        total_lessons = (SELECT COUNT(*) FROM lessons),
        overall_progress = CASE 
          WHEN (SELECT COUNT(*) FROM lessons) > 0 THEN 
            (lessons_completed::float / (SELECT COUNT(*) FROM lessons)) * 100
          ELSE 0
        END;
      
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Create trigger for lessons table
    DROP TRIGGER IF EXISTS trigger_update_total_lessons ON lessons;
    CREATE TRIGGER trigger_update_total_lessons
    AFTER INSERT OR DELETE ON lessons
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_total_lessons();
    
    -- Insert sample lessons if they don't exist
    DO $$
    BEGIN
      -- Only insert if the lessons table is empty
      IF NOT EXISTS (SELECT 1 FROM lessons LIMIT 1) THEN
        -- Grammar lessons
        INSERT INTO lessons (id, title, category, difficulty, description) VALUES
        (1, 'Basic Grammar', 'grammar', 'beginner', 'Learn the fundamentals of English grammar'),
        (2, 'Verb Tenses', 'grammar', 'intermediate', 'Master the different verb tenses in English'),
        (3, 'Articles & Prepositions', 'grammar', 'intermediate', 'Learn how to use articles and prepositions correctly');
        
        -- Vocabulary lessons
        INSERT INTO lessons (id, title, category, difficulty, description) VALUES
        (4, 'Basic Vocabulary', 'vocabulary', 'beginner', 'Build your essential English vocabulary'),
        (5, 'Word Builder', 'vocabulary', 'intermediate', 'Learn to form new words with prefixes and suffixes');
        
        -- Reading lessons
        INSERT INTO lessons (id, title, category, difficulty, description) VALUES
        (6, 'Comprehension', 'reading', 'intermediate', 'Improve your reading comprehension skills'),
        (7, 'Short Stories', 'reading', 'intermediate', 'Practice reading with engaging short stories');
        
        -- Listening lessons
        INSERT INTO lessons (id, title, category, difficulty, description) VALUES
        (8, 'Conversations', 'listening', 'beginner', 'Listen to and understand everyday conversations'),
        (9, 'Lectures', 'listening', 'advanced', 'Practice listening to academic lectures'),
        (10, 'Listening Practice', 'listening', 'intermediate', 'Various listening exercises to improve your skills');
        
        -- Speaking lessons
        INSERT INTO lessons (id, title, category, difficulty, description) VALUES
        (11, 'Basic Speaking', 'speaking', 'beginner', 'Learn to speak English with confidence'),
        (12, 'Practice', 'speaking', 'intermediate', 'Practice speaking with various exercises'),
        (13, 'Tongue Twisters', 'speaking', 'intermediate', 'Improve pronunciation with tongue twisters'),
        (14, 'Conversation', 'speaking', 'intermediate', 'Practice conversation skills'),
        (15, 'Intonation', 'speaking', 'advanced', 'Master the rhythm and intonation of English'),
        (16, 'Pronunciation Drills', 'speaking', 'intermediate', 'Targeted exercises to improve pronunciation');
      END IF;
    END $$;
    `

    // Execute the migration SQL
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSql })

    if (error) {
      console.error("Migration error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Recalculate metrics for all students
    const { data: students, error: studentsError } = await supabase.from("users").select("id").eq("role", "student")

    if (studentsError) {
      console.error("Error fetching students:", studentsError)
      return NextResponse.json({
        success: true,
        message: "Migration completed but failed to recalculate student metrics",
        error: studentsError.message,
      })
    }

    // For each student, update their metrics
    for (const student of students || []) {
      // Count unique completed lessons
      const { data: completions, error: completionsError } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("student_id", student.id)

      if (completionsError) {
        console.error(`Error fetching completions for student ${student.id}:`, completionsError)
        continue
      }

      // Get unique lesson IDs
      const uniqueLessonIds = new Set(completions?.map((c) => c.lesson_id) || [])
      const completedLessons = uniqueLessonIds.size

      // Get total lessons
      const { count: totalLessons, error: countError } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })

      if (countError) {
        console.error(`Error counting lessons for student ${student.id}:`, countError)
        continue
      }

      // Calculate progress
      const overallProgress = totalLessons ? (completedLessons / totalLessons) * 100 : 0

      // Update or create metrics
      const { data: existingMetrics, error: metricsError } = await supabase
        .from("student_metrics")
        .select("*")
        .eq("student_id", student.id)
        .single()

      if (metricsError && metricsError.code !== "PGRST116") {
        console.error(`Error fetching metrics for student ${student.id}:`, metricsError)
        continue
      }

      if (existingMetrics) {
        // Update existing metrics
        const { error: updateError } = await supabase
          .from("student_metrics")
          .update({
            lessons_completed: completedLessons,
            total_lessons: totalLessons,
            overall_progress: overallProgress,
            last_active: new Date().toISOString(),
          })
          .eq("student_id", student.id)

        if (updateError) {
          console.error(`Error updating metrics for student ${student.id}:`, updateError)
        }
      } else {
        // Create new metrics
        const { error: insertError } = await supabase.from("student_metrics").insert({
          student_id: student.id,
          lessons_completed: completedLessons,
          total_lessons: totalLessons,
          overall_progress: overallProgress,
          time_spent: 0,
          last_active: new Date().toISOString(),
        })

        if (insertError) {
          console.error(`Error inserting metrics for student ${student.id}:`, insertError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully and student metrics recalculated",
    })
  } catch (error) {
    console.error("Migration failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
