"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Mic, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface SpeakingExercise {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  isCompleted: boolean
  href: string
}

export default function SpeakingExercisesPage() {
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

  const speakingExercises: SpeakingExercise[] = [
    {
      id: "basic",
      title: "Basic Speaking",
      description: "Practice basic pronunciation and speaking fundamentals",
      difficulty: "beginner",
      estimatedTime: 15,
      isCompleted: false,
      href: "/exercises/speaking/basic",
    },
    {
      id: "practice",
      title: "Speaking Practice",
      description: "Interactive speaking exercises with voice recording",
      difficulty: "intermediate",
      estimatedTime: 20,
      isCompleted: false,
      href: "/exercises/speaking/practice",
    },
    {
      id: "conversation",
      title: "Conversation Practice",
      description: "Practice real-world conversations and dialogues",
      difficulty: "intermediate",
      estimatedTime: 25,
      isCompleted: false,
      href: "/exercises/speaking/conversation",
    },
    {
      id: "drills",
      title: "Pronunciation Drills",
      description: "Focus on specific sounds and pronunciation patterns",
      difficulty: "intermediate",
      estimatedTime: 20,
      isCompleted: false,
      href: "/exercises/speaking/drills",
    },
    {
      id: "tongue-twisters",
      title: "Tongue Twisters",
      description: "Challenge your pronunciation with fun tongue twisters",
      difficulty: "advanced",
      estimatedTime: 15,
      isCompleted: false,
      href: "/exercises/speaking/tongue-twisters",
    },
    {
      id: "intonation",
      title: "Intonation Practice",
      description: "Master the rhythm and melody of English speech",
      difficulty: "advanced",
      estimatedTime: 30,
      isCompleted: false,
      href: "/exercises/speaking/intonation",
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
            <h1 className="text-3xl font-bold tracking-tight">Speaking Exercises</h1>
            <p className="text-muted-foreground">Practice pronunciation and speaking skills</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/exercises">← Back to All Exercises</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {speakingExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-pink-500" />
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
