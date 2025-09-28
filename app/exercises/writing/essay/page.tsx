"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Info, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

const essayPrompts = [
  {
    id: 1,
    title: "Technology and Society",
    prompt:
      "Discuss how technology has changed society in the past decade. Include both positive and negative impacts.",
    minWords: 150,
    maxWords: 300,
    timeLimit: 30, // minutes
  },
  {
    id: 2,
    title: "Environmental Challenges",
    prompt:
      "What do you think is the most pressing environmental challenge facing the world today? Explain why and suggest possible solutions.",
    minWords: 200,
    maxWords: 350,
    timeLimit: 35, // minutes
  },
  {
    id: 3,
    title: "Education Systems",
    prompt:
      "Compare the traditional education system with online learning. What are the advantages and disadvantages of each approach?",
    minWords: 200,
    maxWords: 350,
    timeLimit: 35, // minutes
  },
]

export default function WritingEssayPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [essay, setEssay] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{
    overall: string
    grammar: string
    vocabulary: string
    structure: string
    score: number
    suggestions: string[]
  } | null>(null)
  const [activeTab, setActiveTab] = useState("write")
  const [timeRemaining, setTimeRemaining] = useState(essayPrompts[currentPrompt].timeLimit * 60) // in seconds
  const [timerActive, setTimerActive] = useState(false)

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setEssay(text)

    // Count words (split by whitespace)
    const words = text.trim() ? text.trim().split(/\s+/) : []
    setWordCount(words.length)

    // Start timer if not already started and there's content
    if (!timerActive && text.trim()) {
      setTimerActive(true)
    }
  }

  const submitEssay = async () => {
    if (wordCount < essayPrompts[currentPrompt].minWords) {
      alert(`Your essay must be at least ${essayPrompts[currentPrompt].minWords} words.`)
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to an AI service for analysis
      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate AI feedback
      const simulatedFeedback = {
        overall:
          "Your essay demonstrates a good understanding of the topic. The ideas are well-presented, though there's room for improvement in organization and development.",
        grammar:
          "Generally good with a few minor errors. Pay attention to subject-verb agreement and tense consistency.",
        vocabulary:
          "You've used a range of vocabulary appropriately. Consider incorporating more academic terms and transition phrases.",
        structure:
          "Your essay has a clear introduction and conclusion. The body paragraphs could be better organized with stronger topic sentences.",
        score: 78, // out of 100
        suggestions: [
          "Develop your main points with more specific examples.",
          "Use more transition words to improve flow between paragraphs.",
          "Vary your sentence structure more to enhance readability.",
          "Strengthen your conclusion by more clearly restating your main arguments.",
        ],
      }

      setFeedback(simulatedFeedback)
      setIsSubmitted(true)
      setActiveTab("feedback")
    } catch (error) {
      console.error("Error submitting essay:", error)
      alert("There was an error submitting your essay. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimerActive(false)
    }
  }

  const nextPrompt = () => {
    if (currentPrompt < essayPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
      resetExercise()
    }
  }

  const previousPrompt = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
      resetExercise()
    }
  }

  const resetExercise = () => {
    setEssay("")
    setWordCount(0)
    setIsSubmitted(false)
    setFeedback(null)
    setActiveTab("write")
    setTimeRemaining(essayPrompts[currentPrompt].timeLimit * 60)
    setTimerActive(false)
  }

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = (wordCount / essayPrompts[currentPrompt].minWords) * 100
  const clampedProgress = Math.min(progressPercentage, 100)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Essay Writing</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Prompt {currentPrompt + 1} of {essayPrompts.length}
            </div>
            {timerActive && (
              <div className={`text-sm font-medium ${timeRemaining < 300 ? "text-red-500" : "text-muted-foreground"}`}>
                Time: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="feedback" disabled={!isSubmitted}>
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <Card>
              <CardHeader>
                <CardTitle>{essayPrompts[currentPrompt].title}</CardTitle>
                <CardDescription>{essayPrompts[currentPrompt].prompt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>
                    Word Count: {wordCount}
                    {wordCount < essayPrompts[currentPrompt].minWords && (
                      <span className="text-muted-foreground"> (minimum: {essayPrompts[currentPrompt].minWords})</span>
                    )}
                  </span>
                  <span className="text-muted-foreground">Maximum: {essayPrompts[currentPrompt].maxWords} words</span>
                </div>

                <Progress value={clampedProgress} className="h-2" />

                <Textarea
                  placeholder="Write your essay here..."
                  className="min-h-[300px] resize-none"
                  value={essay}
                  onChange={handleEssayChange}
                  disabled={isSubmitting || isSubmitted}
                />

                {wordCount > essayPrompts[currentPrompt].maxWords && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your essay exceeds the maximum word count of {essayPrompts[currentPrompt].maxWords} words.
                    </AlertDescription>
                  </Alert>
                )}

                {wordCount > 0 && wordCount < essayPrompts[currentPrompt].minWords && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Your essay must be at least {essayPrompts[currentPrompt].minWords} words.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={previousPrompt} disabled={currentPrompt === 0 || isSubmitting}>
                    Previous Prompt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={nextPrompt}
                    disabled={currentPrompt === essayPrompts.length - 1 || isSubmitting}
                  >
                    Next Prompt
                  </Button>
                </div>

                <Button
                  onClick={submitEssay}
                  disabled={
                    wordCount < essayPrompts[currentPrompt].minWords ||
                    wordCount > essayPrompts[currentPrompt].maxWords ||
                    isSubmitting ||
                    isSubmitted
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Submit Essay"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback on Your Essay</CardTitle>
                  <CardDescription>
                    Here's an analysis of your writing with suggestions for improvement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Overall Score</h3>
                    <div className="text-2xl font-bold">{feedback.score}/100</div>
                  </div>

                  <Progress
                    value={feedback.score}
                    className="h-2"
                    indicatorClassName={
                      feedback.score >= 80 ? "bg-green-500" : feedback.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Overall Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{feedback.overall}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Grammar & Mechanics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{feedback.grammar}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Vocabulary & Word Choice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{feedback.vocabulary}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Structure & Organization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{feedback.structure}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Suggestions for Improvement</h3>
                    <ul className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("write")}>
                    View Essay
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={resetExercise}>Try Again</Button>
                    <Button variant="outline" asChild>
                      <Link href="/exercises">Back to Exercises</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
