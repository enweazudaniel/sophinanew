"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Volume2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getOrGenerateAudio } from "@/utils/audio-utils"

const pronunciationExercises = [
  {
    id: 1,
    word: "Hello",
    description: "A greeting used when meeting someone.",
    audioUrl: "/audio/hello.mp3",
    audioText: "Hello",
    difficulty: "Beginner",
    tips: ["Make sure your 'h' sound is clear and breathy", "The 'e' should be short", "End with a clear 'oh' sound"],
  },
  {
    id: 2,
    word: "Thank you",
    description: "An expression of gratitude.",
    audioUrl: "/audio/thank-you.mp3",
    audioText: "Thank you",
    difficulty: "Beginner",
    tips: [
      "The 'th' sound requires your tongue between your teeth",
      "The 'a' in 'thank' is flat",
      "The 'you' should sound like 'yoo'",
    ],
  },
  {
    id: 3,
    word: "Congratulations",
    description: "An expression used to praise someone for an achievement.",
    audioUrl: "/audio/congratulations.mp3",
    audioText: "Congratulations",
    difficulty: "Intermediate",
    tips: [
      "Stress is on the fourth syllable: con-gra-tu-LA-tions",
      "The 't' sounds should be clear",
      "Make sure to pronounce all syllables clearly",
    ],
  },
  {
    id: 4,
    word: "Opportunity",
    description: "A favorable time or circumstance for doing something.",
    audioUrl: "/audio/opportunity.mp3",
    audioText: "Opportunity",
    difficulty: "Intermediate",
    tips: [
      "Stress is on the third syllable: op-por-TU-ni-ty",
      "The 'pp' sound should be slightly emphasized",
      "The 'ty' at the end should be pronounced clearly",
    ],
  },
  {
    id: 5,
    word: "Particularly",
    description: "To a higher degree than is usual or average.",
    audioUrl: "/audio/particularly.mp3",
    audioText: "Particularly",
    difficulty: "Advanced",
    tips: [
      "Stress is on the second syllable: par-TI-cu-lar-ly",
      "The 'r' sounds should be slightly rolled",
      "Don't rush through the syllables",
    ],
  },
  {
    id: 6,
    word: "Entrepreneurship",
    description: "The activity of setting up a business or businesses.",
    audioUrl: "/audio/entrepreneurship.mp3",
    audioText: "Entrepreneurship",
    difficulty: "Advanced",
    tips: [
      "Break it down: en-tre-pre-NEUR-ship",
      "The 'eu' sound is like 'oo' in 'book'",
      "The 'ship' at the end should be crisp and clear",
    ],
  },
  {
    id: 7,
    word: "Phenomenon",
    description: "A fact or situation that is observed to exist or happen.",
    audioUrl: "/audio/phenomenon.mp3",
    audioText: "Phenomenon",
    difficulty: "Advanced",
    tips: [
      "The 'ph' sounds are pronounced as 'f'",
      "Stress is on the second syllable: phe-NO-me-non",
      "The 'o' sounds are short",
    ],
  },
  {
    id: 8,
    word: "Necessary",
    description: "Needed to be done, achieved, or present; essential.",
    audioUrl: "/audio/necessary.mp3",
    audioText: "Necessary",
    difficulty: "Intermediate",
    tips: [
      "Remember: one collar, two sleeves (one 'c', two 's's)",
      "The stress is on the first syllable: NE-ce-ssa-ry",
      "The 'c' is pronounced as 'k' and the 'ss' as 's'",
    ],
  },
]

export default function SpeakingPracticePage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null)
  const [showTips, setShowTips] = useState(false)
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
      setIsLoadingAudio(true)
      try {
        const url = await getOrGenerateAudio(
          pronunciationExercises[currentExercise].audioUrl,
          pronunciationExercises[currentExercise].audioText,
        )
        setAudioUrl(url)
      } catch (error) {
        console.error("Error loading audio:", error)
        // Fallback to the original URL if there's an error
        setAudioUrl(pronunciationExercises[currentExercise].audioUrl)
      } finally {
        setIsLoadingAudio(false)
      }
    }

    loadAudio()

    // Preload audio for the next exercise if available
    if (currentExercise < pronunciationExercises.length - 1) {
      getOrGenerateAudio(
        pronunciationExercises[currentExercise + 1].audioUrl,
        pronunciationExercises[currentExercise + 1].audioText,
      )
    }
  }, [currentExercise])

  const startRecording = async () => {
    audioChunksRef.current = []
    setFeedback(null)
    setConfidenceScore(null)

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

        // Simulate AI analysis of pronunciation
        simulateAIPronunciationAnalysis()
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

  const simulateAIPronunciationAnalysis = () => {
    // In a real app, this would be an API call to an AI service
    // For demo purposes, we'll generate random feedback

    // Random score between 60 and 100
    const score = Math.floor(Math.random() * 41) + 60
    setConfidenceScore(score)

    if (score >= 90) {
      setFeedback("Excellent pronunciation! Your pronunciation is very clear and accurate.")
    } else if (score >= 80) {
      setFeedback("Good pronunciation. Minor improvements could be made in rhythm and stress.")
    } else if (score >= 70) {
      setFeedback("Acceptable pronunciation. Try to focus on the stressed syllables.")
    } else {
      setFeedback("Your pronunciation needs practice. Try listening to the example again.")
    }
  }

  const playReferenceAudio = () => {
    // Stop any currently playing audio first
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
    }

    if (audioPlayerRef.current && audioUrl) {
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
      audioPlayerRef.current.onerror = () => setIsPlaying(false)

      // Set source and play
      audioPlayerRef.current.src = audioUrl
      audioPlayerRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
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
      setFeedback(null)
      setConfidenceScore(null)
      setShowTips(false)
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
    setFeedback(null)
    setConfidenceScore(null)
    setShowTips(false)
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
    // Initialize audio element
    audioPlayerRef.current = new Audio()

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
          <h1 className="text-3xl font-bold tracking-tight">Speaking Practice</h1>
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
                  disabled={isRecording || isLoadingAudio || !audioUrl}
                >
                  {isLoadingAudio ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Square className="h-5 w-5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5" />
                      Listen
                    </>
                  )}
                </Button>

                {!isRecording && !recordingComplete ? (
                  <Button
                    onClick={startRecording}
                    variant="primary"
                    size="lg"
                    className="flex gap-2"
                    disabled={isPlaying || isLoadingAudio}
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

              <Button variant="outline" onClick={() => setShowTips(!showTips)} className="w-full max-w-xs">
                {showTips ? "Hide Tips" : "Show Pronunciation Tips"}
              </Button>

              {showTips && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg w-full max-w-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Pronunciation Tips:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-400">
                    {pronunciationExercises[currentExercise].tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isRecording && (
                <div className="text-center animate-pulse">
                  <p className="text-primary font-medium">Recording...</p>
                  <p className="text-sm text-muted-foreground">Speak clearly into your microphone</p>
                </div>
              )}

              {recordingComplete && feedback && (
                <div className="text-center space-y-4 w-full max-w-md">
                  <p className="text-green-600 dark:text-green-400 font-medium">Recording complete!</p>

                  {confidenceScore !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pronunciation Score</span>
                        <span className="font-medium">{confidenceScore}%</span>
                      </div>
                      <Progress
                        value={confidenceScore}
                        className="h-2"
                        indicatorClassName={
                          confidenceScore >= 90
                            ? "bg-green-500"
                            : confidenceScore >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }
                      />
                    </div>
                  )}

                  <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                    <AlertDescription>{feedback}</AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setRecordingComplete(false)
                  setFeedback(null)
                  setConfidenceScore(null)
                  audioUrlRef.current = null
                }}
                disabled={!recordingComplete || isPlaying || isRecording}
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
              <CardDescription>You've completed the Speaking Practice exercise.</CardDescription>
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
