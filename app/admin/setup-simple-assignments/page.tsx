"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function SetupSimpleAssignmentsPage() {
  const [isSetup, setIsSetup] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const setupDatabase = async () => {
    setIsSetup(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/setup-simple-assignments", {
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
        error: "Failed to setup database",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSetup(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Setup Simple Assignments Database</h1>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This will create a clean, simple database schema for assignments and submissions. It will remove any complex
          features and focus on core functionality: creating assignments and submitting them.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            This will create the following simple tables:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>assignments</strong> - Store assignment details (title, description, due date, etc.)
              </li>
              <li>
                <strong>submissions</strong> - Store student submissions (content, status, score, feedback)
              </li>
              <li>
                <strong>notifications</strong> - Simple notification system
              </li>
            </ul>
            <br />
            <strong>Sample data included:</strong> 3 test assignments will be created for immediate testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={setupDatabase} disabled={isSetup} className="w-full" size="lg">
            {isSetup ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Setup Simple Assignments Database
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

              {result.success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Setup Complete!</strong> You can now:
                    <ul className="list-disc list-inside mt-2">
                      <li>
                        Go to <strong>/teacher/assignments</strong> to create assignments
                      </li>
                      <li>
                        Go to <strong>/assignments</strong> to view and submit assignments
                      </li>
                      <li>Test with the 3 sample assignments that were created</li>
                    </ul>
                  </AlertDescription>
                </Alert>
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
    </div>
  )
}
