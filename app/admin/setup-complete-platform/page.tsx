"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function SetupCompletePlatformPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; error?: string } | null>(null)

  const setupPlatform = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/setup-complete-platform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Setup error:", error)
      setResult({
        success: false,
        message: "Failed to setup platform",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Setup Complete Platform Database
            </CardTitle>
            <CardDescription>
              Initialize the complete Sophina Learning Platform database with all tables, sample data, and
              configurations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">This will create:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Users table (students, teachers, admins)</li>
                <li>Classes and class-student relationships</li>
                <li>Lessons with content and availability controls</li>
                <li>Exercises with real content (including reading comprehension)</li>
                <li>Assignments and submission system</li>
                <li>Student metrics and progress tracking</li>
                <li>Achievements and notifications</li>
                <li>All necessary indexes and triggers</li>
                <li>Row Level Security policies</li>
                <li>Sample data for immediate testing</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Sample Login Credentials:</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Admin:</strong> admin / admin123
                </p>
                <p>
                  <strong>Teacher:</strong> teacher1 / password123
                </p>
                <p>
                  <strong>Student:</strong> student1 / password123
                </p>
              </div>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>
                  {result.message}
                  {result.error && <div className="mt-2 text-xs">{result.error}</div>}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={setupPlatform} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up platform...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Setup Complete Platform Database
                </>
              )}
            </Button>

            {result?.success && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
                  <li>Go to /login to test student/teacher login</li>
                  <li>Visit /admin/content-management to manage exercises</li>
                  <li>Check /exercises/reading/comprehension for the reading exercise</li>
                  <li>Test the complete platform functionality</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
