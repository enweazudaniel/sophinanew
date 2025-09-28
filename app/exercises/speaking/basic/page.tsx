"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Volume2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getOrGenerateAudio } from "@/utils/audio-utils"

const pronunciationExercises = [
  {
    id: 1,
    word: "Hello",
    description: "A greeting used when meeting someone.",
    audioUrl: "/audio/hello.mp3", // This would be a real audio file in production
    audioText: "Hello",
    difficulty: "Beginner",
  },
  {
    id: 2,
    word: "Thank you",
    description: "An expression of gratitude.",
    audioUrl: "/audio/thank-you.mp3",
    audioText: "Thank you",
    difficulty: "Beginner",
  },
  {
    id: 3,
    word: "Goodbye",
    description: "A farewell expression used when leaving.",
    audioUrl: "/audio/goodbye.mp3",
    audioText: "Goodbye",
    difficulty: "Beginner",
  },
  {
    id: 4,
    word: "Please",
    description: "Used when making a request or asking for something politely.",
    audioUrl: "/audio/please.mp3",
    audioText: "Please",
    difficulty: "Beginner",
  },
  {
    id: 5,
    word: "Excuse me",
    description: "Used to get someone's attention or apologize for a minor disturbance.",
    audioUrl: "/audio/excuse-me.mp3",
    audioText: "Excuse me",
    difficulty: "Beginner",
  },
  {
    id: 6,
    word: "Congratulations",
    description: "An expression used to praise someone for an achievement.",
    audioUrl: "/audio/congratulations.mp3",
    audioText: "Congratulations",
    difficulty: "Intermediate",
  },
  {
    id: 7,
    word: "Unfortunately",
    description: "Used to express regret or disappointment.",
    audioUrl: "/audio/unfortunately.mp3",
    audioText: "Unfortunately",
    difficulty: "Intermediate",
  },
  {
    id: 8,
    word: "Necessary",
    description: "Something that is required or needed.",
    audioUrl: "/audio/necessary.mp3",
    audioText: "Necessary",
    difficulty: "Intermediate",
  },
  {
    id: 9,
    word: "Particularly",
    description: "To a higher degree than is usual or average.",
    audioUrl: "/audio/particularly.mp3",
    audioText: "Particularly",
    difficulty: "Advanced",
  },
  {
    id: 10,
    word: "Phenomenon",
    description: "A fact or situation that is observed to exist or happen.",
    audioUrl: "/audio/phenomenon.mp3",
    audioText: "Phenomenon",
    difficulty: "Advanced",
  },
]

export default function SpeakingBasicPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const userAudioRef = useRef<HTMLAudioElement | null>(null)

  // Load or generate audio when exercise changes
  useEffect(() => {
    const loadAudio = async () => {
      if (typeof window === "undefined") return // Skip on server-side

      setIsLoadingAudio(true)
      try {
        const url = await getOrGenerateAudio(
          pronunciationExercises[currentExercise].audioUrl,
          pronunciationExercises[currentExercise].audioText,
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

  const startRecording = async () => {
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

      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording()
        }
      }, 5000)
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

  const playReferenceAudio = () => {
    // Stop any currently playing audio first
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
    }

    if (audioPlayerRef.current) {
      // Stop current playback if it's already playing
      if (isPlaying) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.currentTime = 0
        setIsPlaying(false)
        return
      }

      // Set up event listeners
      audioPlayerRef.current.onplay = () => setIsPlaying(true)
      audioPlayerRef.current.onended = () => setIsPlaying(false)
      audioPlayerRef.current.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsPlaying(false)
      }

      // Set source and play
      if (audioUrl) {
        audioPlayerRef.current.src = audioUrl
      } else {
        audioPlayerRef.current.src = pronunciationExercises[currentExercise].audioUrl
      }

      // Use a promise to handle play() properly
      const playPromise = audioPlayerRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  const playUserRecording = () => {
    // Stop reference audio if it's playing
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
      setIsPlaying(false)
    }

    if (audioUrlRef.current) {
      if (!userAudioRef.current) {
        userAudioRef.current = new Audio()
      }

      userAudioRef.current.src = audioUrlRef.current
      userAudioRef.current.play().catch((error) => {
        console.error("Error playing user recording:", error)
      })
    }
  }

  const nextExercise = () => {
    // Stop any playing audio before moving to next exercise
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
      setIsPlaying(false)
    }

    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
    }

    if (currentExercise < pronunciationExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setRecordingComplete(false)
      audioUrlRef.current = null
      setProgress(((currentExercise + 1) / pronunciationExercises.length) * 100)
    } else {
      setExerciseComplete(true)
    }
  }

  const restartExercise = () => {
    // Stop any playing audio before restarting
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
      setIsPlaying(false)
    }

    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
    }

    setCurrentExercise(0)
    setRecordingComplete(false)
    setProgress(0)
    setExerciseComplete(false)
    audioUrlRef.current = null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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
    if (typeof window !== "undefined") {
      audioPlayerRef.current = new Audio()
    }

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
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ""
      }

      if (userAudioRef.current) {
        userAudioRef.current.pause()
        userAudioRef.current.src = ""
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Basic Pronunciation</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentExercise + 1} of {pronunciationExercises.length}
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

        {!exerciseComplete ? (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl text-center">{pronunciationExercises[currentExercise].word}</CardTitle>
                <Badge className={getDifficultyColor(pronunciationExercises[currentExercise].difficulty)}>
                  {pronunciationExercises[currentExercise].difficulty}
                </Badge>
              </div>
              <CardDescription className="text-center">
                {pronunciationExercises[currentExercise].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="flex gap-4">
                <Button
                  onClick={playReferenceAudio}
                  variant="outline"
                  size="lg"
                  className="flex gap-2"
                  disabled={isRecording || isLoadingAudio}
                >
                  <Volume2 className="h-5 w-5" />
                  {isPlaying ? "Stop" : "Listen"}
                </Button>

                {!isRecording && !recordingComplete ? (
                  <Button
                    onClick={startRecording}
                    variant="primary"
                    size="lg"
                    className="flex gap-2"
                    disabled={isPlaying}
                  >
                    <Mic className="h-5 w-5" />
                    Record
                  </Button>
                ) : isRecording ? (
                  <Button onClick={stopRecording} variant="destructive" size="lg" className="flex gap-2">
                    <Square className="h-5 w-5" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={playUserRecording}
                    variant="secondary"
                    size="lg"
                    className="flex gap-2"
                    disabled={isPlaying}
                  >
                    <Play className="h-5 w-5" />
                    Play Recording
                  </Button>
                )}
              </div>

              {isRecording && (
                <div className="text-center animate-pulse">
                  <p className="text-primary font-medium">Recording...</p>
                  <p className="text-sm text-muted-foreground">Speak clearly into your microphone</p>
                </div>
              )}

              {recordingComplete && (
                <div className="text-center">
                  <p className="text-green-600 dark:text-green-400 font-medium">Recording complete!</p>
                  <p className="text-sm text-muted-foreground">Listen to your recording and try again if needed</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setRecordingComplete(false)
                  audioUrlRef.current = null
                }}
                disabled={!recordingComplete || isPlaying}
              >
                Try Again
              </Button>
              <Button onClick={nextExercise} disabled={!recordingComplete || isPlaying || isRecording}>
                {currentExercise < pronunciationExercises.length - 1 ? "Next Word" : "Finish Exercise"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Exercise Completed!</CardTitle>
              <CardDescription>You've completed the Basic Pronunciation exercise.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-4">
                {pronunciationExercises.length}/{pronunciationExercises.length}
              </div>
              <Progress value={100} className="h-2 mb-4" />
              <p className="text-muted-foreground">
                Great job practicing your pronunciation! Regular practice will help improve your speaking skills.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={restartExercise}>Restart Exercise</Button>
              <Button variant="outline" href="/exercises">
                Back to Exercises
              </Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
