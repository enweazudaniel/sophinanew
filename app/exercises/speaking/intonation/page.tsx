"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Volume2, ArrowRight, ArrowLeft, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const intonationExercises = [
  {
    id: 1,
    title: "Questions",
    description: "Practice rising intonation for yes/no questions",
    level: "Beginner",
    examples: [
      {
        text: "Are you coming to the party?",
        audioUrl: "/audio/question-rising.mp3", // This would be a real audio file in production
        intonationType: "Rising",
        explanation: "Yes/no questions typically use rising intonation at the end of the sentence.",
      },
      {
        text: "Where are you going?",
        audioUrl: "/audio/question-falling.mp3",
        intonationType: "Falling",
        explanation: "Information questions (wh-questions) typically use falling intonation.",
      },
      {
        text: "Do you like coffee?",
        audioUrl: "/audio/question-rising2.mp3",
        intonationType: "Rising",
        explanation: "Yes/no questions that start with an auxiliary verb use rising intonation.",
      },
    ],
  },
  {
    id: 2,
    title: "Statements",
    description: "Practice falling intonation for statements",
    level: "Beginner",
    examples: [
      {
        text: "I'm going to the store.",
        audioUrl: "/audio/statement-falling.mp3",
        intonationType: "Falling",
        explanation: "Statements typically use falling intonation at the end of the sentence.",
      },
      {
        text: "It's a beautiful day today.",
        audioUrl: "/audio/statement-falling2.mp3",
        intonationType: "Falling",
        explanation: "Declarative statements use falling intonation to indicate completion.",
      },
      {
        text: "We finished the project yesterday.",
        audioUrl: "/audio/statement-falling3.mp3",
        intonationType: "Falling",
        explanation: "Past tense statements follow the same pattern of falling intonation.",
      },
    ],
  },
  {
    id: 3,
    title: "Expressing Surprise",
    description: "Practice rising-falling intonation for expressing surprise",
    level: "Intermediate",
    examples: [
      {
        text: "Really?!",
        audioUrl: "/audio/surprise-rising-falling.mp3",
        intonationType: "Rising-Falling",
        explanation: "Expressions of surprise often use a rising-falling intonation pattern.",
      },
      {
        text: "You won the lottery?!",
        audioUrl: "/audio/surprise-rising-falling2.mp3",
        intonationType: "Rising-Falling",
        explanation: "When expressing disbelief or surprise, the voice rises and then falls.",
      },
      {
        text: "No way!",
        audioUrl: "/audio/surprise-rising-falling3.mp3",
        intonationType: "Rising-Falling",
        explanation: "Short exclamations of surprise typically have a dramatic rise and fall in pitch.",
      },
    ],
  },
  {
    id: 4,
    title: "Lists",
    description: "Practice rising intonation for items in a list",
    level: "Intermediate",
    examples: [
      {
        text: "I need to buy apples, oranges, bananas, and grapes.",
        audioUrl: "/audio/list-rising.mp3",
        intonationType: "Rising (except last item)",
        explanation: "Items in a list use rising intonation, except for the last item which uses falling intonation.",
      },
      {
        text: "You can choose red, blue, green, or yellow.",
        audioUrl: "/audio/list-rising2.mp3",
        intonationType: "Rising (except last item)",
        explanation:
          "Rising intonation on list items indicates continuation, while the falling intonation on the last item signals completion.",
      },
      {
        text: "We offer courses in English, Spanish, French, and German.",
        audioUrl: "/audio/list-rising3.mp3",
        intonationType: "Rising (except last item)",
        explanation:
          "The rising tone on each item except the last creates a rhythm that helps listeners follow the list.",
      },
    ],
  },
  {
    id: 5,
    title: "Tag Questions",
    description: "Practice intonation patterns in tag questions",
    level: "Intermediate",
    examples: [
      {
        text: "It's cold today, isn't it?",
        audioUrl: "/audio/tag-rising.mp3",
        intonationType: "Rising on tag",
        explanation:
          "When the speaker is uncertain and genuinely asking for confirmation, the tag has rising intonation.",
      },
      {
        text: "You're John, aren't you?",
        audioUrl: "/audio/tag-falling.mp3",
        intonationType: "Falling on tag",
        explanation: "When the speaker is fairly certain and just seeking agreement, the tag has falling intonation.",
      },
      {
        text: "She doesn't live here, does she?",
        audioUrl: "/audio/tag-rising2.mp3",
        intonationType: "Rising on tag",
        explanation: "Rising intonation on negative tags often indicates the speaker expects a negative answer.",
      },
    ],
  },
  {
    id: 6,
    title: "Emphasis and Contrast",
    description: "Practice using intonation for emphasis and contrast",
    level: "Advanced",
    examples: [
      {
        text: "I wanted the RED book, not the blue one.",
        audioUrl: "/audio/emphasis1.mp3",
        intonationType: "Emphasis on key word",
        explanation: "The emphasized word receives higher pitch and stronger stress to highlight its importance.",
      },
      {
        text: "SHE wrote the report, not him.",
        audioUrl: "/audio/emphasis2.mp3",
        intonationType: "Contrastive stress",
        explanation: "When contrasting two elements, the first element receives strong emphasis with higher pitch.",
      },
      {
        text: "I LOVE this movie, even though it's old.",
        audioUrl: "/audio/emphasis3.mp3",
        intonationType: "Emphasis for emotion",
        explanation:
          "Words that express strong emotions often receive extra emphasis through higher pitch and longer duration.",
      },
    ],
  },
]

export default function IntonationPracticePage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)
  const exampleAudioRef = useRef<HTMLAudioElement | null>(null)
  const userAudioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    // Stop any playing audio before recording
    stopAllAudio()

    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        audioUrlRef.current = audioUrl
        setRecordingComplete(true)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 8 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording()
        }
      }, 8000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setPermissionDenied(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const stopAllAudio = () => {
    // Stop example audio if playing
    if (exampleAudioRef.current) {
      exampleAudioRef.current.pause()
      exampleAudioRef.current.currentTime = 0
    }

    // Stop user recording if playing
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
    }

    setIsPlaying(false)
  }

  const playRecording = () => {
    // If already playing, stop it
    if (isPlaying) {
      stopAllAudio()
      return
    }

    // Stop example audio if playing
    if (exampleAudioRef.current) {
      exampleAudioRef.current.pause()
      exampleAudioRef.current.currentTime = 0
    }

    if (audioUrlRef.current) {
      if (!userAudioRef.current) {
        userAudioRef.current = new Audio()
      }

      // Set up event listeners
      userAudioRef.current.onplay = () => setIsPlaying(true)
      userAudioRef.current.onended = () => setIsPlaying(false)
      userAudioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsPlaying(false)
      }

      userAudioRef.current.src = audioUrlRef.current

      // Use a promise to handle play() properly
      const playPromise = userAudioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            console.error("Error playing recording:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  const playExampleAudio = () => {
    // If already playing, stop it
    if (isPlaying) {
      stopAllAudio()
      return
    }

    // Stop user recording if playing
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
    }

    if (exampleAudioRef.current) {
      // Set up event listeners
      exampleAudioRef.current.onplay = () => setIsPlaying(true)
      exampleAudioRef.current.onended = () => setIsPlaying(false)
      exampleAudioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsPlaying(false)
      }

      exampleAudioRef.current.src = intonationExercises[currentExercise].examples[currentExample].audioUrl

      // Use a promise to handle play() properly
      const playPromise = exampleAudioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            console.error("Error playing example audio:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  const nextExample = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentExample < intonationExercises[currentExercise].examples.length - 1) {
      setCurrentExample(currentExample + 1)
      resetState()
    } else if (currentExercise < intonationExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentExample(0)
      resetState()
    }
  }

  const previousExample = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentExample > 0) {
      setCurrentExample(currentExample - 1)
      resetState()
    } else if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setCurrentExample(intonationExercises[currentExercise - 1].examples.length - 1)
      resetState()
    }
  }

  const resetState = () => {
    setRecordingComplete(false)
    setShowExplanation(false)

    // Clean up previous audio URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  useEffect(() => {
    // Initialize audio elements
    exampleAudioRef.current = new Audio()
    userAudioRef.current = new Audio()

    // Cleanup function
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }

      // Clean up audio elements
      if (exampleAudioRef.current) {
        exampleAudioRef.current.pause()
        exampleAudioRef.current.src = ""
      }

      if (userAudioRef.current) {
        userAudioRef.current.pause()
        userAudioRef.current.src = ""
      }
    }
  }, [])

  // Calculate overall progress
  const totalExamples = intonationExercises.reduce((sum, exercise) => sum + exercise.examples.length, 0)
  let completedExamples = 0

  for (let i = 0; i < currentExercise; i++) {
    completedExamples += intonationExercises[i].examples.length
  }
  completedExamples += currentExample

  const progress = (completedExamples / totalExamples) * 100

  const currentExerciseData = intonationExercises[currentExercise]
  const currentExampleData = currentExerciseData.examples[currentExample]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Intonation Practice</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentExercise + 1} of {intonationExercises.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {permissionDenied && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>
              Microphone access was denied. Please allow microphone access to use this feature.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{currentExerciseData.title}</CardTitle>
              <Badge className={getLevelColor(currentExerciseData.level)}>{currentExerciseData.level}</Badge>
            </div>
            <CardDescription>{currentExerciseData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Intonation Type: {currentExampleData.intonationType}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Show explanation</span>
                </Button>
              </div>
              <p className="text-xl font-medium text-center">{currentExampleData.text}</p>

              {showExplanation && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-300">
                  {currentExampleData.explanation}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={playExampleAudio} variant="outline" className="flex gap-2" disabled={isRecording}>
                <Volume2 className="h-5 w-5" />
                {isPlaying ? "Stop" : "Listen to Example"}
              </Button>

              {!isRecording && !recordingComplete ? (
                <Button onClick={startRecording} className="flex gap-2" disabled={isPlaying}>
                  <Mic className="h-5 w-5" />
                  Record Your Try
                </Button>
              ) : isRecording ? (
                <Button onClick={stopRecording} variant="destructive" className="flex gap-2">
                  <Square className="h-5 w-5" />
                  Stop
                </Button>
              ) : (
                <Button onClick={playRecording} variant="secondary" className="flex gap-2">
                  <Play className="h-5 w-5" />
                  {isPlaying ? "Stop" : "Play Your Recording"}
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="text-center animate-pulse">
                <p className="text-primary font-medium">Recording...</p>
                <p className="text-sm text-muted-foreground">Try to match the intonation pattern</p>
              </div>
            )}

            {recordingComplete && (
              <div className="text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">Recording complete!</p>
                <p className="text-sm text-muted-foreground">
                  Listen to your recording and compare it with the example
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={previousExample}
              variant="outline"
              disabled={(currentExercise === 0 && currentExample === 0) || isRecording || isPlaying}
              className="flex gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={() => {
                stopAllAudio()
                setRecordingComplete(false)

                // Clean up previous audio URL
                if (audioUrlRef.current) {
                  URL.revokeObjectURL(audioUrlRef.current)
                  audioUrlRef.current = null
                }
              }}
              variant="secondary"
              disabled={!recordingComplete || isRecording || isPlaying}
            >
              Try Again
            </Button>
            <Button
              onClick={nextExample}
              disabled={
                (currentExercise === intonationExercises.length - 1 &&
                  currentExample === intonationExercises[currentExercise].examples.length - 1) ||
                isRecording ||
                isPlaying
              }
              className="flex gap-1"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </DashboardShell>
    </div>
  )
}
