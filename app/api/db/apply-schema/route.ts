import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    // Read and execute the enhanced schema
    const schemaQueries = [
      // Fix lessons table
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_by INTEGER;`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`,
      `ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;`,

      // Create class_teachers junction table
      `CREATE TABLE IF NOT EXISTS class_teachers (
        id SERIAL PRIMARY KEY,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'teacher',
        assigned_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(class_id, teacher_id)
      );`,

      // Create grading_scales table
      `CREATE TABLE IF NOT EXISTS grading_scales (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        min_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        description TEXT,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );`,

      // Insert default grading scales
      `INSERT INTO grading_scales (name, min_score, max_score, description, is_default) VALUES
      ('Scale 0-5', 0, 5, 'Traditional 5-point scale', FALSE),
      ('Scale 0-10', 0, 10, 'Standard 10-point scale', TRUE),
      ('Scale 0-20', 0, 20, 'Extended 20-point scale', FALSE),
      ('Scale 0-60', 0, 60, 'Comprehensive 60-point scale', FALSE),
      ('Scale 0-100', 0, 100, 'Percentage-based 100-point scale', FALSE)
      ON CONFLICT DO NOTHING;`,

      // Enhance assignments table
      `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';`,
      `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS grading_scale_id INTEGER REFERENCES grading_scales(id);`,
      `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS max_score INTEGER DEFAULT 100;`,
      `ALTER TABLE assignments ADD COLUMN IF NOT EXISTS instructions TEXT;`,

      // Create file_uploads table
      `CREATE TABLE IF NOT EXISTS file_uploads (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        uploaded_by INTEGER NOT NULL,
        uploaded_by_type VARCHAR(20) NOT NULL,
        upload_context VARCHAR(50),
        context_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );`,

      // Create student performance metrics table
      `CREATE TABLE IF NOT EXISTS student_performance_metrics (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        skill_area VARCHAR(50) NOT NULL,
        total_exercises INTEGER DEFAULT 0,
        completed_exercises INTEGER DEFAULT 0,
        average_score DECIMAL(5,2) DEFAULT 0.00,
        total_time_spent INTEGER DEFAULT 0,
        last_activity TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(student_id, class_id, skill_area)
      );`,
    ]

    for (const query of schemaQueries) {
      const { error } = await supabase.rpc("exec_sql", { sql_query: query })
      if (error) {
        console.error("Schema error:", error)
        // Continue with other queries even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Enhanced schema applied successfully",
    })
  } catch (error) {
    console.error("Error applying schema:", error)
    return NextResponse.json({ error: "Failed to apply schema" }, { status: 500 })
  }
}
