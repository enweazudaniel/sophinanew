import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), "database", "fix-schema.sql")
    const sqlContent = fs.readFileSync(sqlPath, "utf8")

    // Split into individual statements
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    const results = []

    // Execute each statement
    for (const statement of statements) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", {
          sql_query: statement,
        })

        if (error) {
          console.error("Error executing statement:", statement, error)
          results.push({
            statement: statement.substring(0, 100) + "...",
            success: false,
            error: error.message,
          })
        } else {
          results.push({
            statement: statement.substring(0, 100) + "...",
            success: true,
          })
        }
      } catch (err) {
        console.error("Exception executing statement:", statement, err)
        results.push({
          statement: statement.substring(0, 100) + "...",
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Schema fixes applied",
      results,
    })
  } catch (error) {
    console.error("Error applying schema fixes:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
