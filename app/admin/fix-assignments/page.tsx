"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FixAssignmentsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
    details?: string
    data?: any
  } | null>(null)

  const handleFixSchema = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/fix-assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        console.log("Schema fix successful:", data)
      } else {
        console.error("Schema fix failed:", data)
      }
    } catch (error) {
      console.error("Error fixing schema:", error)
      setResult({
        success: false,
        message: "Failed to fix assignment schema",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Fix Assignment Schema</h1>
            <p className="text-muted-foreground">Update database schema to support enhanced assignment features</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Assignment Schema Fix
              </CardTitle>
              <CardDescription>
                This will update the database schema to support:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>File upload assignments with size and type restrictions</li>
                  <li>Mixed submission types (text + files)</li>
                  <li>Assignment instructions and rubrics</li>
                  <li>Enhanced submission tracking</li>
                  <li>Notification system for teachers</li>
                  <li>File management for assignments and submissions</li>
                </ul>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button onClick={handleFixSchema} disabled={isLoading} size="lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Fixing Schema..." : "Fix Assignment Schema"}
                  </Button>
                  {result && (
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Success" : "Failed"}
                    </Badge>
                  )}
                </div>

                {result && (
                  <Alert variant={result.success ? "default" : "destructive"}>
                    {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">{result.message}</p>
                        {result.error && (
                          <div className="text-sm">
                            <p className="font-medium text-red-600">Error:</p>
                            <p className="font-mono bg-red-50 p-2 rounded">{result.error}</p>
                          </div>
                        )}
                        {result.details && (
                          <div className="text-sm">
                            <p className="font-medium">Details:</p>
                            <p className="font-mono bg-gray-50 p-2 rounded">{result.details}</p>
                          </div>
                        )}
                        {result.data && (
                          <div className="text-sm">
                            <p className="font-medium">Database Response:</p>
                            <pre className="font-mono bg-gray-50 p-2 rounded text-xs overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What This Fix Does</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Assignments Table Updates:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Adds max_file_size column (default 10MB)</li>
                    <li>Adds allowed_file_types array column</li>
                    <li>Adds assignment_type column (text, file, mixed)</li>
                    <li>Adds instructions text column</li>
                    <li>Adds rubric JSONB column</li>
                    <li>Adds resources JSONB column</li>
                    <li>Adds created_by reference to users</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Submissions Table Updates:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Adds submission_type column</li>
                    <li>Adds files JSONB column for file metadata</li>
                    <li>Adds auto_score and manual_score columns</li>
                    <li>Adds rubric_scores JSONB column</li>
                    <li>Adds graded_at timestamp</li>
                    <li>Adds updated_at timestamp with trigger</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">New Tables Created:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>assignment_files - for assignment resource files</li>
                    <li>submission_files - for submitted files</li>
                    <li>notifications - for teacher notifications</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Sample Data:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Creates 3 sample assignments if none exist</li>
                    <li>Different assignment types for testing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
