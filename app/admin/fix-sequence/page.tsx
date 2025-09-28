"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle } from "lucide-react"

export default function FixSequencePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFixSequence = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/fix-sequence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || "Failed to fix sequence" })
      }
    } catch (error) {
      console.error("Error fixing sequence:", error)
      setResult({ success: false, message: "Network error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Fix Database Sequence
          </CardTitle>
          <CardDescription>
            This will fix the lessons table sequence issue that causes "duplicate key" errors when creating lessons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">What this does:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Resets the lessons table auto-increment sequence</li>
              <li>• Fixes "duplicate key value violates unique constraint" errors</li>
              <li>• Tests the fix by creating and deleting a test lesson</li>
            </ul>
          </div>

          <Button onClick={handleFixSequence} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Fix Lessons Sequence
          </Button>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {result?.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                ✅ Sequence fixed! You can now create lessons from the teacher dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
