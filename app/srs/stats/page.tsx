"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface SRSStats {
  totalItems: number
  dueItems: number
  newItems: number
  learningItems: number
  matureItems: number
}

export default function SRSStatsPage() {
  const [user, setUser] = useState<{ id: number } | null>(null)
  const [stats, setStats] = useState<SRSStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/srs/stats?studentId=${user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch SRS statistics")
        }

        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching SRS stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>You need to be logged in to view your statistics.</CardDescription>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Spaced Repetition Statistics</h1>
          <Button asChild>
            <Link href="/srs/review">Review Now</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to load statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardFooter>
          </Card>
        ) : stats ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Due Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.dueItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mature Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.matureItems}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your progress across all flashcards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">New</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.newItems} ({Math.round((stats.newItems / stats.totalItems) * 100) || 0}%)
                      </span>
                    </div>
                    <Progress value={(stats.newItems / stats.totalItems) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Learning</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.learningItems} ({Math.round((stats.learningItems / stats.totalItems) * 100) || 0}%)
                      </span>
                    </div>
                    <Progress value={(stats.learningItems / stats.totalItems) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Mature</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.matureItems} ({Math.round((stats.matureItems / stats.totalItems) * 100) || 0}%)
                      </span>
                    </div>
                    <Progress value={(stats.matureItems / stats.totalItems) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Data</CardTitle>
              <CardDescription>You don't have any flashcards yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Start adding vocabulary and grammar items to your spaced repetition system.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/exercises/vocabulary/builder">Add Vocabulary</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
