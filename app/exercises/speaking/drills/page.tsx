"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Volume2, ArrowRight, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pronunciationDrills = [
  {
    id: 1,
    title: "Th Sound",
    description: "Practice the 'th' sound in English",
    level: "Beginner",
    examples: [
      {
        word: "Think",
        audioUrl: "/audio/think.mp3", // This would be a real audio file in production
        tip: "Place your tongue between your teeth and blow air out to make the 'th' sound.",
      },
      {
        word: "Three",
        audioUrl: "/audio/three.mp3",
        tip: "Make sure your tongue is visible between your teeth for the 'th' sound.",
      },
      {
        word: "Thumb",
        audioUrl: "/audio/thumb.mp3",
        tip: "The 'th' in this word is unvoiced - no vibration in your throat.",
      },
      {
        word: "The",
        audioUrl: "/audio/the.mp3",
        tip: "The 'th' in this word is voiced - you should feel vibration in your throat.",
      },
      {
        word: "They",
        audioUrl: "/audio/they.mp3",
        tip: "Another voiced 'th' sound - your vocal cords should vibrate.",
      },
    ],
  },
  {
    id: 2,
    title: "R Sound",
    description: "Practice the American 'r' sound",
    level: "Intermediate",
    examples: [
      {
        word: "Red",
        audioUrl: "/audio/red.mp3",
        tip: "Curl your tongue back slightly without touching the roof of your mouth.",
      },
      {
        word: "Right",
        audioUrl: "/audio/right.mp3",
        tip: "Keep your lips rounded when making the 'r' sound.",
      },
      {
        word: "Around",
        audioUrl: "/audio/around.mp3",
        tip: "The 'r' sound should be smooth, not trilled or rolled.",
      },
      {
        word: "Car",
        audioUrl: "/audio/car.mp3",
        tip: "In American English, the 'r' at the end of words is pronounced clearly.",
      },
      {
        word: "World",
        audioUrl: "/audio/world.mp3",
        tip: "This combines 'r' with 'l' - make sure both sounds are distinct.",
      },
    ],
  },
  {
    id: 3,
    title: "L Sound",
    description: "Practice the 'l' sound in different positions",
    level: "Beginner",
    examples: [
      {
        word: "Light",
        audioUrl: "/audio/light.mp3",
        tip: "Touch the tip of your tongue to the ridge behind your upper teeth.",
      },
      {
        word: "Blue",
        audioUrl: "/audio/blue.mp3",
        tip: "For 'l' in consonant clusters, make a quick tongue tap.",
      },
      {
        word: "Fall",
        audioUrl: "/audio/fall.mp3",
        tip: "For the 'l' at the end of words, your tongue should still touch the ridge.",
      },
      {
        word: "Bottle",
        audioUrl: "/audio/bottle.mp3",
        tip: "In words like 'bottle', the 'l' is often syllabic - it forms its own syllable.",
      },
      {
        word: "Clearly",
        audioUrl: "/audio/clearly.mp3",
        tip: "Make sure the 'l' and 'r' sounds are distinct from each other.",
      },
    ],
  },
  {
    id: 4,
    title: "V and W Sounds",
    description: "Practice distinguishing between 'v' and 'w' sounds",
    level: "Intermediate",
    examples: [
      {
        word: "Very",
        audioUrl: "/audio/very.mp3",
        tip: "For 'v', your bottom lip should touch your upper teeth.",
      },
      {
        word: "Wine",
        audioUrl: "/audio/wine.mp3",
        tip: "For 'w', round your lips without touching your teeth.",
      },
      {
        word: "Vest",
        audioUrl: "/audio/vest.mp3",
        tip: "Feel the vibration when making the 'v' sound.",
      },
      {
        word: "West",
        audioUrl: "/audio/west.mp3",
        tip: "Compare 'vest' and 'west' - notice the different mouth positions.",
      },
      {
        word: "Vow",
        audioUrl: "/audio/vow.mp3",
        tip: "This word contains both 'v' and 'w' sounds - practice the transition.",
      },
    ],
  },
  {
    id: 5,
    title: "Short and Long Vowels",
    description: "Practice distinguishing between short and long vowel sounds",
    level: "Intermediate",
    examples: [
      {
        word: "Bit vs. Beat",
        audioUrl: "/audio/bit-beat.mp3",
        tip: "For 'bit', the vowel is short. For 'beat', the vowel is long.",
      },
      {
        word: "Cut vs. Cart",
        audioUrl: "/audio/cut-cart.mp3",
        tip: "Notice how your mouth opens wider for 'cart'.",
      },
      {
        word: "Not vs. Note",
        audioUrl: "/audio/not-note.mp3",
        tip: "For 'note', your lips should round more and the vowel is longer.",
      },
      {
        word: "Sit vs. Seat",
        audioUrl: "/audio/sit-seat.mp3",
        tip: "The position of your tongue changes between these two vowels.",
      },
      {
        word: "Pull vs. Pool",
        audioUrl: "/audio/pull-pool.mp3",
        tip: "For 'pool', your lips should be more rounded and the vowel is longer.",
      },
    ],
  },
  {
    id: 6,
    title: "Consonant Clusters",
    description: "Practice difficult consonant combinations",
    level: "Advanced",
    examples: [
      {
        word: "Strengths",
        audioUrl: "/audio/strengths.mp3",
        tip: "Break this down into smaller parts: 's-t-r-eng-th-s'.",
      },
      {
        word: "Sixths",
        audioUrl: "/audio/sixths.mp3",
        tip: "Focus on the 'ks-th-s' combination at the end.",
      },
      {
        word: "Splashed",
        audioUrl: "/audio/splashed.mp3",
        tip: "Practice the 'spl' at the beginning and 'sht' at the end.",
      },
      {
        word: "Texts",
        audioUrl: "/audio/texts.mp3",
        tip: "The 'ksts' combination requires careful articulation.",
      },
      {
        word: "Glimpsed",
        audioUrl: "/audio/glimpsed.mp3",
        tip: "The 'mpst' combination in the middle is challenging.",
      },
    ],
  },
]

export default function PronunciationDrillsPage() {
  const [currentDrill, setCurrentDrill] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [activeTab, setActiveTab] = useState("practice")

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

      exampleAudioRef.current.src = pronunciationDrills[currentDrill].examples[currentExample].audioUrl

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

  const nextExample = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentExample < pronunciationDrills[currentDrill].examples.length - 1) {
      setCurrentExample(currentExample + 1)
      resetState()
    } else if (currentDrill < pronunciationDrills.length - 1) {
      setCurrentDrill(currentDrill + 1)
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
    } else if (currentDrill > 0) {
      setCurrentDrill(currentDrill - 1)
      setCurrentExample(pronunciationDrills[currentDrill - 1].examples.length - 1)
      resetState()
    }
  }

  const resetState = () => {
    setRecordingComplete(false)
    setShowTip(false)

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
  const totalExamples = pronunciationDrills.reduce((sum, drill) => sum + drill.examples.length, 0)
  let completedExamples = 0

  for (let i = 0; i < currentDrill; i++) {
    completedExamples += pronunciationDrills[i].examples.length
  }
  completedExamples += currentExample

  const progress = (completedExamples / totalExamples) * 100

  const currentDrillData = pronunciationDrills[currentDrill]
  const currentExampleData = currentDrillData.examples[currentExample]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pronunciation Drills</h1>
          <div className="text-sm text-muted-foreground">
            Drill {currentDrill + 1} of {pronunciationDrills.length}
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
              <CardTitle className="text-2xl">{currentDrillData.title}</CardTitle>
              <Badge className={getLevelColor(currentDrillData.level)}>{currentDrillData.level}</Badge>
            </div>
            <CardDescription>{currentDrillData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="all">All Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-6 pt-4">
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-3xl font-medium">{currentExampleData.word}</p>

                  {showTip && (
                    <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-300">
                      <p>{currentExampleData.tip}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setShowTip(!showTip)} variant="outline" className="flex gap-2">
                    {showTip ? "Hide Tip" : "Show Tip"}
                  </Button>

                  <Button onClick={playExampleAudio} variant="outline" className="flex gap-2" disabled={isRecording}>
                    <Volume2 className="h-5 w-5" />
                    {isPlaying ? "Stop" : "Listen"}
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
                    <p className="text-sm text-muted-foreground">Speak clearly into your microphone</p>
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
              </TabsContent>

              <TabsContent value="all" className="pt-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {pronunciationDrills[currentDrill].examples.map((example, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-md ${index === currentExample ? "bg-accent" : "bg-muted"}`}
                      onClick={() => {
                        stopAllAudio()
                        setCurrentExample(index)
                        resetState()
                        setActiveTab("practice")
                      }}
                    >
                      <p className="font-medium cursor-pointer">{example.word}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={previousExample}
              variant="outline"
              disabled={(currentDrill === 0 && currentExample === 0) || isRecording || isPlaying}
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
                (currentDrill === pronunciationDrills.length - 1 &&
                  currentExample === pronunciationDrills[currentDrill].examples.length - 1) ||
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
