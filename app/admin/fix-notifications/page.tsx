"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function FixNotificationsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const handleFixNotifications = async () => {
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/db/fix-notifications", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Failed to fix notifications")
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
          <h1 className="text-3xl font-bold">Fix Notifications System</h1>
          <p className="text-muted-foreground">Resolve the user_type constraint issue in the notifications table</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification System Fix</CardTitle>
            <CardDescription>This will fix the "user_type" constraint error in the notifications table</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">What this fix does:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Makes the user_type column nullable or sets a default value</li>
                <li>Updates existing notifications without user_type</li>
                <li>Tests notification creation to ensure it works</li>
              </ul>
            </div>

            <Button onClick={handleFixNotifications} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing Notifications...
                </>
              ) : (
                "Fix Notifications System"
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
                  {result.message}
                  {result.testNotification && (
                    <div className="mt-2">
                      <strong>Test notification created successfully!</strong>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
