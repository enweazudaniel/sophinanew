"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Database } from "lucide-react"

export default function ApplyFixesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const handleApplyFixes = async () => {
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/db/apply-all-fixes", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Failed to apply fixes")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Apply All Database Fixes</h1>
          <p className="text-muted-foreground">Fix all known database issues in one go</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Complete Database Fix
            </CardTitle>
            <CardDescription>This will apply all necessary fixes to make the application work properly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">What this will fix:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Notification system user_type constraint</li>
                <li>Lessons table missing columns</li>
                <li>Missing database indexes for performance</li>
                <li>Assignment-class relationships</li>
                <li>Student metrics tracking</li>
                <li>Sample data for testing</li>
              </ul>
            </div>

            <Button onClick={handleApplyFixes} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying Fixes...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Apply All Fixes
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">{result.message}</p>
                    <div className="text-sm">
                      <p>✅ Successful operations: {result.successCount}</p>
                      {result.errorCount > 0 && <p>⚠️ Errors encountered: {result.errorCount}</p>}
                    </div>
                    {result.errors && result.errors.length > 0 && (
                      <details className="text-xs">
                        <summary>Error details</summary>
                        <ul className="mt-2 space-y-1">
                          {result.errors.map((error: string, index: number) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✅ Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  1. Go to <strong>/dashboard</strong> to test the student dashboard
                </p>
                <p>2. Try the Khan Academy button (green button in top right)</p>
                <p>3. Check that avatars display without names</p>
                <p>
                  4. Test creating lessons in <strong>/teacher/content</strong>
                </p>
                <p>5. Verify notifications work by completing exercises</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
