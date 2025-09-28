"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Volume2, Pause, Loader2, MessageSquare, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getOrGenerateAudio } from "@/utils/audio-utils"

const conversationExercises = [
  {
    id: 1,
    title: "At a Coffee Shop",
    level: "Beginner",
    description: "Listen to the conversation and answer the questions.",
    conversation: [
      { speaker: "Barista", text: "Hi there! What can I get for you today?" },
      { speaker: "Customer", text: "Hi, I'd like a medium latte, please." },
      { speaker: "Barista", text: "Sure thing. Would you like that hot or iced?" },
      { speaker: "Customer", text: "Hot, please. And can I also get a chocolate croissant?" },
      { speaker: "Barista", text: "Of course. That'll be $8.75. Will that be all?" },
      { speaker: "Customer", text: "Yes, that's it. Thank you." },
      { speaker: "Barista", text: "Your order will be ready at the end of the counter in a few minutes." },
      { speaker: "Customer", text: "Great, thanks!" },
    ],
    audioUrl: "/audio/coffee-shop-conversation.mp3",
    audioText:
      "Barista: Hi there! What can I get for you today? Customer: Hi, I'd like a medium latte, please. Barista: Sure thing. Would you like that hot or iced? Customer: Hot, please. And can I also get a chocolate croissant? Barista: Of course. That'll be $8.75. Will that be all? Customer: Yes, that's it. Thank you. Barista: Your order will be ready at the end of the counter in a few minutes. Customer: Great, thanks!",
    questions: [
      {
        id: 1,
        question: "What does the customer order?",
        options: [
          { id: "a", text: "A small cappuccino and a muffin" },
          { id: "b", text: "A medium latte and a chocolate croissant" },
          { id: "c", text: "A large coffee and a sandwich" },
          { id: "d", text: "A tea and a bagel" },
        ],
        correctAnswer: "b",
        explanation: "The customer orders 'a medium latte' and 'a chocolate croissant'.",
      },
      {
        id: 2,
        question: "How does the customer want their latte?",
        options: [
          { id: "a", text: "Iced" },
          { id: "b", text: "Hot" },
          { id: "c", text: "With extra foam" },
          { id: "d", text: "Decaffeinated" },
        ],
        correctAnswer: "b",
        explanation:
          "When the barista asks 'Would you like that hot or iced?', the customer responds with 'Hot, please.'",
      },
      {
        id: 3,
        question: "How much does the order cost?",
        options: [
          { id: "a", text: "$7.50" },
          { id: "b", text: "$8.25" },
          { id: "c", text: "$8.75" },
          { id: "d", text: "$9.25" },
        ],
        correctAnswer: "c",
        explanation: "The barista says 'That'll be $8.75.'",
      },
      {
        id: 4,
        question: "Where will the order be ready?",
        options: [
          { id: "a", text: "At the table" },
          { id: "b", text: "At the drive-thru window" },
          { id: "c", text: "At the end of the counter" },
          { id: "d", text: "At the entrance" },
        ],
        correctAnswer: "c",
        explanation: "The barista says 'Your order will be ready at the end of the counter in a few minutes.'",
      },
    ],
  },
  {
    id: 2,
    title: "Making Plans",
    level: "Beginner",
    description: "Listen to the conversation and answer the questions.",
    conversation: [
      { speaker: "Sarah", text: "Hey Mike, are you free this weekend?" },
      { speaker: "Mike", text: "Hi Sarah! I think so. What did you have in mind?" },
      { speaker: "Sarah", text: "I was thinking we could go see that new movie at the cinema." },
      { speaker: "Mike", text: "The sci-fi one? I've been wanting to see that!" },
      { speaker: "Sarah", text: "Yes, that's the one! How about Saturday afternoon?" },
      { speaker: "Mike", text: "Saturday works for me. What time were you thinking?" },
      { speaker: "Sarah", text: "There's a showing at 3:30. We could meet at the mall around 3:00." },
      { speaker: "Mike", text: "Perfect. Should we grab dinner after the movie?" },
      { speaker: "Sarah", text: "That sounds great! There's a new Italian restaurant nearby we could try." },
      { speaker: "Mike", text: "I love Italian food. It's a plan then!" },
    ],
    audioUrl: "/audio/making-plans-conversation.mp3",
    audioText:
      "Sarah: Hey Mike, are you free this weekend? Mike: Hi Sarah! I think so. What did you have in mind? Sarah: I was thinking we could go see that new movie at the cinema. Mike: The sci-fi one? I've been wanting to see that! Sarah: Yes, that's the one! How about Saturday afternoon? Mike: Saturday works for me. What time were you thinking? Sarah: There's a showing at 3:30. We could meet at the mall around 3:00. Mike: Perfect. Should we grab dinner after the movie? Sarah: That sounds great! There's a new Italian restaurant nearby we could try. Mike: I love Italian food. It's a plan then!",
    questions: [
      {
        id: 1,
        question: "What are Sarah and Mike planning to do?",
        options: [
          { id: "a", text: "Go shopping" },
          { id: "b", text: "See a movie and have dinner" },
          { id: "c", text: "Visit a museum" },
          { id: "d", text: "Attend a concert" },
        ],
        correctAnswer: "b",
        explanation: "Sarah suggests going to see a movie, and Mike suggests grabbing dinner afterward.",
      },
      {
        id: 2,
        question: "What type of movie are they going to see?",
        options: [
          { id: "a", text: "A comedy" },
          { id: "b", text: "A romance" },
          { id: "c", text: "A sci-fi movie" },
          { id: "d", text: "A horror movie" },
        ],
        correctAnswer: "c",
        explanation: "Mike asks 'The sci-fi one?' and mentions he's been wanting to see it.",
      },
      {
        id: 3,
        question: "When are they planning to meet?",
        options: [
          { id: "a", text: "Friday evening" },
          { id: "b", text: "Saturday morning" },
          { id: "c", text: "Saturday at 3:00 PM" },
          { id: "d", text: "Sunday afternoon" },
        ],
        correctAnswer: "c",
        explanation: "Sarah suggests meeting at the mall around 3:00 on Saturday.",
      },
      {
        id: 4,
        question: "What kind of restaurant do they plan to visit?",
        options: [
          { id: "a", text: "Mexican" },
          { id: "b", text: "Chinese" },
          { id: "c", text: "Italian" },
          { id: "d", text: "Indian" },
        ],
        correctAnswer: "c",
        explanation: "Sarah suggests trying a new Italian restaurant, and Mike mentions he loves Italian food.",
      },
    ],
  },
  {
    id: 3,
    title: "Job Interview",
    level: "Intermediate",
    description: "Listen to the conversation and answer the questions.",
    conversation: [
      { speaker: "Interviewer", text: "Good morning, Ms. Johnson. Thank you for coming in today." },
      { speaker: "Candidate", text: "Good morning. Thank you for the opportunity to interview for this position." },
      { speaker: "Interviewer", text: "Could you start by telling me a bit about your background and experience?" },
      {
        speaker: "Candidate",
        text: "Of course. I have a bachelor's degree in Marketing and five years of experience in digital marketing. In my current role, I manage social media campaigns and content creation for a retail company.",
      },
      {
        speaker: "Interviewer",
        text: "That's impressive. What would you say is your greatest strength as a marketing professional?",
      },
      {
        speaker: "Candidate",
        text: "I believe my greatest strength is my ability to analyze data and use those insights to create targeted campaigns. In my current position, I increased engagement by 45% by implementing data-driven strategies.",
      },
      {
        speaker: "Interviewer",
        text: "Excellent. And what about challenges? Can you describe a difficult situation you faced at work and how you handled it?",
      },
      {
        speaker: "Candidate",
        text: "Last year, we had a campaign that wasn't performing well. I gathered the team for a brainstorming session, analyzed what wasn't working, and pivoted our strategy. We ended up exceeding our targets by 20%.",
      },
      {
        speaker: "Interviewer",
        text: "That's a great example. Why are you interested in joining our company specifically?",
      },
      {
        speaker: "Candidate",
        text: "I've been following your company's innovative approach to marketing for some time. I'm particularly impressed with your recent campaign for the eco-friendly product line, and I believe my skills in digital storytelling would be a good fit for your team.",
      },
    ],
    audioUrl: "/audio/job-interview-conversation.mp3",
    audioText:
      "Interviewer: Good morning, Ms. Johnson. Thank you for coming in today. Candidate: Good morning. Thank you for the opportunity to interview for this position. Interviewer: Could you start by telling me a bit about your background and experience? Candidate: Of course. I have a bachelor's degree in Marketing and five years of experience in digital marketing. In my current role, I manage social media campaigns and content creation for a retail company. Interviewer: That's impressive. What would you say is your greatest strength as a marketing professional? Candidate: I believe my greatest strength is my ability to analyze data and use those insights to create targeted campaigns. In my current position, I increased engagement by 45% by implementing data-driven strategies. Interviewer: Excellent. And what about challenges? Can you describe a difficult situation you faced at work and how you handled it? Candidate: Last year, we had a campaign that wasn't performing well. I gathered the team for a brainstorming session, analyzed what wasn't working, and pivoted our strategy. We ended up exceeding our targets by 20%. Interviewer: That's a great example. Why are you interested in joining our company specifically? Candidate: I've been following your company's innovative approach to marketing for some time. I'm particularly impressed with your recent campaign for the eco-friendly product line, and I believe my skills in digital storytelling would be a good fit for your team.",
    questions: [
      {
        id: 1,
        question: "What is the candidate's educational background?",
        options: [
          { id: "a", text: "Master's degree in Business" },
          { id: "b", text: "Bachelor's degree in Marketing" },
          { id: "c", text: "Bachelor's degree in Communications" },
          { id: "d", text: "Master's degree in Digital Media" },
        ],
        correctAnswer: "b",
        explanation: "The candidate mentions having 'a bachelor's degree in Marketing'.",
      },
      {
        id: 2,
        question: "How many years of experience does the candidate have?",
        options: [
          { id: "a", text: "Three years" },
          { id: "b", text: "Four years" },
          { id: "c", text: "Five years" },
          { id: "d", text: "Seven years" },
        ],
        correctAnswer: "c",
        explanation: "The candidate mentions having 'five years of experience in digital marketing'.",
      },
      {
        id: 3,
        question: "What does the candidate consider to be their greatest strength?",
        options: [
          { id: "a", text: "Creativity in design" },
          { id: "b", text: "Team leadership" },
          { id: "c", text: "Ability to analyze data and create targeted campaigns" },
          { id: "d", text: "Time management" },
        ],
        correctAnswer: "c",
        explanation:
          "The candidate states 'I believe my greatest strength is my ability to analyze data and use those insights to create targeted campaigns.'",
      },
      {
        id: 4,
        question: "By how much did the candidate increase engagement in their current position?",
        options: [
          { id: "a", text: "20%" },
          { id: "b", text: "35%" },
          { id: "c", text: "45%" },
          { id: "d", text: "50%" },
        ],
        correctAnswer: "c",
        explanation:
          "The candidate mentions 'In my current position, I increased engagement by 45% by implementing data-driven strategies.'",
      },
      {
        id: 5,
        question: "Why is the candidate interested in joining this specific company?",
        options: [
          { id: "a", text: "Higher salary" },
          { id: "b", text: "Better work-life balance" },
          { id: "c", text: "The company's innovative approach to marketing" },
          { id: "d", text: "Opportunity for promotion" },
        ],
        correctAnswer: "c",
        explanation:
          "The candidate says 'I've been following your company's innovative approach to marketing for some time.'",
      },
    ],
  },
  {
    id: 4,
    title: "Making a Reservation",
    level: "Beginner",
    description: "Listen to the conversation and answer the questions.",
    conversation: [
      { speaker: "Receptionist", text: "Good afternoon, Grand Hotel. How may I help you?" },
      { speaker: "Caller", text: "Hello, I'd like to make a reservation for next weekend." },
      { speaker: "Receptionist", text: "What dates were you looking at?" },
      { speaker: "Caller", text: "I'd like to check in on Friday, June 10th, and check out on Sunday, June 12th." },
      { speaker: "Receptionist", text: "Let me check availability for those dates. How many guests will there be?" },
      { speaker: "Caller", text: "Just two adults." },
      { speaker: "Receptionist", text: "Would you prefer a room with one king bed or two queen beds?" },
      { speaker: "Caller", text: "One king bed, please." },
      {
        speaker: "Receptionist",
        text: "Great. We have a king room available for those dates. The rate is $175 per night plus tax.",
      },
      { speaker: "Caller", text: "That sounds fine. Does that include breakfast?" },
      {
        speaker: "Receptionist",
        text: "No, but we can add our breakfast package for an additional $25 per day for two people.",
      },
      { speaker: "Caller", text: "Yes, let's add the breakfast package." },
      { speaker: "Receptionist", text: "Perfect. May I have your name and a credit card to secure the reservation?" },
    ],
    audioUrl: "/audio/hotel-reservation-conversation.mp3",
    audioText:
      "Receptionist: Good afternoon, Grand Hotel. How may I help you? Caller: Hello, I'd like to make a reservation for next weekend. Receptionist: What dates were you looking at? Caller: I'd like to check in on Friday, June 10th, and check out on Sunday, June 12th. Receptionist: Let me check availability for those dates. How many guests will there be? Caller: Just two adults. Receptionist: Would you prefer a room with one king bed or two queen beds? Caller: One king bed, please. Receptionist: Great. We have a king room available for those dates. The rate is $175 per night plus tax. Caller: That sounds fine. Does that include breakfast? Receptionist: No, but we can add our breakfast package for an additional $25 per day for two people. Caller: Yes, let's add the breakfast package. Receptionist: Perfect. May I have your name and a credit card to secure the reservation?",
    questions: [
      {
        id: 1,
        question: "What is the check-in date for the reservation?",
        options: [
          { id: "a", text: "June 5th" },
          { id: "b", text: "June 10th" },
          { id: "c", text: "June 12th" },
          { id: "d", text: "June 15th" },
        ],
        correctAnswer: "b",
        explanation: "The caller says 'I'd like to check in on Friday, June 10th'.",
      },
      {
        id: 2,
        question: "How many nights is the caller staying at the hotel?",
        options: [
          { id: "a", text: "One night" },
          { id: "b", text: "Two nights" },
          { id: "c", text: "Three nights" },
          { id: "d", text: "Four nights" },
        ],
        correctAnswer: "b",
        explanation: "The caller is checking in on June 10th and checking out on June 12th, which is a two-night stay.",
      },
      {
        id: 3,
        question: "What type of room does the caller request?",
        options: [
          { id: "a", text: "A room with two queen beds" },
          { id: "b", text: "A room with one king bed" },
          { id: "c", text: "A suite" },
          { id: "d", text: "A room with a view" },
        ],
        correctAnswer: "b",
        explanation: "When asked about preferences, the caller says 'One king bed, please.'",
      },
      {
        id: 4,
        question: "What is the room rate per night?",
        options: [
          { id: "a", text: "$150" },
          { id: "b", text: "$175" },
          { id: "c", text: "$200" },
          { id: "d", text: "$225" },
        ],
        correctAnswer: "b",
        explanation: "The receptionist states 'The rate is $175 per night plus tax.'",
      },
      {
        id: 5,
        question: "What additional service does the caller add to the reservation?",
        options: [
          { id: "a", text: "Airport shuttle" },
          { id: "b", text: "Late check-out" },
          { id: "c", text: "Breakfast package" },
          { id: "d", text: "Spa treatment" },
        ],
        correctAnswer: "c",
        explanation: "The caller adds the breakfast package for an additional $25 per day.",
      },
    ],
  },
]

export default function ConversationsPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [showConversation, setShowConversation] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load or generate audio when exercise changes
  useEffect(() => {
    const loadAudio = async () => {
      setIsLoadingAudio(true)
      try {
        const url = await getOrGenerateAudio(
          conversationExercises[currentExercise].audioUrl,
          conversationExercises[currentExercise].audioText,
        )
        setAudioUrl(url)
      } catch (error) {
        console.error("Error loading audio:", error)
        // Fallback to the original URL if there's an error
        setAudioUrl(conversationExercises[currentExercise].audioUrl)
      } finally {
        setIsLoadingAudio(false)
      }
    }

    loadAudio()

    // Preload audio for the next exercise if available
    if (currentExercise < conversationExercises.length - 1) {
      getOrGenerateAudio(
        conversationExercises[currentExercise + 1].audioUrl,
        conversationExercises[currentExercise + 1].audioText,
      )
    }
  }, [currentExercise])

  const playAudio = () => {
    if (!audioUrl) return

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      return
    }

    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    audioRef.current.src = audioUrl
    audioRef.current.onended = () => setIsPlaying(false)
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error)
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
    if (selectedAnswer === conversationExercises[currentExercise].questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setShowExplanation(false)

    if (currentQuestion < conversationExercises[currentExercise].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentExercise < conversationExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentQuestion(0)
      setShowConversation(true)
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
    setIsExerciseCompleted(false)
    setShowConversation(true)
  }

  // Calculate total questions across all exercises
  const totalQuestions = conversationExercises.reduce((total, exercise) => total + exercise.questions.length, 0)

  // Calculate completed questions
  let completedQuestions = 0
  for (let i = 0; i < currentExercise; i++) {
    completedQuestions += conversationExercises[i].questions.length
  }
  completedQuestions += currentQuestion

  const progress = (completedQuestions / totalQuestions) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Conversation Listening</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentExercise + 1} of {conversationExercises.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isExerciseCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{conversationExercises[currentExercise].title}</CardTitle>
                <Badge>{conversationExercises[currentExercise].level}</Badge>
              </div>
              <CardDescription>{conversationExercises[currentExercise].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {showConversation ? (
                <>
                  <div className="flex justify-center mb-4">
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
                          Play Conversation
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {conversationExercises[currentExercise].conversation.map((line, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            line.speaker === "Barista" ||
                            line.speaker === "Receptionist" ||
                            line.speaker === "Interviewer" ||
                            line.speaker === "Sarah"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {line.speaker === "Barista" ||
                          line.speaker === "Receptionist" ||
                          line.speaker === "Interviewer" ||
                          line.speaker === "Sarah" ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">{line.speaker}</p>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm">{line.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button onClick={() => setShowConversation(false)}>Continue to Questions</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium">
                    Question {currentQuestion + 1}:{" "}
                    {conversationExercises[currentExercise].questions[currentQuestion].question}
                  </div>

                  <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                    {conversationExercises[currentExercise].questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 rounded-md border p-4 ${
                          isAnswerChecked &&
                          option.id === conversationExercises[currentExercise].questions[currentQuestion].correctAnswer
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
                              conversationExercises[currentExercise].questions[currentQuestion].correctAnswer && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          {isAnswerChecked &&
                            option.id === selectedAnswer &&
                            option.id !==
                              conversationExercises[currentExercise].questions[currentQuestion].correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {showExplanation && (
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      <AlertDescription>
                        {conversationExercises[currentExercise].questions[currentQuestion].explanation}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setShowConversation(true)}>
                      Review Conversation
                    </Button>
                    <Button variant="outline" onClick={playAudio} disabled={isLoadingAudio || !audioUrl}>
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
                          Listen Again
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!showConversation && (
                <>
                  {!isAnswerChecked ? (
                    <Button onClick={checkAnswer} disabled={!selectedAnswer}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQuestion < conversationExercises[currentExercise].questions.length - 1
                        ? "Next Question"
                        : currentExercise < conversationExercises.length - 1
                          ? "Next Conversation"
                          : "Finish Exercise"}
                    </Button>
                  )}
                  <div className="text-sm font-medium">
                    Score: {score}/{totalQuestions}
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Exercise Completed!</CardTitle>
              <CardDescription>You've completed all the conversation exercises.</CardDescription>
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
