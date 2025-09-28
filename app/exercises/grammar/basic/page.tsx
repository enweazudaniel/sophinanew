"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { LessonCompletion } from "@/components/lesson-completion"

const questions = [
  {
    id: 1,
    question: "Which sentence is grammatically correct?",
    options: [
      { id: "a", text: "She don't like coffee." },
      { id: "b", text: "She doesn't like coffee." },
      { id: "c", text: "She not like coffee." },
      { id: "d", text: "She do not likes coffee." },
    ],
    correctAnswer: "b",
    explanation:
      "For third-person singular subjects (he, she, it), we use 'doesn't' in the present simple negative form.",
  },
  {
    id: 2,
    question: "Choose the correct form of the verb:",
    subQuestion: "They _____ to the movies last weekend.",
    options: [
      { id: "a", text: "go" },
      { id: "b", text: "goes" },
      { id: "c", text: "went" },
      { id: "d", text: "gone" },
    ],
    correctAnswer: "c",
    explanation: "For past simple tense, we use the past form of the verb 'go', which is 'went'.",
  },
  {
    id: 3,
    question: "Which sentence uses the correct article?",
    options: [
      { id: "a", text: "She is an university student." },
      { id: "b", text: "She is a university student." },
      { id: "c", text: "She is the university student." },
      { id: "d", text: "She is university student." },
    ],
    correctAnswer: "b",
    explanation:
      "We use 'a' before words that begin with a consonant sound. 'University' begins with a 'y' sound, which is a consonant sound.",
  },
  {
    id: 4,
    question: "Choose the correct preposition:",
    subQuestion: "The book is _____ the table.",
    options: [
      { id: "a", text: "in" },
      { id: "b", text: "at" },
      { id: "c", text: "on" },
      { id: "d", text: "by" },
    ],
    correctAnswer: "c",
    explanation: "We use 'on' for objects that are supported by a surface.",
  },
  {
    id: 5,
    question: "Which sentence is in the passive voice?",
    options: [
      { id: "a", text: "John wrote the letter." },
      { id: "b", text: "The letter was written by John." },
      { id: "c", text: "John is writing the letter." },
      { id: "d", text: "John has written the letter." },
    ],
    correctAnswer: "b",
    explanation:
      "In passive voice, the object of the action becomes the subject of the sentence. The formula is: subject + be + past participle.",
  },
]

// Lesson ID for this exercise (corresponds to the ID in the lessons table)
const LESSON_ID = 1 // Basic Grammar

export default function GrammarBasicPage() {
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [user, setUser] = useState<{ id: number } | null>(null)
  const [finalScore, setFinalScore] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)

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
    setShowExplanation(true)
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setShowExplanation(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate final score as a percentage
      const finalScorePercentage = Math.round((score / questions.length) * 100)
      setFinalScore(finalScorePercentage)
      setIsQuizCompleted(true)
      setShowCompletion(true)

      toast({
        title: "Quiz Completed!",
        description: `You scored ${finalScorePercentage}% on the Basic Grammar quiz.`,
      })
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setShowExplanation(false)
    setScore(0)
    setIsQuizCompleted(false)
    setFinalScore(0)
    setShowCompletion(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Basic Grammar</h1>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isQuizCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
              {questions[currentQuestion].subQuestion && (
                <CardDescription className="text-lg mt-2 font-medium">
                  {questions[currentQuestion].subQuestion}
                </CardDescription>
              )}
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

              {showExplanation && (
                <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  <AlertDescription>{questions[currentQuestion].explanation}</AlertDescription>
                </Alert>
              )}
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
              <CardDescription>You've completed the Basic Grammar quiz.</CardDescription>
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
                    ? "Great job! You have a strong understanding of basic grammar."
                    : score >= questions.length * 0.6
                      ? "Good effort! Keep practicing to improve."
                      : "Keep practicing to improve your grammar skills."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={restartQuiz}>Restart Quiz</Button>
              <Button variant="outline" asChild>
                <Link href="/exercises">Back to Exercises</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* This component handles saving the lesson completion to the database */}
        {showCompletion && user && <LessonCompletion studentId={user.id} lessonId={LESSON_ID} score={finalScore} />}
      </DashboardShell>
    </div>
  )
}
