import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    // Execute the SQL query
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("SQL execution error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error executing SQL:", error)
    return NextResponse.json({ error: "Failed to execute SQL" }, { status: 500 })
  }
}
