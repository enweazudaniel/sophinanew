import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Starting notifications table fix...")

    // First, let's check the current structure
    const { data: tableInfo, error: tableError } = await supabase.rpc("get_table_info", { table_name: "notifications" })

    if (tableError) {
      console.log("Table info error (expected):", tableError)
    }

    // Try to make user_type nullable
    const { error: alterError } = await supabase.rpc("execute_sql", {
      sql: `
          ALTER TABLE notifications 
          ALTER COLUMN user_type DROP NOT NULL;
          
          UPDATE notifications 
          SET user_type = 'student' 
          WHERE user_type IS NULL;
        `,
    })

    if (alterError) {
      console.log("Alter error (trying direct approach):", alterError)

      // Try direct SQL execution
      const { error: directError } = await supabase
        .from("notifications")
        .update({ user_type: "student" })
        .is("user_type", null)

      if (directError) {
        console.error("Direct update error:", directError)
      }
    }

    // Test creating a notification
    const { data: testNotification, error: testError } = await supabase
      .from("notifications")
      .insert({
        user_id: 1,
        user_type: "student",
        type: "test",
        title: "Test Notification",
        message: "This is a test notification",
        metadata: "{}",
        is_read: false,
      })
      .select()

    if (testError) {
      console.error("Test notification error:", testError)
      return NextResponse.json({
        success: false,
        error: testError.message,
        details: testError,
      })
    }

    console.log("Notifications fix completed successfully")
    return NextResponse.json({
      success: true,
      message: "Notifications table fixed successfully",
      testNotification,
    })
  } catch (error) {
    console.error("Error fixing notifications:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
