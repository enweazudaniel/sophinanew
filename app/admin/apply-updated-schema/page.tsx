"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function ApplyUpdatedSchemaPage() {
  const [isApplying, setIsApplying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const applySchema = async () => {
    setIsApplying(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/apply-updated-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to apply schema",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsApplying(false)
    }
  }

  const executeCustomSQL = async (sql: string) => {
    try {
      const response = await fetch("/api/db/apply-updated-schema", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Apply Updated Database Schema</h1>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This will apply the complete updated database schema including all new features for class-based exercises,
          enhanced assignments, file uploads, and analytics. Make sure to backup your database before proceeding.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Schema Update</CardTitle>
          <CardDescription>
            Apply the latest database schema that includes:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Enhanced user management with class support</li>
              <li>Class-based exercise system with MCQ support</li>
              <li>Advanced assignment submission with file uploads</li>
              <li>Exercise analytics and performance tracking</li>
              <li>Notification system</li>
              <li>Student metrics and achievements</li>
              <li>Grading scales and rubrics</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={applySchema} disabled={isApplying} className="w-full">
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying Schema...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Apply Updated Schema
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-4">
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message || result.error}
                </AlertDescription>
              </Alert>

              {result.summary && (
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-green-600">
                    Success: {result.summary.successCount}
                  </Badge>
                  <Badge variant="outline" className="text-red-600">
                    Errors: {result.summary.errorCount}
                  </Badge>
                  <Badge variant="outline">Total: {result.summary.totalStatements}</Badge>
                </div>
              )}

              {result.verification && result.verification.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Database Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.verification.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.query}</span>
                          <Badge variant="secondary">{JSON.stringify(item.result)}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>

              {showDetails && result.results && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Execution Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {result.results.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-xs ${
                            item.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <div className="font-mono">{item.statement}</div>
                          {item.error && <div className="text-red-600 mt-1">{item.error}</div>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
          <CardDescription>Common database operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              executeCustomSQL("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            }
          >
            List Tables
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => executeCustomSQL("SELECT COUNT(*) as total_users FROM users")}
          >
            Count Users
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => executeCustomSQL("SELECT COUNT(*) as total_exercises FROM exercises")}
          >
            Count Exercises
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
