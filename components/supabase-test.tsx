"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export function SupabaseTest() {
  const [testResult, setTestResult] = useState<string>("Not tested yet")
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])

  const testConnection = async () => {
    setIsLoading(true)
    try {
      // Test the connection by querying the students table
      const { data, error } = await supabase.from("students").select("*").limit(5)

      if (error) {
        console.error("Supabase connection error:", error)
        setTestResult(`Connection failed: ${error.message}`)
        return
      }

      setStudents(data || [])
      setTestResult(`Connection successful! Found ${data?.length || 0} students.`)
    } catch (error) {
      console.error("Test error:", error)
      setTestResult(`Test failed with error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Test the connection to your Supabase database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Test Result:</p>
            <p className={`mt-1 ${testResult.includes("successful") ? "text-green-600" : "text-red-600"}`}>
              {testResult}
            </p>
          </div>

          {students.length > 0 && (
            <div>
              <p className="font-medium mb-2">Students Found:</p>
              <ul className="space-y-2">
                {students.map((student) => (
                  <li key={student.id} className="p-2 bg-muted rounded-md">
                    <p>
                      <span className="font-medium">ID:</span> {student.id}
                    </p>
                    <p>
                      <span className="font-medium">Username:</span> {student.username}
                    </p>
                    <p>
                      <span className="font-medium">Name:</span> {student.full_name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
