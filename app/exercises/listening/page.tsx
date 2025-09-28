"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Headphones, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ListeningExercise {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  isCompleted: boolean
  href: string
}

export default function ListeningExercisesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const listeningExercises: ListeningExercise[] = [
    {
      id: "practice",
      title: "Listening Practice",
      description: "Basic listening comprehension with audio clips and questions",
      difficulty: "beginner",
      estimatedTime: 20,
      isCompleted: false,
      href: "/exercises/listening/practice",
    },
    {
      id: "conversations",
      title: "Conversations",
      description: "Listen to everyday conversations and answer comprehension questions",
      difficulty: "intermediate",
      estimatedTime: 25,
      isCompleted: false,
      href: "/exercises/listening/conversations",
    },
    {
      id: "lectures",
      title: "Academic Lectures",
      description: "Practice listening to academic content and taking notes",
      difficulty: "advanced",
      estimatedTime: 35,
      isCompleted: false,
      href: "/exercises/listening/lectures",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Listening Exercises</h1>
            <p className="text-muted-foreground">Enhance your listening comprehension skills</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/exercises">← Back to All Exercises</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {listeningExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  </div>
                  {exercise.isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {exercise.estimatedTime} min
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={exercise.href}>{exercise.isCompleted ? "Review" : "Start Exercise"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardShell>
    </div>
  )
}
