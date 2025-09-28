"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  BookOpen,
  Target,
  Clock,
  Star,
  Lock,
  CheckCircle,
  Loader2,
  Calculator,
  Globe,
  Beaker,
  Users,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Exercise {
  id: number
  title: string
  description: string
  subject: string
  difficulty: string
  estimated_duration: number
  is_available: boolean
  questions: any[]
}

interface ExerciseCategory {
  name: string
  description: string
  icon: any
  color: string
  exercises: Exercise[]
}

export default function ExercisesPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchExercises(parsedUser.id)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchExercises = async (userId: number) => {
    setLoading(true)
    try {
      // Fetch all exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from("exercises")
        .select("*")
        .order("subject", { ascending: true })

      if (exercisesError) throw exercisesError

      // Fetch completed exercises for this user
      const { data: completionsData, error: completionsError } = await supabase
        .from("exercise_submissions")
        .select("exercise_id")
        .eq("student_id", userId)

      if (completionsError) {
        console.error("Error fetching completions:", completionsError)
      }

      setExercises(exercisesData || [])
      setCompletedExercises(new Set(completionsData?.map((c) => c.exercise_id) || []))
    } catch (error) {
      console.error("Error fetching exercises:", error)
    } finally {
      setLoading(false)
    }
  }

  const getExercisesByCategory = (): ExerciseCategory[] => {
    const categories: ExerciseCategory[] = [
      {
        name: "Mathematics",
        description: "Practice mathematical concepts and problem solving",
        icon: Calculator,
        color: "bg-blue-500",
        exercises: exercises.filter((e) => e.subject === "mathematics"),
      },
      {
        name: "Science",
        description: "Explore scientific concepts and theories",
        icon: Beaker,
        color: "bg-green-500",
        exercises: exercises.filter((e) => e.subject === "science"),
      },
      {
        name: "Social Studies",
        description: "Learn about history, geography, and society",
        icon: Globe,
        color: "bg-purple-500",
        exercises: exercises.filter((e) => e.subject === "social_studies"),
      },
      {
        name: "Civic Education",
        description: "Understand citizenship and civic responsibilities",
        icon: Users,
        color: "bg-orange-500",
        exercises: exercises.filter((e) => e.subject === "civic_education"),
      },
      {
        name: "General Knowledge",
        description: "Test your knowledge across various topics",
        icon: BookOpen,
        color: "bg-indigo-500",
        exercises: exercises.filter((e) => e.subject === "general_knowledge"),
      },
    ]

    return categories.filter((cat) => cat.exercises.length > 0)
  }

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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DashboardShell>
      </div>
    )
  }

  const categories = getExercisesByCategory()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
            <p className="text-muted-foreground">Practice and test your knowledge across different subjects</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Exercises</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exercises.filter((e) => e.is_available).length}</div>
              <p className="text-xs text-muted-foreground">Ready to practice</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExercises.size}</div>
              <p className="text-xs text-muted-foreground">Exercises finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exercises.filter((e) => e.is_available).length > 0
                  ? Math.round((completedExercises.size / exercises.filter((e) => e.is_available).length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Categories */}
        <div className="space-y-8 mt-8">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <category.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.exercises.map((exercise) => {
                  const isCompleted = completedExercises.has(exercise.id)
                  const isAvailable = exercise.is_available

                  return (
                    <Card key={exercise.id} className={`relative ${!isAvailable ? "opacity-60" : ""}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {exercise.title}
                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {!isAvailable && <Lock className="h-4 w-4 text-gray-400" />}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exercise.estimated_duration}m
                          </Badge>
                          <Badge variant="outline">{exercise.questions?.length || 0} questions</Badge>
                        </div>

                        {isAvailable ? (
                          <Button asChild className="w-full">
                            <Link href={`/exercises/${exercise.id}`}>
                              {isCompleted ? "Review Exercise" : "Start Exercise"}
                            </Link>
                          </Button>
                        ) : (
                          <Button disabled className="w-full">
                            Coming Soon
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Exercises Available</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Exercises are being prepared. Check back soon for new practice opportunities!
              </p>
            </CardContent>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
