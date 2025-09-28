"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function VerifyLessons() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    lessonCount?: number
    completionCount?: number
  } | null>(null)

  const runVerification = async () => {
    setIsVerifying(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/verify-lessons")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify Lessons</CardTitle>
        <CardDescription>
          This utility will verify the lessons table and ensure all lessons have proper IDs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <div
            className={`p-4 mb-4 rounded-md ${
              result.success
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <p className="font-medium">{result.success ? "Success" : "Error"}</p>
            </div>
            <p className="mt-2">{result.message || result.error}</p>
            {result.success && (
              <div className="mt-2">
                <p>Lessons found: {result.lessonCount}</p>
                <p>Completion records: {result.completionCount}</p>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground">This will:</p>
        <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
          <li>Verify that all lessons have proper IDs</li>
          <li>Create sample lessons if none exist</li>
          <li>Fix ID sequence issues if found</li>
          <li>Report on lesson completion records</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={runVerification} disabled={isVerifying} className="w-full">
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying Lessons...
            </>
          ) : (
            "Verify Lessons"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
