import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    // Read the linking script
    const scriptPath = path.join(process.cwd(), "database", "link-students-teachers-classes.sql")
    const scriptSQL = fs.readFileSync(scriptPath, "utf8")

    // Split the script into individual statements
    const statements = scriptSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--") && !stmt.toLowerCase().includes("commit"))

    const results = []
    let successCount = 0
    let errorCount = 0

    // Execute each statement
    for (const statement of statements) {
      try {
        // Skip SELECT statements that are just for display
        if (
          statement.toLowerCase().trim().startsWith("select ") &&
          (statement.includes("info") || statement.includes("Summary"))
        ) {
          continue
        }

        const { data, error } = await supabase.rpc("exec_sql", {
          sql_query: statement,
        })

        if (error) {
          console.error(`Error executing statement: ${statement.substring(0, 100)}...`, error)
          results.push({
            statement: statement.substring(0, 100) + "...",
            success: false,
            error: error.message,
          })
          errorCount++
        } else {
          results.push({
            statement: statement.substring(0, 100) + "...",
            success: true,
            data,
          })
          successCount++
        }
      } catch (err) {
        console.error(`Exception executing statement: ${statement.substring(0, 100)}...`, err)
        results.push({
          statement: statement.substring(0, 100) + "...",
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        })
        errorCount++
      }
    }

    // Verify the linking was successful
    const verificationQueries = [
      "SELECT COUNT(*) as class_count FROM classes",
      "SELECT COUNT(*) as student_assignments FROM class_students",
      "SELECT COUNT(*) as active_assignments FROM class_students WHERE is_active = true",
    ]

    const verificationResults = []
    for (const query of verificationQueries) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })
        if (!error && data && data.length > 0) {
          verificationResults.push({ query, result: data[0] })
        }
      } catch (err) {
        // Ignore verification errors
      }
    }

    return NextResponse.json({
      success: true,
      message: `Class linking completed. ${successCount} statements succeeded, ${errorCount} failed.`,
      summary: {
        totalStatements: statements.length,
        successCount,
        errorCount,
      },
      results: results.slice(-10), // Return last 10 results
      verification: verificationResults,
    })
  } catch (error) {
    console.error("Error linking classes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to link classes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Get class assignments
export async function GET(request: Request) {
  const url = new URL(request.url)
  const type = url.searchParams.get("type") // 'student' or 'teacher'
  const id = url.searchParams.get("id")

  try {
    let query = ""

    if (type === "student" && id) {
      query = `SELECT * FROM get_classes_for_student(${id})`
    } else if (type === "teacher" && id) {
      query = `SELECT * FROM get_classes_for_teacher(${id})`
    } else if (type === "class" && id) {
      query = `SELECT * FROM get_students_in_class(${id})`
    } else {
      // Return all assignments
      query = "SELECT * FROM student_class_assignments LIMIT 50"
    }

    const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching class assignments:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch class assignments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
