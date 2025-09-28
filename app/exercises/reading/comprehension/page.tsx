"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ArrowLeft, Clock, BookOpen, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { markLessonCompleted } from "@/lib/tracking-utils"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface ExerciseContent {
  passage: string
  questions: Question[]
}

interface Exercise {
  id: number
  title: string
  description: string
  content: ExerciseContent
  max_score: number
  estimated_duration: number
}

export default function ReadingComprehensionPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)

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
  }, [router])

  const fetchExercise = async () => {
    setLoading(true)
    try {
      // Fetch the reading comprehension exercise
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("exercise_type", "comprehension")
        .eq("category", "reading")
        .eq("is_available", true)
        .single()

      if (error) {
        console.error("Error fetching exercise:", error)
        throw error
      }

      if (data) {
        setExercise(data)
      }
    } catch (error) {
      console.error("Error loading exercise:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const calculateScore = () => {
    if (!exercise) return 0

    let correct = 0
    exercise.content.questions.forEach((question) => {
      if (answers[question.id] === question.correct) {
        correct++
      }
    })

    return Math.round((correct / exercise.content.questions.length) * 100)
  }

  const submitExercise = async () => {
    if (!exercise || !user) return

    setSubmitting(true)
    try {
      const finalScore = calculateScore()
      const timeSpent = Math.round((Date.now() - startTime) / 1000)

      // Save exercise submission
      const { error: submissionError } = await supabase.from("exercise_submissions").upsert({
        exercise_id: exercise.id,
        student_id: user.id,
        answers: answers,
        score: finalScore,
        max_score: exercise.max_score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      })

      if (submissionError) {
        console.error("Error saving submission:", submissionError)
        throw submissionError
      }

      // Mark as completed for progress tracking
      await markLessonCompleted(user.id, exercise.id, finalScore, timeSpent)

      setScore(finalScore)
      setShowResults(true)
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (exercise && currentQuestion < exercise.content.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index)
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
          <Alert variant="destructive">
            <AlertDescription>Reading comprehension exercise not found or not available.</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.push("/exercises")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>
        </DashboardShell>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Exercise Completed!
              </CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}%</div>
                <div className="text-muted-foreground">
                  {exercise.content.questions.filter((q) => answers[q.id] === q.correct).length} out of{" "}
                  {exercise.content.questions.length} correct
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {exercise.content.questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correct

                  return (
                    <Card key={question.id} className={isCorrect ? "border-green-200" : "border-red-200"}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2 mb-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">{question.question}</p>
                            <div className="space-y-1 text-sm">
                              <p>
                                <strong>Your answer:</strong>{" "}
                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                  {question.options[userAnswer] || "Not answered"}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p>
                                  <strong>Correct answer:</strong>{" "}
                                  <span className="text-green-600">{question.options[question.correct]}</span>
                                </p>
                              )}
                              <p className="text-muted-foreground">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/exercises")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Exercises
                </Button>
                <Button onClick={() => router.push("/progress")}>View Progress</Button>
              </div>
            </CardContent>
          </Card>
        </DashboardShell>
      </div>
    )
  }

  const currentQ = exercise.content.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / exercise.content.questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/exercises")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exercises
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {exercise.estimated_duration} min
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Reading
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Question {currentQuestion + 1} of {exercise.content.questions.length}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Reading Passage */}
          <Card>
            <CardHeader>
              <CardTitle>{exercise.title}</CardTitle>
              <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{exercise.content.passage}</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{currentQ.question}</p>

              <RadioGroup
                value={answers[currentQ.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Question Navigation */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {exercise.content.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        index === currentQuestion
                          ? "default"
                          : answers[exercise.content.questions[index].id] !== undefined
                            ? "secondary"
                            : "outline"
                      }
                      size="sm"
                      onClick={() => goToQuestion(index)}
                      className="w-10 h-10"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                    Previous
                  </Button>

                  {currentQuestion === exercise.content.questions.length - 1 ? (
                    <Button
                      onClick={submitExercise}
                      disabled={submitting || Object.keys(answers).length !== exercise.content.questions.length}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Exercise"
                      )}
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>Next</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
