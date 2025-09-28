"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const verbTensesExercises = [
  {
    id: 1,
    title: "Present Simple vs. Present Continuous",
    description: "Fill in the blanks with the correct form of the verbs in parentheses.",
    questions: [
      {
        id: 1,
        sentence: "She usually _____ (walk) to school, but today she _____ (take) the bus.",
        answers: ["walks", "is taking"],
        explanation:
          "We use the present simple (walks) for habits or routines, and the present continuous (is taking) for actions happening now or temporary situations.",
      },
      {
        id: 2,
        sentence: "I _____ (not understand) why he always _____ (arrive) late.",
        answers: ["don't understand", "arrives"],
        explanation: "We use the present simple with negatives (don't understand) and for habitual actions (arrives).",
      },
      {
        id: 3,
        sentence: "_____ (you/work) this weekend? No, I usually _____ (spend) weekends with my family.",
        answers: ["Are you working", "spend"],
        explanation:
          "We use the present continuous (Are you working) for future arrangements, and the present simple (spend) for habits.",
      },
      {
        id: 4,
        sentence: "The Earth _____ (rotate) around the Sun while the Moon _____ (orbit) the Earth.",
        answers: ["rotates", "orbits"],
        explanation: "We use the present simple for scientific facts and permanent situations.",
      },
      {
        id: 5,
        sentence: "She _____ (not feel) well today, so she _____ (stay) home.",
        answers: ["isn't feeling", "is staying"],
        explanation:
          "We use the present continuous for temporary situations (isn't feeling) and for temporary arrangements (is staying).",
      },
    ],
  },
  {
    id: 2,
    title: "Past Simple vs. Past Continuous",
    description: "Fill in the blanks with the correct form of the verbs in parentheses.",
    questions: [
      {
        id: 1,
        sentence: "When the phone _____ (ring), I _____ (have) dinner.",
        answers: ["rang", "was having"],
        explanation:
          "We use the past simple (rang) for a completed action in the past that interrupted another action, and the past continuous (was having) for the action that was in progress.",
      },
      {
        id: 2,
        sentence: "She _____ (wait) for the bus when it started to rain, so she _____ (decide) to take a taxi.",
        answers: ["was waiting", "decided"],
        explanation:
          "We use the past continuous (was waiting) for an action in progress in the past, and the past simple (decided) for a completed action that happened afterward.",
      },
      {
        id: 3,
        sentence: "They _____ (watch) TV while their parents _____ (cook) dinner.",
        answers: ["were watching", "were cooking"],
        explanation: "We use the past continuous for two actions that were happening at the same time in the past.",
      },
      {
        id: 4,
        sentence: "I _____ (meet) my wife while I _____ (work) in Paris.",
        answers: ["met", "was working"],
        explanation:
          "We use the past simple (met) for a completed action in the past, and the past continuous (was working) for a longer action that was in progress.",
      },
      {
        id: 5,
        sentence: "When we _____ (arrive), the party already _____ (start).",
        answers: ["arrived", "had started"],
        explanation:
          "We use the past simple (arrived) for a completed action in the past, and the past perfect (had started) for an action that happened before another past action.",
      },
    ],
  },
  {
    id: 3,
    title: "Future Tenses",
    description:
      "Fill in the blanks with the correct form of the verbs in parentheses using appropriate future tenses.",
    questions: [
      {
        id: 1,
        sentence: "I _____ (call) you when I _____ (get) home.",
        answers: ["will call", "get"],
        explanation:
          "We use 'will' (will call) for a future promise or decision, and the present simple (get) in time clauses after 'when'.",
      },
      {
        id: 2,
        sentence: "This time tomorrow, I _____ (sit) on the beach in Hawaii.",
        answers: ["will be sitting"],
        explanation:
          "We use the future continuous (will be sitting) for an action that will be in progress at a specific time in the future.",
      },
      {
        id: 3,
        sentence: "By the end of this month, I _____ (work) here for five years.",
        answers: ["will have been working"],
        explanation:
          "We use the future perfect continuous (will have been working) for an action that will have been in progress for a period of time up to a point in the future.",
      },
      {
        id: 4,
        sentence: "The train _____ (leave) at 6 PM, so we need to hurry.",
        answers: ["leaves"],
        explanation: "We use the present simple (leaves) for scheduled future events like timetables.",
      },
      {
        id: 5,
        sentence: "She _____ (graduate) by the time we move to London.",
        answers: ["will have graduated"],
        explanation:
          "We use the future perfect (will have graduated) for an action that will be completed before another action in the future.",
      },
    ],
  },
  {
    id: 4,
    title: "Perfect Tenses",
    description: "Fill in the blanks with the correct perfect tense form of the verbs in parentheses.",
    questions: [
      {
        id: 1,
        sentence: "I _____ (live) in this city for ten years now.",
        answers: ["have lived"],
        explanation:
          "We use the present perfect (have lived) for an action that started in the past and continues to the present.",
      },
      {
        id: 2,
        sentence: "By the time he arrived, we _____ (finish) dinner.",
        answers: ["had finished"],
        explanation:
          "We use the past perfect (had finished) for an action that was completed before another action in the past.",
      },
      {
        id: 3,
        sentence: "She _____ (study) all day, so she's tired now.",
        answers: ["has been studying"],
        explanation:
          "We use the present perfect continuous (has been studying) for an action that started in the past, continued for a period of time, and has a result in the present.",
      },
      {
        id: 4,
        sentence: "By next year, they _____ (build) the new bridge.",
        answers: ["will have built"],
        explanation:
          "We use the future perfect (will have built) for an action that will be completed before a specific time in the future.",
      },
      {
        id: 5,
        sentence: "She was exhausted because she _____ (work) overtime for three weeks.",
        answers: ["had been working"],
        explanation:
          "We use the past perfect continuous (had been working) for an action that continued up to a point in the past and had a result.",
      },
    ],
  },
]

export default function VerbTensesPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(verbTensesExercises[currentExercise].questions[currentQuestion].answers.length).fill(""),
  )
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)

  const handleAnswerChange = (index: number, value: string) => {
    if (!isAnswerChecked) {
      const newAnswers = [...userAnswers]
      newAnswers[index] = value
      setUserAnswers(newAnswers)
    }
  }

  const checkAnswer = () => {
    const correctAnswers = verbTensesExercises[currentExercise].questions[currentQuestion].answers
    const correct = userAnswers.map(
      (answer, index) => answer.toLowerCase().trim() === correctAnswers[index].toLowerCase(),
    )

    setIsCorrect(correct)
    setIsAnswerChecked(true)
    setShowExplanation(true)

    // Add to score if all answers are correct
    if (correct.every((c) => c)) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setUserAnswers(
      Array(verbTensesExercises[currentExercise].questions[currentQuestion + 1]?.answers.length || 0).fill(""),
    )
    setIsAnswerChecked(false)
    setShowExplanation(false)

    if (currentQuestion < verbTensesExercises[currentExercise].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentExercise < verbTensesExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentQuestion(0)
    } else {
      setIsExerciseCompleted(true)
    }
  }

  const restartExercise = () => {
    setCurrentExercise(0)
    setCurrentQuestion(0)
    setUserAnswers(Array(verbTensesExercises[0].questions[0].answers.length).fill(""))
    setIsAnswerChecked(false)
    setShowExplanation(false)
    setScore(0)
    setIsExerciseCompleted(false)
  }

  // Calculate total questions across all exercises
  const totalQuestions = verbTensesExercises.reduce((total, exercise) => total + exercise.questions.length, 0)

  // Calculate completed questions
  let completedQuestions = 0
  for (let i = 0; i < currentExercise; i++) {
    completedQuestions += verbTensesExercises[i].questions.length
  }
  completedQuestions += currentQuestion

  const progress = (completedQuestions / totalQuestions) * 100

  // Parse the sentence to identify where the blanks should be
  const parseSentence = (sentence: string) => {
    const parts = sentence.split("_____")
    return parts
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Verb Tenses</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentExercise + 1} of {verbTensesExercises.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isExerciseCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{verbTensesExercises[currentExercise].title}</CardTitle>
              <CardDescription>{verbTensesExercises[currentExercise].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium">
                Question {currentQuestion + 1} of {verbTensesExercises[currentExercise].questions.length}
              </div>

              <div className="bg-muted p-4 rounded-md">
                {(() => {
                  const currentSentence = verbTensesExercises[currentExercise].questions[currentQuestion].sentence
                  const parts = parseSentence(currentSentence)
                  const verb = currentSentence.match(/$$([^)]+)$$/g)?.map((v) => v.slice(1, -1)) || []

                  return (
                    <div className="flex flex-wrap items-center gap-2">
                      {parts.map((part, index) => (
                        <React.Fragment key={index}>
                          <span>{part}</span>
                          {index < parts.length - 1 && (
                            <div className="inline-flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <Input
                                  value={userAnswers[index] || ""}
                                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                                  className={`w-40 ${
                                    isAnswerChecked
                                      ? isCorrect[index]
                                        ? "border-green-500 focus-visible:ring-green-500"
                                        : "border-red-500 focus-visible:ring-red-500"
                                      : ""
                                  }`}
                                  disabled={isAnswerChecked}
                                />
                                {isAnswerChecked &&
                                  (isCorrect[index] ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  ))}
                              </div>
                              <span className="text-xs text-muted-foreground">({verb[index]})</span>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )
                })()}
              </div>

              {showExplanation && (
                <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  <AlertDescription>
                    {verbTensesExercises[currentExercise].questions[currentQuestion].explanation}
                  </AlertDescription>
                </Alert>
              )}

              {isAnswerChecked && !isCorrect.every((c) => c) && (
                <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                  <AlertDescription>
                    <span className="font-medium">
                      Correct answer
                      {verbTensesExercises[currentExercise].questions[currentQuestion].answers.length > 1 ? "s" : ""}:
                    </span>{" "}
                    {verbTensesExercises[currentExercise].questions[currentQuestion].answers.map((answer, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        <span className="font-medium">{answer}</span>
                      </span>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerChecked ? (
                <Button onClick={checkAnswer} disabled={userAnswers.some((answer) => !answer.trim())}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {currentQuestion < verbTensesExercises[currentExercise].questions.length - 1
                    ? "Next Question"
                    : currentExercise < verbTensesExercises.length - 1
                      ? "Next Exercise"
                      : "Finish Exercise"}
                </Button>
              )}
              <div className="text-sm font-medium">
                Score: {score}/{totalQuestions}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Exercise Completed!</CardTitle>
              <CardDescription>You've completed all the verb tenses exercises.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-4">
                {score}/{totalQuestions}
              </div>
              <Progress value={(score / totalQuestions) * 100} className="h-2 mb-4" />
              <p className="text-muted-foreground">
                {score === totalQuestions
                  ? "Perfect score! You have an excellent understanding of verb tenses!"
                  : score >= totalQuestions * 0.8
                    ? "Great job! You have a strong grasp of verb tenses."
                    : score >= totalQuestions * 0.6
                      ? "Good effort! Keep practicing to improve your understanding of verb tenses."
                      : "Keep practicing to improve your understanding of verb tenses."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={restartExercise}>Restart Exercise</Button>
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
