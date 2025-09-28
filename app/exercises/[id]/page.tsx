"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Loader2,
  Calculator,
  Beaker,
  Globe,
  Users,
  BookOpen,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Exercise {
  id: number
  title: string
  description: string
  subject: string
  difficulty: string
  questions: Question[]
  estimated_duration: number
  max_score: number
}

export default function ExercisePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const exerciseId = params.id as string

  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

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
      fetchExercise()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, exerciseId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (hasStarted && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [hasStarted, timeRemaining, showResults])

  const fetchExercise = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", exerciseId)
        .eq("is_available", true)
        .single()

      if (error) {
        console.error("Error fetching exercise:", error)
        toast({
          title: "Error",
          description: "Exercise not found or not available.",
          variant: "destructive",
        })
        router.push("/exercises")
        return
      }

      setExercise(data)
      setTimeRemaining(data.estimated_duration * 60) // Convert minutes to seconds
    } catch (error) {
      console.error("Error fetching exercise:", error)
      router.push("/exercises")
    } finally {
      setLoading(false)
    }
  }

  const startExercise = () => {
    setHasStarted(true)
  }

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const calculateScore = () => {
    if (!exercise) return 0

    let correctAnswers = 0
    exercise.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    return Math.round((correctAnswers / exercise.questions.length) * 100)
  }

  const handleSubmit = async () => {
    if (!exercise || !user) return

    setIsSubmitting(true)
    const finalScore = calculateScore()
    setScore(finalScore)

    try {
      // Save submission to database
      const { error } = await supabase.from("exercise_submissions").insert({
        student_id: user.id,
        exercise_id: exercise.id,
        answers: answers,
        score: finalScore,
        completed_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving submission:", error)
        toast({
          title: "Warning",
          description: "Exercise completed but failed to save results.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Exercise completed successfully!",
        })
      }
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setIsSubmitting(false)
      setShowResults(true)
    }
  }

  const resetExercise = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
    setHasStarted(false)
    if (exercise) {
      setTimeRemaining(exercise.estimated_duration * 60)
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "mathematics":
        return <Calculator className="h-5 w-5 text-blue-500" />
      case "science":
        return <Beaker className="h-5 w-5 text-green-500" />
      case "social_studies":
        return <Globe className="h-5 w-5 text-purple-500" />
      case "civic_education":
        return <Users className="h-5 w-5 text-orange-500" />
      case "general_knowledge":
        return <BookOpen className="h-5 w-5 text-indigo-500" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case "mathematics":
        return "Mathematics"
      case "science":
        return "Science"
      case "social_studies":
        return "Social Studies"
      case "civic_education":
        return "Civic Education"
      case "general_knowledge":
        return "General Knowledge"
      default:
        return subject
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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

  if (!exercise) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Exercise Not Found</h1>
            <Button asChild>
              <Link href="/exercises">Back to Exercises</Link>
            </Button>
          </div>
        </DashboardShell>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {getSubjectIcon(exercise.subject)}
                  <CardTitle className="text-2xl">{exercise.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant="outline">{getSubjectName(exercise.subject)}</Badge>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {exercise.estimated_duration} minutes
                  </Badge>
                  <Badge variant="outline">{exercise.questions.length} questions</Badge>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Instructions:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>You have {exercise.estimated_duration} minutes to complete this exercise</li>
                      <li>Each question has multiple choice answers</li>
                      <li>Select the best answer for each question</li>
                      <li>You can navigate between questions using the navigation buttons</li>
                      <li>Submit your answers when you're ready or when time runs out</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button onClick={startExercise} className="flex-1">
                    Start Exercise
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/exercises">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Exercises
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardShell>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Exercise Results</CardTitle>
                <CardDescription>Here's how you performed on {exercise.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{score}%</div>
                  <div className="text-muted-foreground">
                    {exercise.questions.filter((q) => answers[q.id] === q.correctAnswer).length} out of{" "}
                    {exercise.questions.length} correct
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetExercise}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/exercises">Back to Exercises</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Question Review */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Question Review</h3>
              {exercise.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Question {index + 1}
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </CardTitle>
                      <CardDescription>{question.question}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded border ${
                              optionIndex === question.correctAnswer
                                ? "bg-green-50 border-green-200"
                                : userAnswer === optionIndex
                                  ? "bg-red-50 border-red-200"
                                  : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span>{option}</span>
                              {optionIndex === question.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                              )}
                              {userAnswer === optionIndex && optionIndex !== question.correctAnswer && (
                                <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Alert>
                        <AlertDescription>
                          <strong>Explanation:</strong> {question.explanation}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </DashboardShell>
      </div>
    )
  }

  const currentQuestion = exercise.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / exercise.questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="max-w-4xl mx-auto">
          {/* Header with timer and progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{exercise.title}</h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeRemaining)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {exercise.questions.length}
            </div>
          </div>

          <Progress value={progress} className="mb-6" />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription className="text-base">{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentQuestionIndex === exercise.questions.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Exercise
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(exercise.questions.length - 1, prev + 1))}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question navigation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Question Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {exercise.questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestionIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`relative ${
                      answers[exercise.questions[index].id] !== undefined
                        ? "bg-green-50 border-green-200 hover:bg-green-100"
                        : ""
                    }`}
                  >
                    {index + 1}
                    {answers[exercise.questions[index].id] !== undefined && (
                      <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
