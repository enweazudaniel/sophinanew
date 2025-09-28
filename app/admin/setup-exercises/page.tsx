"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function SetupExercisesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const setupExercises = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/db/setup-exercises", {
        method: "POST",
      })

      if (response.ok) {
        setIsComplete(true)
        toast({
          title: "Success",
          description: "Exercises setup completed successfully",
        })
      } else {
        throw new Error("Failed to setup exercises")
      }
    } catch (error) {
      console.error("Setup failed:", error)
      toast({
        title: "Error",
        description: "Failed to setup exercises",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Setup Exercises</h1>
            <p className="text-muted-foreground">Initialize the exercises database with content</p>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Exercise Database Setup
            </CardTitle>
            <CardDescription>
              This will create the exercises table and populate it with initial content including the reading
              comprehension exercise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>This setup will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Create the lessons table with proper schema</li>
                  <li>Insert reading comprehension exercise with full content</li>
                  <li>Add other exercise placeholders</li>
                  <li>Set proper availability flags</li>
                </ul>
              </div>

              <Button onClick={setupExercises} disabled={isLoading || isComplete} className="w-full">
                {isLoading ? "Setting up..." : isComplete ? "Setup Complete" : "Setup Exercises Database"}
              </Button>

              {isComplete && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  ✅ Exercises database setup completed successfully! You can now manage content through the Content
                  Management page.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    </div>
  )
}
