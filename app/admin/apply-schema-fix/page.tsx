"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function ApplySchemaFixPage() {
  const [isApplying, setIsApplying] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const applySchemaFix = async () => {
    setIsApplying(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/apply-schema-fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error applying schema fix:", error)
      setResult({
        success: false,
        message: "Failed to apply schema fix. Please try again.",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Apply Database Schema Fix</CardTitle>
          <CardDescription>
            This will add missing columns to the lessons table and fix any schema issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">This fix will:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Add missing media_url column to lessons table</li>
              <li>Add missing content column to lessons table</li>
              <li>Add missing created_by, updated_at, is_published columns</li>
              <li>Initialize basic lessons if they don't exist</li>
              <li>Fix student metrics table</li>
              <li>Initialize metrics for existing students</li>
            </ul>
          </div>

          <Button onClick={applySchemaFix} disabled={isApplying} className="w-full">
            {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isApplying ? "Applying Fix..." : "Apply Schema Fix"}
          </Button>

          {result && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {result.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{result.message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
