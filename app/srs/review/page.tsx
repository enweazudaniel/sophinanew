"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Flashcard } from "@/components/flashcard"
import { useSRS } from "@/hooks/use-srs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SRSReviewPage() {
  const [user, setUser] = useState<{ id: number } | null>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }, [])

  const { currentItem, isLoading, isComplete, progress, handleResponse, error } = useSRS({
    studentId: user?.id || 0,
    limit: 20,
  })

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>You need to be logged in to review your flashcards.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </CardFooter>
          </Card>
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Spaced Repetition Review</h1>
          <div className="text-sm text-muted-foreground">
            {progress.reviewed} / {progress.total} cards
          </div>
        </div>

        {progress.total > 0 && <Progress value={(progress.reviewed / progress.total) * 100} className="h-2 mb-6" />}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {isComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>Review Complete!</CardTitle>
              <CardDescription>You've completed all your due reviews for now.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-medium">Great job!</p>
              <p className="text-muted-foreground mt-2">
                You reviewed {progress.total} {progress.total === 1 ? "card" : "cards"}.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/srs/stats">View Statistics</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col items-center">
            {currentItem ? (
              <Flashcard
                front={currentItem.front_content}
                back={currentItem.back_content}
                example={currentItem.example}
                imageUrl={currentItem.image_url}
                audioUrl={currentItem.audio_url}
                onResponse={handleResponse}
                isLoading={isLoading}
              />
            ) : isLoading ? (
              <Card className="w-full max-w-md">
                <CardContent className="flex justify-center items-center p-12">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Cards Due</CardTitle>
                  <CardDescription>You don't have any cards due for review right now.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Come back later or add new vocabulary and grammar items to study.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </DashboardShell>
    </div>
  )
}
