"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle } from "lucide-react"

export default function ApplyCompleteSchemaPage() {
  const [isApplying, setIsApplying] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const applySchema = async () => {
    setIsApplying(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/apply-complete-schema", {
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
        message: "Failed to apply schema: " + (error as Error).message,
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Apply Complete Database Schema
          </CardTitle>
          <CardDescription>
            This will recreate all database tables with the complete schema including the missing 'content' column for
            lessons. This will drop existing tables and recreate them with sample data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Warning</h4>
            <p className="text-yellow-700 text-sm">This operation will:</p>
            <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
              <li>Drop all existing tables</li>
              <li>Recreate tables with proper schema</li>
              <li>Add the missing 'content' column to lessons table</li>
              <li>Insert sample data for testing</li>
              <li>Set up proper indexes and triggers</li>
            </ul>
          </div>

          <Button onClick={applySchema} disabled={isApplying} className="w-full">
            {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Complete Schema
          </Button>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {result?.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✅ Schema Applied Successfully</h4>
              <p className="text-green-700 text-sm mb-2">
                The database schema has been applied with sample data. You can now:
              </p>
              <ul className="text-green-700 text-sm list-disc list-inside">
                <li>Login as student1/password123</li>
                <li>Login as teacher1/password123</li>
                <li>Login as admin/admin123</li>
                <li>Edit lesson content in the teacher content management</li>
                <li>All features should work properly</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
