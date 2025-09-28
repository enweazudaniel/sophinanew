"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function FixLessonSchema() {
  const [isFixing, setIsFixing] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const runFix = async () => {
    setIsFixing(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/fix-lesson-schema")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fix Lesson Completion Schema</CardTitle>
        <CardDescription>
          This utility will fix the lesson_completions table schema and remove duplicate records.
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
          </div>
        )}

        <p className="text-sm text-muted-foreground">This will:</p>
        <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
          <li>Add missing columns to the lesson_completions table</li>
          <li>Remove duplicate records (keeping the highest score)</li>
          <li>Fix any schema inconsistencies</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={runFix} disabled={isFixing} className="w-full">
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing Schema...
            </>
          ) : (
            "Fix Lesson Schema"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
