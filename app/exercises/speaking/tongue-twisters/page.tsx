"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, ArrowRight, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const tongueTwisters = [
  {
    id: 1,
    text: "She sells seashells by the seashore.",
    difficulty: "Easy",
    tip: "Focus on the 's' and 'sh' sounds. Start slowly and gradually increase your speed.",
    targetSound: "s/sh",
  },
  {
    id: 2,
    text: "Peter Piper picked a peck of pickled peppers.",
    difficulty: "Medium",
    tip: "Pay attention to the 'p' sound. Try to maintain clarity even as you speed up.",
    targetSound: "p",
  },
  {
    id: 3,
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    difficulty: "Medium",
    tip: "Focus on the 'w' and 'ch' sounds. Break it into smaller parts if needed.",
    targetSound: "w/ch",
  },
  {
    id: 4,
    text: "Unique New York, unique New York, you know you need unique New York.",
    difficulty: "Hard",
    tip: "The transition between 'unique' and 'New' is challenging. Practice this junction specifically.",
    targetSound: "n/y",
  },
  {
    id: 5,
    text: "Six slick slim sycamore saplings.",
    difficulty: "Hard",
    tip: "The combination of 's' and 'l' sounds makes this particularly challenging. Start very slowly.",
    targetSound: "s/l",
  },
  {
    id: 6,
    text: "Red lorry, yellow lorry, red lorry, yellow lorry.",
    difficulty: "Hard",
    tip: "The alternating 'r' and 'l' sounds are tricky. Focus on clear pronunciation of each word.",
    targetSound: "r/l",
  },
  {
    id: 7,
    text: "Betty bought a bit of better butter to make her batter better.",
    difficulty: "Medium",
    tip: "Focus on the 'b' and 't' sounds. Make sure to pronounce each 't' clearly.",
    targetSound: "b/t",
  },
  {
    id: 8,
    text: "I scream, you scream, we all scream for ice cream.",
    difficulty: "Easy",
    tip: "The challenge is in the transition between 'I scream' and 'ice cream'. Try to differentiate them.",
    targetSound: "s/c",
  },
  {
    id: 9,
    text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    difficulty: "Hard",
    tip: "Focus on the 'th' sound. Make sure your tongue is between your teeth for this sound.",
    targetSound: "th",
  },
  {
    id: 10,
    text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn't fuzzy, was he?",
    difficulty: "Medium",
    tip: "The 'z' and 'w' sounds are the focus here. Try to keep them distinct.",
    targetSound: "z/w",
  },
  {
    id: 11,
    text: "A proper copper coffee pot.",
    difficulty: "Medium",
    tip: "The 'p' and 'k' sounds require different mouth positions. Practice transitioning between them.",
    targetSound: "p/k",
  },
  {
    id: 12,
    text: "She stood on the balcony, inexplicably mimicking him hiccuping, and amicably welcoming him in.",
    difficulty: "Hard",
    tip: "Focus on the rhythm and the 'ing' endings. Try to maintain a steady pace.",
    targetSound: "ing",
  },
]

export default function TongueTwistersPage() {
  const [currentTwister, setCurrentTwister] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)
  const userAudioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    // Stop any playing audio before recording
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
      setIsPlaying(false)
    }

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
        setAttempts(attempts + 1)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording()
        }
      }, 10000)
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

  const playRecording = () => {
    if (isPlaying) {
      if (userAudioRef.current) {
        userAudioRef.current.pause()
        userAudioRef.current.currentTime = 0
        setIsPlaying(false)
      }
      return
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

  const nextTwister = () => {
    // Stop any playing audio before moving to next twister
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
      setIsPlaying(false)
    }

    if (currentTwister < tongueTwisters.length - 1) {
      setCurrentTwister(currentTwister + 1)
      resetExerciseState()
    }
  }

  const previousTwister = () => {
    // Stop any playing audio before moving to previous twister
    if (userAudioRef.current) {
      userAudioRef.current.pause()
      userAudioRef.current.currentTime = 0
      setIsPlaying(false)
    }

    if (currentTwister > 0) {
      setCurrentTwister(currentTwister - 1)
      resetExerciseState()
    }
  }

  const resetExerciseState = () => {
    setRecordingComplete(false)
    setAttempts(0)
    setShowTip(false)

    // Clean up previous audio URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  useEffect(() => {
    // Initialize audio element
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

      // Clean up audio element
      if (userAudioRef.current) {
        userAudioRef.current.pause()
        userAudioRef.current.src = ""
      }
    }
  }, [])

  const progress = ((currentTwister + 1) / tongueTwisters.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tongue Twisters</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentTwister + 1} of {tongueTwisters.length}
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
              <CardTitle className="text-2xl">Practice Tongue Twisters</CardTitle>
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(tongueTwisters[currentTwister].difficulty)}>
                  {tongueTwisters[currentTwister].difficulty}
                </Badge>
                <Badge variant="outline">Target: {tongueTwisters[currentTwister].targetSound}</Badge>
              </div>
            </div>
            <CardDescription>
              Tongue twisters help improve pronunciation and fluency. Try to say them clearly and quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-xl font-medium">{tongueTwisters[currentTwister].text}</p>
            </div>

            {showTip && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Tip:</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">{tongueTwisters[currentTwister].tip}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowTip(!showTip)} variant="outline" className="flex gap-2">
                {showTip ? "Hide Tip" : "Show Tip"}
              </Button>

              {!isRecording && !recordingComplete ? (
                <Button onClick={startRecording} className="flex gap-2" disabled={isPlaying}>
                  <Mic className="h-5 w-5" />
                  Record
                </Button>
              ) : isRecording ? (
                <Button onClick={stopRecording} variant="destructive" className="flex gap-2">
                  <Square className="h-5 w-5" />
                  Stop
                </Button>
              ) : (
                <Button onClick={playRecording} variant="secondary" className="flex gap-2">
                  <Play className="h-5 w-5" />
                  {isPlaying ? "Stop" : "Play Recording"}
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="text-center animate-pulse">
                <p className="text-primary font-medium">Recording...</p>
                <p className="text-sm text-muted-foreground">Try to say the tongue twister clearly and quickly</p>
              </div>
            )}

            {recordingComplete && (
              <div className="text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">Recording complete!</p>
                <p className="text-sm text-muted-foreground">
                  Attempt {attempts} - Listen to your recording and try again to improve
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                onClick={previousTwister}
                variant="outline"
                disabled={currentTwister === 0 || isRecording || isPlaying}
                className="flex gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={nextTwister}
                variant="outline"
                disabled={currentTwister === tongueTwisters.length - 1 || isRecording || isPlaying}
                className="flex gap-1"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => {
                // Stop any playing audio
                if (userAudioRef.current) {
                  userAudioRef.current.pause()
                  userAudioRef.current.currentTime = 0
                  setIsPlaying(false)
                }

                setRecordingComplete(false)
                setAttempts(0)

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
          </CardFooter>
        </Card>
      </DashboardShell>
    </div>
  )
}
