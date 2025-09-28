import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), "database", "complete-updated-schema.sql")
    const schemaSQL = fs.readFileSync(schemaPath, "utf8")

    // Split the schema into individual statements
    const statements = schemaSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    const results = []
    let successCount = 0
    let errorCount = 0

    // Execute each statement
    for (const statement of statements) {
      try {
        if (statement.toLowerCase().includes("commit")) {
          continue // Skip COMMIT statements as Supabase handles transactions automatically
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

    // Verify the schema was applied correctly
    const verificationQueries = [
      "SELECT COUNT(*) as user_count FROM users",
      "SELECT COUNT(*) as class_count FROM classes",
      "SELECT COUNT(*) as exercise_count FROM exercises",
      "SELECT COUNT(*) as assignment_count FROM assignments",
    ]

    const verificationResults = []
    for (const query of verificationQueries) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })
        if (!error) {
          verificationResults.push({ query, result: data })
        }
      } catch (err) {
        // Ignore verification errors
      }
    }

    return NextResponse.json({
      success: true,
      message: `Schema update completed. ${successCount} statements succeeded, ${errorCount} failed.`,
      summary: {
        totalStatements: statements.length,
        successCount,
        errorCount,
      },
      results: results.slice(-10), // Return last 10 results
      verification: verificationResults,
    })
  } catch (error) {
    console.error("Error applying schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to apply schema",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Alternative method using direct SQL execution
export async function PUT(request: NextRequest) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    const { data, error } = await supabase.rpc("exec_sql", {
      sql_query: sql,
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error executing SQL:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to execute SQL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
