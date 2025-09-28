"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Volume2, Pause, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { getOrGenerateAudio } from "@/utils/audio-utils"

// Enhanced listening exercises with more content and fallback text for TTS
const listeningExercises = [
  {
    id: 1,
    title: "Conversation at a Restaurant",
    description: "Listen to the conversation and answer the questions.",
    audioUrl: "/audio/restaurant-conversation.mp3",
    audioText:
      "Waiter: Hello and welcome to our restaurant. Can I take your order? Woman: Yes, I'll have the grilled salmon, please. Waiter: Excellent choice. That comes with seasonal vegetables and rice. Woman: That sounds perfect. Man: I'll have the steak, medium rare, but no onions please. Waiter: Of course, sir. Would you like to try our special of the day? We have a delicious mushroom risotto. Woman: Maybe next time. Could we get some water for the table? Waiter: Right away. I'll be back with your drinks shortly.",
    questions: [
      {
        id: 1,
        question: "What does the woman order?",
        options: [
          { id: "a", text: "Steak" },
          { id: "b", text: "Chicken" },
          { id: "c", text: "Fish" },
          { id: "d", text: "Pasta" },
        ],
        correctAnswer: "c",
        explanation: "The woman says, 'I'll have the grilled salmon, please.'",
      },
      {
        id: 2,
        question: "What does the man ask for with his meal?",
        options: [
          { id: "a", text: "Extra sauce" },
          { id: "b", text: "No onions" },
          { id: "c", text: "A side salad" },
          { id: "d", text: "Water with lemon" },
        ],
        correctAnswer: "b",
        explanation: "The man specifically asks for no onions with his order.",
      },
      {
        id: 3,
        question: "What special does the waiter recommend?",
        options: [
          { id: "a", text: "Chocolate cake" },
          { id: "b", text: "Seafood pasta" },
          { id: "c", text: "Grilled chicken" },
          { id: "d", text: "Mushroom risotto" },
        ],
        correctAnswer: "d",
        explanation: "The waiter recommends the mushroom risotto as the special of the day.",
      },
    ],
  },
  // Other exercises remain the same...
]

export default function ListeningPracticePage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isAudioPlayed, setIsAudioPlayed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Load or generate audio when exercise changes
  useEffect(() => {
    const loadAudio = async () => {
      if (typeof window === "undefined") return // Skip on server-side

      setIsLoadingAudio(true)
      try {
        const url = await getOrGenerateAudio(
          listeningExercises[currentExercise].audioUrl,
          listeningExercises[currentExercise].audioText,
        )
        setAudioUrl(url)
      } catch (error) {
        console.error("Error loading audio:", error)
        // Fallback to a placeholder
        setAudioUrl("/api/audio-placeholder")
      } finally {
        setIsLoadingAudio(false)
      }
    }

    loadAudio()
  }, [currentExercise])

  const playAudio = () => {
    if (!audioUrl || !audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      return
    }

    audioRef.current.src = audioUrl
    audioRef.current.onended = () => {
      setIsPlaying(false)
      setIsAudioPlayed(true)
    }

    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error)
      // If there's an error playing the audio, mark it as played anyway
      setIsAudioPlayed(true)
      setIsPlaying(false)
    })

    setIsPlaying(true)
  }

  const handleAnswerSelection = (value: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(value)
    }
  }

  const checkAnswer = () => {
    setIsAnswerChecked(true)
    setShowExplanation(true)
    if (selectedAnswer === listeningExercises[currentExercise].questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setShowExplanation(false)

    if (currentQuestion < listeningExercises[currentExercise].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentExercise < listeningExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentQuestion(0)
      setIsAudioPlayed(false)
    } else {
      setIsExerciseCompleted(true)
    }
  }

  const restartExercise = () => {
    setCurrentExercise(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setShowExplanation(false)
    setScore(0)
    setIsAudioPlayed(false)
    setIsExerciseCompleted(false)
  }

  // Calculate total questions across all exercises
  const totalQuestions = listeningExercises.reduce((total, exercise) => total + exercise.questions.length, 0)

  // Calculate completed questions
  let completedQuestions = 0
  for (let i = 0; i < currentExercise; i++) {
    completedQuestions += listeningExercises[i].questions.length
  }
  completedQuestions += currentQuestion

  const progress = (completedQuestions / totalQuestions) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Listening Practice</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentExercise + 1} of {listeningExercises.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isExerciseCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{listeningExercises[currentExercise].title}</CardTitle>
              <CardDescription>{listeningExercises[currentExercise].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Button
                  onClick={playAudio}
                  size="lg"
                  className="flex gap-2 w-full max-w-xs"
                  disabled={isLoadingAudio || !audioUrl}
                >
                  {isLoadingAudio ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading Audio...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5" />
                      {isAudioPlayed ? "Play Audio Again" : "Play Audio"}
                    </>
                  )}
                </Button>
              </div>

              {!isAudioPlayed ? (
                <Alert>
                  <AlertDescription>Please listen to the audio before answering the questions.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="text-lg font-medium">
                    Question {currentQuestion + 1}:{" "}
                    {listeningExercises[currentExercise].questions[currentQuestion].question}
                  </div>

                  <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                    {listeningExercises[currentExercise].questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 rounded-md border p-4 ${
                          isAnswerChecked &&
                          option.id === listeningExercises[currentExercise].questions[currentQuestion].correctAnswer
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
                          {isAnswerChecked &&
                            option.id ===
                              listeningExercises[currentExercise].questions[currentQuestion].correctAnswer && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          {isAnswerChecked &&
                            option.id === selectedAnswer &&
                            option.id !==
                              listeningExercises[currentExercise].questions[currentQuestion].correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {showExplanation && (
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      <AlertDescription>
                        {listeningExercises[currentExercise].questions[currentQuestion].explanation}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerChecked ? (
                <Button onClick={checkAnswer} disabled={!selectedAnswer || !isAudioPlayed}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {currentQuestion < listeningExercises[currentExercise].questions.length - 1
                    ? "Next Question"
                    : currentExercise < listeningExercises.length - 1
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
              <CardDescription>You've completed all the listening exercises.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-4">
                {score}/{totalQuestions}
              </div>
              <Progress value={(score / totalQuestions) * 100} className="h-2 mb-4" />
              <p className="text-muted-foreground">
                {score === totalQuestions
                  ? "Perfect score! Excellent listening comprehension skills!"
                  : score >= totalQuestions * 0.8
                    ? "Great job! You have strong listening comprehension skills."
                    : score >= totalQuestions * 0.6
                      ? "Good effort! Keep practicing to improve your listening skills."
                      : "Keep practicing to improve your listening comprehension skills."}
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
