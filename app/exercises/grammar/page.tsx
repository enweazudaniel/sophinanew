"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { LessonStatus } from "@/components/lesson-status"

export default function GrammarExercisesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const grammarLessons = [
    {
      id: 1,
      title: "Basic Grammar",
      description: "Learn the fundamentals of English grammar",
      duration: "20 min",
      level: "Beginner",
      progress: 100,
      completed: true,
      path: "/exercises/grammar/basic",
    },
    {
      id: 2,
      title: "Verb Tenses",
      description: "Master present, past, and future tenses",
      duration: "30 min",
      level: "Intermediate",
      progress: 60,
      completed: false,
      path: "/exercises/grammar/verb-tenses",
    },
    {
      id: 3,
      title: "Articles & Prepositions",
      description: "Learn how to use articles and prepositions correctly",
      duration: "25 min",
      level: "Intermediate",
      progress: 40,
      completed: false,
      path: "/exercises/grammar/articles-prepositions",
    },
    {
      id: 4,
      title: "Conditionals",
      description: "Master if-clauses and conditional sentences",
      duration: "35 min",
      level: "Advanced",
      progress: 0,
      completed: false,
      path: "#",
      comingSoon: true,
    },
    {
      id: 5,
      title: "Reported Speech",
      description: "Learn how to report what others have said",
      duration: "30 min",
      level: "Advanced",
      progress: 0,
      completed: false,
      path: "#",
      comingSoon: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Grammar Exercises</h1>
            <p className="text-muted-foreground">Master English grammar rules and structures</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/exercises">Back to All Exercises</Link>
          </Button>
        </div>

        <div className="grid gap-6 mt-6">
          {grammarLessons.map((lesson) => (
            <Card key={lesson.id} className={lesson.comingSoon ? "opacity-70" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {lesson.title}
                      {lesson.comingSoon && (
                        <Badge variant="outline" className="ml-2">
                          Coming Soon
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </div>
                  <LessonStatus completed={lesson.completed} progress={lesson.progress} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{lesson.level}</span>
                  </div>
                  {lesson.completed && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{lesson.progress}%</span>
                  </div>
                  <Progress value={lesson.progress} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild disabled={lesson.comingSoon}>
                  <Link href={lesson.path}>
                    {lesson.progress > 0 && lesson.progress < 100 ? "Continue" : "Start"} Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DashboardShell>
    </div>
  )
}
