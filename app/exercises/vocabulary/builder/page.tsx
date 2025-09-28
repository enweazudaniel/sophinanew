"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AddToSRS } from "@/components/add-to-srs"
import Link from "next/link"
import { trackLessonCompletion } from "@/lib/lesson-tracking"

// Enhanced vocabulary words from "Language for Daily Use" by Harbrace Edition
const vocabularyWords = [
  {
    id: 1,
    word: "Abundant",
    definition: "Existing or available in large quantities; plentiful.",
    example: "There was abundant food at the party.",
    hint: "It starts with 'A' and means 'more than enough'.",
    context: "In daily conversation, we use this to describe when there's more than enough of something.",
  },
  {
    id: 2,
    word: "Benevolent",
    definition: "Kind, helpful, and generous.",
    example: "She was known for her benevolent nature, always helping those in need.",
    hint: "It starts with 'B' and describes someone who is kind and does good deeds.",
    context: "This word is often used to describe charitable people or organizations.",
  },
  {
    id: 3,
    word: "Concise",
    definition: "Giving a lot of information clearly and in a few words; brief but comprehensive.",
    example: "His concise explanation made the complex topic easy to understand.",
    hint: "It starts with 'C' and means 'short and clear'.",
    context: "In business communication, being concise is highly valued.",
  },
  {
    id: 4,
    word: "Diligent",
    definition: "Having or showing care and conscientiousness in one's work or duties.",
    example: "She was a diligent student who always completed her assignments on time.",
    hint: "It starts with 'D' and describes someone who works hard and is careful.",
    context: "Employers often look for diligent workers who pay attention to detail.",
  },
  {
    id: 5,
    word: "Eloquent",
    definition: "Fluent or persuasive in speaking or writing.",
    example: "His eloquent speech moved the entire audience.",
    hint: "It starts with 'E' and describes someone who speaks well and expressively.",
    context: "Politicians and public speakers strive to be eloquent to persuade their audience.",
  },
  {
    id: 6,
    word: "Frugal",
    definition: "Economical in use or expenditure; prudently saving or sparing; not wasteful.",
    example: "His frugal lifestyle allowed him to save enough for retirement.",
    hint: "It starts with 'F' and describes someone who is careful with money and resources.",
    context: "Being frugal is different from being cheap - it's about using resources wisely.",
  },
  {
    id: 7,
    word: "Gregarious",
    definition: "Fond of company; sociable.",
    example: "She has a gregarious personality and makes friends easily.",
    hint: "It starts with 'G' and describes someone who enjoys being with other people.",
    context: "In social settings, gregarious people often become the life of the party.",
  },
  {
    id: 8,
    word: "Hypothetical",
    definition: "Based on or serving as a hypothesis; supposed but not necessarily real or true.",
    example: "Let's consider a hypothetical situation where we have unlimited resources.",
    hint: "It starts with 'H' and refers to something that is assumed for the purpose of argument.",
    context: "In debates, people often use hypothetical scenarios to illustrate their points.",
  },
  {
    id: 9,
    word: "Innovative",
    definition: "Featuring new methods; advanced and original.",
    example: "The company is known for its innovative approach to problem-solving.",
    hint: "It starts with 'I' and describes something that is new and creative.",
    context: "In today's fast-paced world, businesses must be innovative to stay competitive.",
  },
  {
    id: 10,
    word: "Jubilant",
    definition: "Feeling or expressing great happiness and triumph.",
    example: "The team was jubilant after winning the championship.",
    hint: "It starts with 'J' and describes someone who is extremely happy or celebrating.",
    context: "People are often jubilant during celebrations like graduations or weddings.",
  },
]

// Lesson ID for vocabulary builder
const LESSON_ID = 5

export default function VocabularyBuilderPage() {
  const [currentWord, setCurrentWord] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [score, setScore] = useState(0)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [user, setUser] = useState<{ id: number } | null>(null)
  const [answers, setAnswers] = useState<Array<{ wordId: number; correct: boolean; answer: string }>>([])
  const startTimeRef = useRef<number>(Date.now())

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

    // Reset start time when component mounts
    startTimeRef.current = Date.now()
  }, [])

  const checkAnswer = () => {
    const isAnswerCorrect = userAnswer.toLowerCase() === vocabularyWords[currentWord].word.toLowerCase()
    setIsCorrect(isAnswerCorrect)
    setIsAnswerChecked(true)

    // Track this answer
    setAnswers((prev) => [
      ...prev,
      {
        wordId: vocabularyWords[currentWord].id,
        correct: isAnswerCorrect,
        answer: userAnswer,
      },
    ])

    if (isAnswerCorrect) {
      setScore(score + 1)
    }
  }

  const nextWord = () => {
    setUserAnswer("")
    setIsAnswerChecked(false)
    setShowHint(false)
    setShowContext(false)

    if (currentWord < vocabularyWords.length - 1) {
      setCurrentWord(currentWord + 1)
    } else {
      completeExercise()
    }
  }

  const completeExercise = async () => {
    setIsExerciseCompleted(true)

    // Calculate final score as percentage
    const finalScore = Math.round((score / vocabularyWords.length) * 100)

    // Calculate time spent in seconds
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)

    // Save completion data if user is logged in
    if (user?.id) {
      await trackLessonCompletion({
        studentId: user.id,
        lessonId: LESSON_ID,
        score: finalScore,
        timeSpent,
        answers,
      })
    }
  }

  const restartExercise = () => {
    setCurrentWord(0)
    setUserAnswer("")
    setIsAnswerChecked(false)
    setShowHint(false)
    setShowContext(false)
    setScore(0)
    setIsExerciseCompleted(false)
    setAnswers([])
    startTimeRef.current = Date.now()
  }

  const progress = ((currentWord + 1) / vocabularyWords.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Vocabulary Builder</h1>
          <div className="text-sm text-muted-foreground">
            Word {currentWord + 1} of {vocabularyWords.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isExerciseCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Guess the Word</CardTitle>
              <CardDescription>Read the definition and example, then type the word that matches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Definition:</Label>
                <p className="p-3 bg-muted rounded-md">{vocabularyWords[currentWord].definition}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Example:</Label>
                <p className="p-3 bg-muted rounded-md italic">"{vocabularyWords[currentWord].example}"</p>
              </div>

              {showContext && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Context:</Label>
                  <p className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    {vocabularyWords[currentWord].context}
                  </p>
                </div>
              )}

              {showHint && (
                <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                  <AlertDescription>
                    <span className="font-semibold">Hint:</span> {vocabularyWords[currentWord].hint}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 pt-4">
                <Label htmlFor="answer">Your Answer:</Label>
                <div className="flex gap-2">
                  <Input
                    id="answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type the word here"
                    disabled={isAnswerChecked}
                    className={
                      isAnswerChecked
                        ? isCorrect
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowHint(!showHint)}
                    disabled={isAnswerChecked}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isAnswerChecked && (
                <Button variant="outline" className="w-full" onClick={() => setShowContext(!showContext)}>
                  {showContext ? "Hide Context" : "Show Context"}
                </Button>
              )}

              {isAnswerChecked && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-md ${
                    isCorrect
                      ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Correct! Well done.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      <span>
                        Incorrect. The correct word is <strong>{vocabularyWords[currentWord].word}</strong>.
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Add to SRS button */}
              {user && isAnswerChecked && (
                <div className="flex justify-center mt-2">
                  <AddToSRS
                    studentId={user.id}
                    contentType="vocabulary"
                    contentId={vocabularyWords[currentWord].id}
                    frontContent={vocabularyWords[currentWord].word}
                    backContent={vocabularyWords[currentWord].definition}
                    example={vocabularyWords[currentWord].example}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerChecked ? (
                <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextWord}>
                  {currentWord < vocabularyWords.length - 1 ? "Next Word" : "Finish Exercise"}
                </Button>
              )}
              <div className="text-sm font-medium">
                Score: {score}/{vocabularyWords.length}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Exercise Completed!</CardTitle>
              <CardDescription>You've completed the Vocabulary Builder exercise.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-4">
                {score}/{vocabularyWords.length}
              </div>
              <Progress value={(score / vocabularyWords.length) * 100} className="h-2 mb-4" />
              <p className="text-muted-foreground">
                {score === vocabularyWords.length
                  ? "Perfect score! You have an excellent vocabulary!"
                  : score >= vocabularyWords.length * 0.8
                    ? "Great job! You have a strong vocabulary."
                    : score >= vocabularyWords.length * 0.6
                      ? "Good effort! Keep practicing to expand your vocabulary."
                      : "Keep practicing to improve your vocabulary skills."}
              </p>

              {user && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium">Continue Learning</h3>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/srs/review">Review Flashcards</Link>
                    </Button>
                    <Button variant="outline" onClick={restartExercise}>
                      Restart Exercise
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
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
