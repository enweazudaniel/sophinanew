"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Info, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

const summaryExercises = [
  {
    id: 1,
    title: "Climate Change",
    text: `Climate change is one of the most pressing issues facing our planet today. It refers to long-term shifts in temperatures and weather patterns, mainly caused by human activities, particularly the burning of fossil fuels.

When fossil fuels like coal, oil, and gas are burned, they release greenhouse gases into the atmosphere. These gases, including carbon dioxide and methane, trap heat from the sun and prevent it from escaping back into space, leading to a warming effect known as the greenhouse effect.

The consequences of climate change are far-reaching and include rising global temperatures, melting ice caps and glaciers, rising sea levels, more frequent and severe weather events such as hurricanes, floods, and droughts, and disruptions to ecosystems and biodiversity.

To address climate change, international efforts like the Paris Agreement aim to limit global warming to well below 2 degrees Celsius above pre-industrial levels. This requires significant reductions in greenhouse gas emissions through transitioning to renewable energy sources, improving energy efficiency, adopting sustainable transportation and agricultural practices, and protecting forests and other natural carbon sinks.

Individual actions also play a crucial role in combating climate change. These include reducing energy consumption, using public transportation or electric vehicles, adopting plant-based diets, reducing waste, and supporting policies and businesses that prioritize sustainability.

While the challenges posed by climate change are substantial, there is growing recognition of the urgency of the situation and increasing momentum for action at all levels of society.`,
    minWords: 75,
    maxWords: 150,
    timeLimit: 15, // minutes
    keyPoints: [
      "Climate change is caused mainly by human activities, especially burning fossil fuels",
      "Greenhouse gases trap heat in the atmosphere",
      "Consequences include rising temperatures, melting ice, rising sea levels, and extreme weather",
      "Solutions include international agreements, transitioning to renewable energy, and individual actions",
      "Urgent action is needed at all levels of society",
    ],
  },
  {
    id: 2,
    title: "Artificial Intelligence",
    text: `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

The core of AI research is to develop machines capable of performing tasks that typically require human intelligence. These include visual perception, speech recognition, decision-making, and translation between languages. AI is an interdisciplinary science with multiple approaches, but advancements in machine learning and deep learning are creating a paradigm shift in virtually every sector of the tech industry.

Machine learning, a subset of AI, involves training algorithms to learn patterns from data and make decisions with minimal human intervention. Deep learning, a subset of machine learning, uses neural networks with many layers (hence "deep") to analyze various factors of data.

AI applications are vast and growing. They include virtual assistants like Siri and Alexa, recommendation systems used by platforms like Netflix and Amazon, autonomous vehicles, fraud detection systems in banking, diagnostic tools in healthcare, and many more.

Despite its benefits, AI also raises concerns about privacy, security, job displacement, and ethical considerations such as bias in AI systems and the potential for autonomous weapons. As AI continues to evolve, it's crucial to develop frameworks for its ethical use and to ensure that it benefits humanity as a whole.

The future of AI holds immense potential. As technology advances, AI could help address some of the world's most challenging problems, from climate change to disease. However, realizing this potential will require careful navigation of the technical, ethical, and societal implications of AI.`,
    minWords: 75,
    maxWords: 150,
    timeLimit: 15, // minutes
    keyPoints: [
      "AI is the simulation of human intelligence in machines",
      "Core AI research focuses on tasks requiring human intelligence like visual perception and decision-making",
      "Machine learning and deep learning are key approaches in AI",
      "AI applications include virtual assistants, recommendation systems, and autonomous vehicles",
      "AI raises concerns about privacy, security, job displacement, and ethics",
      "AI has potential to address major global challenges",
    ],
  },
  {
    id: 3,
    title: "The Digital Divide",
    text: `The digital divide refers to the gap between demographics and regions that have access to modern information and communications technology (ICT) and those that don't or have restricted access. This technology includes the internet, computers, smartphones, and other digital devices and services.

The divide exists on multiple levels. There's a global divide between developed and developing countries, a social divide between socioeconomic groups within countries, and a democratic divide between those who do and don't use digital resources to engage in public life.

Several factors contribute to the digital divide. Economic factors include the cost of devices and internet access. Geographic factors involve the availability of infrastructure, with rural areas often having less access than urban areas. Educational factors relate to digital literacy and the skills needed to use technology effectively. There are also demographic factors, with age, gender, and disability status affecting access and use.

The consequences of the digital divide are significant and far-reaching. In education, students without access to technology may fall behind their peers. In employment, digital skills are increasingly necessary for many jobs, and those without these skills may face limited opportunities. In healthcare, telemedicine and online health information can improve outcomes, but only for those with access. The divide also affects civic participation, as government services and political discourse increasingly move online.

Addressing the digital divide requires a multi-faceted approach. This includes expanding infrastructure to underserved areas, making technology more affordable, providing digital literacy education, developing accessible technology for people with disabilities, and creating relevant content in diverse languages.

As our world becomes increasingly digital, bridging the digital divide is not just a matter of technological progress but of social equity and inclusion. Ensuring that everyone has the opportunity to participate in the digital world is essential for building a fair and inclusive society.`,
    minWords: 75,
    maxWords: 150,
    timeLimit: 15, // minutes
    keyPoints: [
      "The digital divide is the gap in access to modern information and communications technology",
      "It exists at global, social, and democratic levels",
      "Contributing factors include economics, geography, education, and demographics",
      "Consequences affect education, employment, healthcare, and civic participation",
      "Solutions include expanding infrastructure, affordability, digital literacy, and accessibility",
      "Bridging the divide is essential for social equity and inclusion",
    ],
  },
]

export default function WritingSummaryPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [summary, setSummary] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{
    overall: string
    keyPointsCovered: string[]
    keyPointsMissed: string[]
    suggestions: string[]
    score: number
  } | null>(null)
  const [activeTab, setActiveTab] = useState("read")
  const [timeRemaining, setTimeRemaining] = useState(summaryExercises[currentExercise].timeLimit * 60) // in seconds
  const [timerActive, setTimerActive] = useState(false)

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setSummary(text)

    // Count words (split by whitespace)
    const words = text.trim() ? text.trim().split(/\s+/) : []
    setWordCount(words.length)

    // Start timer if not already started and there's content
    if (!timerActive && text.trim()) {
      setTimerActive(true)
    }
  }

  const submitSummary = async () => {
    if (wordCount < summaryExercises[currentExercise].minWords) {
      alert(`Your summary must be at least ${summaryExercises[currentExercise].minWords} words.`)
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to an AI service for analysis
      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate AI feedback
      const keyPoints = summaryExercises[currentExercise].keyPoints

      // Randomly select some key points as "covered" and others as "missed"
      const shuffledPoints = [...keyPoints].sort(() => 0.5 - Math.random())
      const coveredCount = Math.floor(Math.random() * 2) + Math.ceil(keyPoints.length / 2) // Cover at least half the points

      const keyPointsCovered = shuffledPoints.slice(0, coveredCount)
      const keyPointsMissed = shuffledPoints.slice(coveredCount)

      // Calculate score based on coverage and word count
      const coverageScore = (keyPointsCovered.length / keyPoints.length) * 100
      const wordCountScore =
        wordCount >= summaryExercises[currentExercise].minWords &&
        wordCount <= summaryExercises[currentExercise].maxWords
          ? 100
          : 80

      const overallScore = Math.round(coverageScore * 0.7 + wordCountScore * 0.3)

      const simulatedFeedback = {
        overall: getOverallFeedback(overallScore),
        keyPointsCovered,
        keyPointsMissed,
        suggestions: [
          "Try to be more concise while covering all key points",
          "Use your own words rather than copying phrases from the original text",
          "Focus on the main ideas rather than minor details",
          "Organize your summary in a logical flow",
        ],
        score: overallScore,
      }

      setFeedback(simulatedFeedback)
      setIsSubmitted(true)
      setActiveTab("feedback")
    } catch (error) {
      console.error("Error submitting summary:", error)
      alert("There was an error submitting your summary. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimerActive(false)
    }
  }

  const getOverallFeedback = (score: number) => {
    if (score >= 90) {
      return "Excellent summary! You've captured the main points concisely and effectively."
    } else if (score >= 80) {
      return "Good summary. You've covered most of the key points, but there's room for improvement in conciseness and completeness."
    } else if (score >= 70) {
      return "Satisfactory summary. You've covered some key points, but missed others. Try to focus on the most important information."
    } else {
      return "Your summary needs improvement. Focus on identifying and including the main points from the original text."
    }
  }

  const nextExercise = () => {
    if (currentExercise < summaryExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      resetExercise()
    }
  }

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      resetExercise()
    }
  }

  const resetExercise = () => {
    setSummary("")
    setWordCount(0)
    setIsSubmitted(false)
    setFeedback(null)
    setActiveTab("read")
    setTimeRemaining(summaryExercises[currentExercise].timeLimit * 60)
    setTimerActive(false)
  }

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = (wordCount / summaryExercises[currentExercise].minWords) * 100
  const clampedProgress = Math.min(progressPercentage, 100)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Summary Writing</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Exercise {currentExercise + 1} of {summaryExercises.length}
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
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="write" disabled={activeTab === "read" && !summary.trim()}>
              Write
            </TabsTrigger>
            <TabsTrigger value="feedback" disabled={!isSubmitted}>
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="read">
            <Card>
              <CardHeader>
                <CardTitle>{summaryExercises[currentExercise].title}</CardTitle>
                <CardDescription>
                  Read the text carefully and then write a summary of {summaryExercises[currentExercise].minWords}-
                  {summaryExercises[currentExercise].maxWords} words.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {summaryExercises[currentExercise].text.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={previousExercise} disabled={currentExercise === 0}>
                  Previous Text
                </Button>
                <Button onClick={() => setActiveTab("write")} disabled={activeTab === "write"}>
                  Continue to Write
                </Button>
                <Button
                  variant="outline"
                  onClick={nextExercise}
                  disabled={currentExercise === summaryExercises.length - 1}
                >
                  Next Text
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="write">
            <Card>
              <CardHeader>
                <CardTitle>Write a Summary</CardTitle>
                <CardDescription>
                  Summarize the text you just read in {summaryExercises[currentExercise].minWords}-
                  {summaryExercises[currentExercise].maxWords} words.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>
                    Word Count: {wordCount}
                    {wordCount < summaryExercises[currentExercise].minWords && (
                      <span className="text-muted-foreground">
                        {" "}
                        (minimum: {summaryExercises[currentExercise].minWords})
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground">
                    Maximum: {summaryExercises[currentExercise].maxWords} words
                  </span>
                </div>

                <Progress value={clampedProgress} className="h-2" />

                <Textarea
                  placeholder="Write your summary here..."
                  className="min-h-[300px] resize-none"
                  value={summary}
                  onChange={handleSummaryChange}
                  disabled={isSubmitting || isSubmitted}
                />

                {wordCount > summaryExercises[currentExercise].maxWords && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your summary exceeds the maximum word count of {summaryExercises[currentExercise].maxWords} words.
                    </AlertDescription>
                  </Alert>
                )}

                {wordCount > 0 && wordCount < summaryExercises[currentExercise].minWords && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Your summary must be at least {summaryExercises[currentExercise].minWords} words.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">Tips for writing a good summary:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Identify the main ideas and key points</li>
                      <li>Use your own words</li>
                      <li>Be concise and focus on the most important information</li>
                      <li>Maintain the original meaning</li>
                      <li>Avoid including your own opinions</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("read")}>
                  Back to Text
                </Button>

                <Button
                  onClick={submitSummary}
                  disabled={
                    wordCount < summaryExercises[currentExercise].minWords ||
                    wordCount > summaryExercises[currentExercise].maxWords ||
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
                    "Submit Summary"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback on Your Summary</CardTitle>
                  <CardDescription>
                    Here's an analysis of your summary with suggestions for improvement.
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

                  <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                    <AlertTitle>Overall Assessment</AlertTitle>
                    <AlertDescription>{feedback.overall}</AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Key Points Covered
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {feedback.keyPointsCovered.map((point, index) => (
                            <li key={index} className="text-sm">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          Key Points Missed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {feedback.keyPointsMissed.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {feedback.keyPointsMissed.map((point, index) => (
                              <li key={index} className="text-sm">
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-green-600">Great job! You covered all the key points.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Suggestions for Improvement</h3>
                    <ul className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("write")}>
                    View Summary
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
