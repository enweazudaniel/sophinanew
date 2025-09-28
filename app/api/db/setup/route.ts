import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    // Create students table
    const studentsTable = `
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create teachers table
    const teachersTable = `
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create lessons table
    const lessonsTable = `
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(50),
        difficulty_level INTEGER DEFAULT 1,
        content JSONB,
        media_url TEXT,
        created_by INTEGER REFERENCES teachers(id),
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Execute table creation
    await supabaseAdmin.rpc("exec_sql", { sql: studentsTable })
    await supabaseAdmin.rpc("exec_sql", { sql: teachersTable })
    await supabaseAdmin.rpc("exec_sql", { sql: lessonsTable })

    // Insert sample data
    const sampleStudent = {
      username: "student1",
      password: "password123",
      full_name: "John Doe",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
    }

    const sampleTeacher = {
      username: "teacher1",
      password: "password123",
      full_name: "Jane Smith",
      email: "jane.smith@school.edu",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
    }

    await supabaseAdmin.from("students").upsert([sampleStudent])
    await supabaseAdmin.from("teachers").upsert([sampleTeacher])

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ error: "Failed to setup database", details: error }, { status: 500 })
  }
}
