"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle } from "lucide-react"
import { LessonCompletion } from "@/components/lesson-completion"
import Link from "next/link"

const questions = [
  {
    id: 1,
    question: "What is the meaning of 'abundant'?",
    options: [
      { id: "a", text: "Scarce" },
      { id: "b", text: "Plentiful" },
      { id: "c", text: "Beautiful" },
      { id: "d", text: "Dangerous" },
    ],
    correctAnswer: "b",
  },
  {
    id: 2,
    question: "Choose the correct synonym for 'happy':",
    options: [
      { id: "a", text: "Sad" },
      { id: "b", text: "Angry" },
      { id: "c", text: "Joyful" },
      { id: "d", text: "Tired" },
    ],
    correctAnswer: "c",
  },
  {
    id: 3,
    question: "What does the word 'enormous' mean?",
    options: [
      { id: "a", text: "Very small" },
      { id: "b", text: "Very large" },
      { id: "c", text: "Very fast" },
      { id: "d", text: "Very slow" },
    ],
    correctAnswer: "b",
  },
  {
    id: 4,
    question: "Which word means 'to look at written words and understand what they mean'?",
    options: [
      { id: "a", text: "Write" },
      { id: "b", text: "Speak" },
      { id: "c", text: "Listen" },
      { id: "d", text: "Read" },
    ],
    correctAnswer: "d",
  },
  {
    id: 5,
    question: "What is the opposite of 'hot'?",
    options: [
      { id: "a", text: "Warm" },
      { id: "b", text: "Cold" },
      { id: "c", text: "Wet" },
      { id: "d", text: "Dry" },
    ],
    correctAnswer: "b",
  },
]

// Lesson ID for this exercise (corresponds to the ID in the lessons table)
const LESSON_ID = 4 // Vocabulary Builder

export default function VocabularyBasicPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [user, setUser] = useState<{ id: number } | null>(null)
  const [finalScore, setFinalScore] = useState(0)

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

  const handleAnswerSelection = (value: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(value)
    }
  }

  const checkAnswer = () => {
    setIsAnswerChecked(true)
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate final score as a percentage
      const finalScorePercentage = Math.round((score / questions.length) * 100)
      setFinalScore(finalScorePercentage)
      setIsQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setScore(0)
    setIsQuizCompleted(false)
    setFinalScore(0)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Basic Vocabulary</h1>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isQuizCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
              <CardDescription>Select the correct answer from the options below.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      isAnswerChecked && option.id === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isAnswerChecked && option.id === selectedAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleAnswerSelection(option.id)}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                      disabled={isAnswerChecked}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex flex-1 items-center justify-between cursor-pointer"
                    >
                      <span>{option.text}</span>
                      {isAnswerChecked && option.id === questions[currentQuestion].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswerChecked &&
                        option.id === selectedAnswer &&
                        option.id !== questions[currentQuestion].correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerChecked ? (
                <Button onClick={checkAnswer} disabled={!selectedAnswer}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
              <div className="text-sm font-medium">
                Score: {score}/{questions.length}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
              <CardDescription>You've completed the Basic Vocabulary quiz.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-4">
                {score}/{questions.length}
              </div>
              <Progress value={(score / questions.length) * 100} className="h-2 mb-4" />
              <p className="text-muted-foreground">
                {score === questions.length
                  ? "Perfect score! Excellent work!"
                  : score >= questions.length * 0.8
                    ? "Great job! You have a strong vocabulary."
                    : score >= questions.length * 0.6
                      ? "Good effort! Keep practicing to improve."
                      : "Keep practicing to improve your vocabulary skills."}
              </p>

              {/* Track lesson completion */}
              {user && finalScore > 0 && (
                <LessonCompletion studentId={user.id} lessonId={LESSON_ID} score={finalScore} />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={restartQuiz}>Restart Quiz</Button>
              <Button variant="outline" asChild>
                <Link href="/exercises">Back to Exercises</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
