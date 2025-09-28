"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Volume2, ArrowRight, ArrowLeft, User, MessageSquare } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const conversations = [
  {
    id: 1,
    title: "At a Restaurant",
    scenario: "You are at a restaurant and want to order food.",
    level: "Beginner",
    exchanges: [
      {
        speaker: "Waiter",
        text: "Hello! Welcome to our restaurant. Can I take your order?",
        audioUrl: "/audio/waiter-greeting.mp3", // This would be a real audio file in production
      },
      {
        speaker: "You",
        text: "Hi, I'd like to see the menu, please.",
        isUserResponse: true,
      },
      {
        speaker: "Waiter",
        text: "Here's the menu. Today's special is grilled salmon with vegetables.",
        audioUrl: "/audio/waiter-menu.mp3",
      },
      {
        speaker: "You",
        text: "That sounds good. I'll have the special, please.",
        isUserResponse: true,
      },
      {
        speaker: "Waiter",
        text: "Excellent choice! Would you like something to drink with that?",
        audioUrl: "/audio/waiter-drink.mp3",
      },
      {
        speaker: "You",
        text: "Yes, I'd like a glass of water, please.",
        isUserResponse: true,
      },
    ],
  },
  {
    id: 2,
    title: "Making an Appointment",
    scenario: "You need to make a doctor's appointment over the phone.",
    level: "Beginner",
    exchanges: [
      {
        speaker: "Receptionist",
        text: "Good morning, City Medical Center. How can I help you today?",
        audioUrl: "/audio/receptionist-greeting.mp3",
      },
      {
        speaker: "You",
        text: "Good morning. I'd like to make an appointment with Dr. Smith, please.",
        isUserResponse: true,
      },
      {
        speaker: "Receptionist",
        text: "May I have your name, please?",
        audioUrl: "/audio/receptionist-name.mp3",
      },
      {
        speaker: "You",
        text: "My name is [Your Name].",
        isUserResponse: true,
      },
      {
        speaker: "Receptionist",
        text: "Thank you. And what's the reason for your visit?",
        audioUrl: "/audio/receptionist-reason.mp3",
      },
      {
        speaker: "You",
        text: "I have a sore throat and a fever.",
        isUserResponse: true,
      },
    ],
  },
  {
    id: 3,
    title: "Shopping for Clothes",
    scenario: "You are shopping for clothes and need assistance.",
    level: "Beginner",
    exchanges: [
      {
        speaker: "Sales Assistant",
        text: "Hello there! Can I help you find something today?",
        audioUrl: "/audio/assistant-greeting.mp3",
      },
      {
        speaker: "You",
        text: "Hi, I'm looking for a new jacket for winter.",
        isUserResponse: true,
      },
      {
        speaker: "Sales Assistant",
        text: "We have several winter jackets in stock. What size are you looking for?",
        audioUrl: "/audio/assistant-size.mp3",
      },
      {
        speaker: "You",
        text: "I usually wear a medium size.",
        isUserResponse: true,
      },
      {
        speaker: "Sales Assistant",
        text: "Great! And do you have a specific color in mind?",
        audioUrl: "/audio/assistant-color.mp3",
      },
      {
        speaker: "You",
        text: "I prefer black or dark blue.",
        isUserResponse: true,
      },
    ],
  },
  {
    id: 4,
    title: "Job Interview",
    scenario: "You are attending a job interview for a position you applied for.",
    level: "Intermediate",
    exchanges: [
      {
        speaker: "Interviewer",
        text: "Good afternoon. Thank you for coming in today. Could you start by telling me a bit about yourself?",
        audioUrl: "/audio/interviewer-intro.mp3",
      },
      {
        speaker: "You",
        text: "Good afternoon. I'm a recent graduate with a degree in marketing. I've always been passionate about creative communication strategies.",
        isUserResponse: true,
      },
      {
        speaker: "Interviewer",
        text: "Interesting. What would you say is your greatest strength?",
        audioUrl: "/audio/interviewer-strength.mp3",
      },
      {
        speaker: "You",
        text: "I believe my greatest strength is my ability to work well under pressure and meet tight deadlines.",
        isUserResponse: true,
      },
      {
        speaker: "Interviewer",
        text: "Can you give me an example of a time when you demonstrated this strength?",
        audioUrl: "/audio/interviewer-example.mp3",
      },
      {
        speaker: "You",
        text: "During my internship last year, we had a major project with a tight deadline. I organized the team and we delivered the project on time.",
        isUserResponse: true,
      },
    ],
  },
  {
    id: 5,
    title: "Giving Directions",
    scenario: "A tourist asks you for directions to a famous landmark.",
    level: "Intermediate",
    exchanges: [
      {
        speaker: "Tourist",
        text: "Excuse me, could you help me? I'm trying to find the National Museum.",
        audioUrl: "/audio/tourist-help.mp3",
      },
      {
        speaker: "You",
        text: "Of course! The National Museum is about 10 minutes from here by foot.",
        isUserResponse: true,
      },
      {
        speaker: "Tourist",
        text: "Great! Could you tell me how to get there?",
        audioUrl: "/audio/tourist-directions.mp3",
      },
      {
        speaker: "You",
        text: "Sure. Go straight down this street for two blocks, then turn right at the traffic light. The museum will be on your left after one more block.",
        isUserResponse: true,
      },
      {
        speaker: "Tourist",
        text: "Is there a café nearby where I could get something to drink after visiting the museum?",
        audioUrl: "/audio/tourist-cafe.mp3",
      },
      {
        speaker: "You",
        text: "Yes, there's a nice café right across from the museum. They serve great coffee and pastries.",
        isUserResponse: true,
      },
    ],
  },
  {
    id: 6,
    title: "Business Negotiation",
    scenario: "You are negotiating a business deal with a potential partner.",
    level: "Advanced",
    exchanges: [
      {
        speaker: "Business Partner",
        text: "We've reviewed your proposal and we're interested in moving forward, but we have some concerns about the pricing structure.",
        audioUrl: "/audio/partner-pricing.mp3",
      },
      {
        speaker: "You",
        text: "I understand your concerns. Could you elaborate on which aspects of the pricing structure you find problematic?",
        isUserResponse: true,
      },
      {
        speaker: "Business Partner",
        text: "The monthly subscription fee seems high compared to other solutions in the market. We're wondering if there's room for negotiation there.",
        audioUrl: "/audio/partner-negotiation.mp3",
      },
      {
        speaker: "You",
        text: "I appreciate your feedback. We could potentially offer a 15% discount for the first year if you commit to a two-year contract.",
        isUserResponse: true,
      },
      {
        speaker: "Business Partner",
        text: "That's an interesting proposition. What about implementation costs? Is there any flexibility there?",
        audioUrl: "/audio/partner-implementation.mp3",
      },
      {
        speaker: "You",
        text: "We could waive the implementation fee if you're willing to start within the next month. This would save you significant upfront costs.",
        isUserResponse: true,
      },
    ],
  },
]

export default function ConversationPracticePage() {
  const [currentConversation, setCurrentConversation] = useState(0)
  const [currentExchange, setCurrentExchange] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [activeTab, setActiveTab] = useState("practice")
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)
  const promptAudioRef = useRef<HTMLAudioElement | null>(null)
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

  const stopAllAudio = () => {
    // Stop prompt audio if playing
    if (promptAudioRef.current) {
      promptAudioRef.current.pause()
      promptAudioRef.current.currentTime = 0
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

    // Stop prompt audio if playing
    if (promptAudioRef.current) {
      promptAudioRef.current.pause()
      promptAudioRef.current.currentTime = 0
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

  const playPromptAudio = () => {
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

    const currentPrompt = conversations[currentConversation].exchanges[currentExchange]
    if (!currentPrompt.isUserResponse && promptAudioRef.current) {
      // Set up event listeners
      promptAudioRef.current.onplay = () => setIsPlaying(true)
      promptAudioRef.current.onended = () => setIsPlaying(false)
      promptAudioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsPlaying(false)
      }

      promptAudioRef.current.src = currentPrompt.audioUrl

      // Use a promise to handle play() properly
      const playPromise = promptAudioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            console.error("Error playing prompt audio:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  const nextExchange = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentExchange < conversations[currentConversation].exchanges.length - 1) {
      setCurrentExchange(currentExchange + 1)
      resetExchangeState()
    }
  }

  const previousExchange = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentExchange > 0) {
      setCurrentExchange(currentExchange - 1)
      resetExchangeState()
    }
  }

  const nextConversation = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentConversation < conversations.length - 1) {
      setCurrentConversation(currentConversation + 1)
      setCurrentExchange(0)
      resetExchangeState()
    }
  }

  const previousConversation = () => {
    // Stop any playing audio
    stopAllAudio()

    if (currentConversation > 0) {
      setCurrentConversation(currentConversation - 1)
      setCurrentExchange(0)
      resetExchangeState()
    }
  }

  const resetExchangeState = () => {
    setRecordingComplete(false)

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
    promptAudioRef.current = new Audio()
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
      if (promptAudioRef.current) {
        promptAudioRef.current.pause()
        promptAudioRef.current.src = ""
      }

      if (userAudioRef.current) {
        userAudioRef.current.pause()
        userAudioRef.current.src = ""
      }
    }
  }, [])

  const conversationProgress = (currentConversation / conversations.length) * 100
  const exchangeProgress = (currentExchange / (conversations[currentConversation].exchanges.length - 1)) * 100

  const currentPrompt = conversations[currentConversation].exchanges[currentExchange]
  const isUserTurn = currentPrompt.isUserResponse

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Conversation Practice</h1>
          <div className="text-sm text-muted-foreground">
            Scenario {currentConversation + 1} of {conversations.length}
          </div>
        </div>
        <Progress value={conversationProgress} className="h-2" />

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
              <CardTitle className="text-2xl">{conversations[currentConversation].title}</CardTitle>
              <Badge className={getLevelColor(conversations[currentConversation].level)}>
                {conversations[currentConversation].level}
              </Badge>
            </div>
            <CardDescription>{conversations[currentConversation].scenario}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="script">Full Script</TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        !isUserTurn ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {!isUserTurn ? <MessageSquare className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">{currentPrompt.speaker}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">{currentPrompt.text}</p>
                      </div>
                      {!isUserTurn && (
                        <Button
                          onClick={playPromptAudio}
                          variant="ghost"
                          size="sm"
                          className="flex gap-1 h-7 mt-1"
                          disabled={isRecording}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span className="text-xs">{isPlaying ? "Stop" : "Listen"}</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {isUserTurn && (
                    <div className="flex flex-col items-center gap-4 mt-6">
                      <p className="text-sm text-muted-foreground text-center">Your turn! Record your response.</p>

                      <div className="flex gap-3">
                        {!isRecording && !recordingComplete ? (
                          <Button onClick={startRecording} className="flex gap-2" disabled={isPlaying}>
                            <Mic className="h-5 w-5" />
                            Record Response
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
                          <p className="text-xs text-muted-foreground">Speak clearly into your microphone</p>
                        </div>
                      )}
                    </div>
                  )}

                  <Progress value={exchangeProgress} className="h-1.5 mt-6" />
                </div>
              </TabsContent>

              <TabsContent value="script" className="pt-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {conversations[currentConversation].exchanges.map((exchange, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          !exchange.isUserResponse ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {!exchange.isUserResponse ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{exchange.speaker}</p>
                        <div className={`p-3 rounded-md ${index === currentExchange ? "bg-accent" : "bg-muted"}`}>
                          <p className="text-sm">{exchange.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                onClick={previousConversation}
                variant="outline"
                disabled={currentConversation === 0 || isRecording || isPlaying}
                className="flex gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Scenario
              </Button>
              <Button
                onClick={nextConversation}
                variant="outline"
                disabled={currentConversation === conversations.length - 1 || isRecording || isPlaying}
                className="flex gap-1"
              >
                Next Scenario
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={previousExchange}
                variant="secondary"
                disabled={currentExchange === 0 || isRecording || isPlaying}
                className="flex gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={nextExchange}
                disabled={
                  (isUserTurn && !recordingComplete) ||
                  currentExchange === conversations[currentConversation].exchanges.length - 1 ||
                  isRecording ||
                  isPlaying
                }
                className="flex gap-1"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </DashboardShell>
    </div>
  )
}
