"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export function FixLessonTracking() {
  const [isFixing, setIsFixing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setIsFixing(true)
    setError(null)
    setResult(null)

    try {
      // Run the database migration
      const migrationResponse = await fetch("/api/db/migrate")
      const migrationData = await migrationResponse.json()

      if (!migrationData.success) {
        throw new Error(migrationData.error || "Migration failed")
      }

      // Fix existing lesson completions
      const fixResponse = await fetch("/api/db/fix-lesson-completions")
      const fixData = await fixResponse.json()

      if (!fixData.success) {
        throw new Error(fixData.error || "Fix operation failed")
      }

      setResult({
        migration: migrationData,
        fix: fixData,
      })
    } catch (err) {
      console.error("Error fixing lesson tracking:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fix Lesson Tracking</CardTitle>
        <CardDescription>Run this utility to fix issues with lesson completion tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              <p>Migration: {result.migration.message}</p>
              <p>Fix: {result.fix.message}</p>
              {result.fix.results && (
                <ul className="mt-2 text-sm">
                  <li>Total students: {result.fix.results.totalStudents}</li>
                  <li>Processed students: {result.fix.results.processedStudents}</li>
                  <li>Fixed completions: {result.fix.results.fixedCompletions}</li>
                  {result.fix.results.errors?.length > 0 && <li>Errors: {result.fix.results.errors.length}</li>}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground">
          This utility will fix issues with lesson completion tracking by:
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
          <li>Ensuring the database schema is correctly set up</li>
          <li>Adding missing database triggers for automatic progress updates</li>
          <li>Fixing any inconsistencies in existing lesson completion data</li>
          <li>Recalculating progress metrics for all students</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={runMigration} disabled={isFixing} className="w-full">
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing...
            </>
          ) : (
            "Fix Lesson Tracking"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
