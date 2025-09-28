"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock } from "lucide-react"
import Link from "next/link"

interface SRSStats {
  totalItems: number
  dueItems: number
  newItems: number
  learningItems: number
  matureItems: number
}

export function SRSSummary({ studentId }: { studentId: number }) {
  const [stats, setStats] = useState<SRSStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/srs/stats?studentId=${studentId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch SRS statistics")
        }

        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        console.error("Error fetching SRS stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [studentId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Spaced Repetition
          </CardTitle>
          <CardDescription>Loading your flashcard data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats || stats.totalItems === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Spaced Repetition
          </CardTitle>
          <CardDescription>You haven't added any flashcards yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add vocabulary and grammar items to your flashcard system to improve retention.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/exercises/vocabulary/builder">Add Vocabulary</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          Spaced Repetition
        </CardTitle>
        <CardDescription>
          {stats.dueItems > 0 ? `You have ${stats.dueItems} flashcards due for review` : "No flashcards due for review"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Due today</span>
          </div>
          <span className="text-sm font-bold">{stats.dueItems}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Learning progress</span>
            <span className="text-xs font-medium">
              {stats.matureItems} / {stats.totalItems} mastered
            </span>
          </div>
          <Progress value={(stats.matureItems / stats.totalItems) * 100} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/srs/review">Review Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
