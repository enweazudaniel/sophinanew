"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const articlesPrepositionsExercises = [
  {
    id: 1,
    title: "Articles",
    description: "Fill in the blanks with the appropriate article (a, an, the) or leave blank if no article is needed.",
    questions: [
      {
        id: 1,
        sentence: "I saw ____ elephant at ____ zoo last weekend.",
        answers: ["an", "the"],
        explanation:
          "We use 'an' before words that begin with a vowel sound. 'The' is used when referring to a specific zoo that both the speaker and listener know about.",
      },
      {
        id: 2,
        sentence: "She's ____ doctor who works at ____ hospital in ____ city center.",
        answers: ["a", "the", "the"],
        explanation:
          "'A' is used when introducing a person's profession. 'The' is used for specific places that are understood in the context.",
      },
      {
        id: 3,
        sentence: "____ honesty is ____ best policy in ____ business.",
        answers: ["", "the", ""],
        explanation:
          "No article is used before abstract nouns like 'honesty' when speaking generally. 'The' is used with superlatives like 'best'. No article is used before 'business' when speaking about business in general.",
      },
      {
        id: 4,
        sentence: "I'd like ____ apple and ____ orange for ____ breakfast.",
        answers: ["an", "an", ""],
        explanation:
          "'An' is used before words starting with vowel sounds. No article is used before meals like 'breakfast' when speaking generally.",
      },
      {
        id: 5,
        sentence: "____ Eiffel Tower is in ____ Paris, which is ____ capital of France.",
        answers: ["The", "", "the"],
        explanation:
          "'The' is used with unique landmarks. No article is used before most city names. 'The' is used before 'capital' because it's a specific role.",
      },
    ],
  },
  {
    id: 2,
    title: "Prepositions of Place",
    description: "Fill in the blanks with the appropriate preposition of place (in, on, at, etc.).",
    questions: [
      {
        id: 1,
        sentence: "The book is ____ the table ____ the living room.",
        answers: ["on", "in"],
        explanation: "We use 'on' for surfaces and 'in' for enclosed spaces or rooms.",
      },
      {
        id: 2,
        sentence: "She's waiting ____ the bus stop ____ the corner of the street.",
        answers: ["at", "on"],
        explanation:
          "We use 'at' for specific points or locations and 'on' for corners, intersections, or sides of streets.",
      },
      {
        id: 3,
        sentence: "The painting is hanging ____ the wall ____ the fireplace.",
        answers: ["on", "above"],
        explanation:
          "We use 'on' for vertical surfaces like walls and 'above' to indicate a higher position relative to another object.",
      },
      {
        id: 4,
        sentence: "There's a garden ____ the back of the house and a tree ____ the garden.",
        answers: ["at", "in"],
        explanation:
          "We use 'at' to indicate a specific location relative to something else and 'in' for enclosed spaces.",
      },
      {
        id: 5,
        sentence: "The cat is sleeping ____ the sofa, and the dog is ____ the floor.",
        answers: ["on", "on"],
        explanation: "We use 'on' for surfaces where objects or people are positioned.",
      },
    ],
  },
  {
    id: 3,
    title: "Prepositions of Time",
    description: "Fill in the blanks with the appropriate preposition of time (in, on, at, etc.).",
    questions: [
      {
        id: 1,
        sentence: "My birthday is ____ May 15th. I was born ____ 1995.",
        answers: ["on", "in"],
        explanation: "We use 'on' for specific dates and 'in' for years, months, and longer periods of time.",
      },
      {
        id: 2,
        sentence: "The meeting starts ____ 9:30 AM ____ Monday morning.",
        answers: ["at", "on"],
        explanation: "We use 'at' for specific times and 'on' for days of the week.",
      },
      {
        id: 3,
        sentence: "I usually go on vacation ____ the summer, especially ____ August.",
        answers: ["in", "in"],
        explanation: "We use 'in' for seasons and months.",
      },
      {
        id: 4,
        sentence: "The store is closed ____ Sundays and ____ Christmas Day.",
        answers: ["on", "on"],
        explanation: "We use 'on' for days of the week and specific days or dates.",
      },
      {
        id: 5,
        sentence: "The concert will end ____ midnight, so we'll be home ____ 1:00 AM.",
        answers: ["at", "by"],
        explanation:
          "We use 'at' for specific times and 'by' to indicate a deadline or the latest time something will happen.",
      },
    ],
  },
  {
    id: 4,
    title: "Prepositions of Movement",
    description: "Fill in the blanks with the appropriate preposition of movement (to, from, through, etc.).",
    questions: [
      {
        id: 1,
        sentence: "She walked ____ the room and went ____ the stairs.",
        answers: ["into", "up"],
        explanation:
          "We use 'into' to indicate movement from outside to inside an enclosed space and 'up' for movement to a higher position.",
      },
      {
        id: 2,
        sentence: "The ball rolled ____ the hill and fell ____ the river.",
        answers: ["down", "into"],
        explanation: "We use 'down' for movement to a lower position and 'into' for movement from outside to inside.",
      },
      {
        id: 3,
        sentence: "We drove ____ the tunnel and emerged ____ the other side.",
        answers: ["through", "on"],
        explanation:
          "We use 'through' for movement from one end to the other of an enclosed space and 'on' for position on a surface or side.",
      },
      {
        id: 4,
        sentence: "The cat jumped ____ the table and ran ____ the door.",
        answers: ["onto", "towards"],
        explanation:
          "We use 'onto' for movement to a position on a surface and 'towards' for movement in the direction of something.",
      },
      {
        id: 5,
        sentence: "The bird flew ____ the window and escaped ____ the cage.",
        answers: ["through", "from"],
        explanation:
          "We use 'through' for movement via an opening and 'from' to indicate the starting point of movement.",
      },
    ],
  },
]

export default function ArticlesPrepositionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(articlesPrepositionsExercises[currentExercise].questions[currentQuestion].answers.length).fill(""),
  )
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState("practice")

  const handleAnswerChange = (index: number, value: string) => {
    if (!isAnswerChecked) {
      const newAnswers = [...userAnswers]
      newAnswers[index] = value
      setUserAnswers(newAnswers)
    }
  }

  const checkAnswer = () => {
    const correctAnswers = articlesPrepositionsExercises[currentExercise].questions[currentQuestion].answers
    const correct = userAnswers.map(
      (answer, index) => answer.toLowerCase().trim() === correctAnswers[index].toLowerCase(),
    )

    setIsCorrect(correct)
    setIsAnswerChecked(true)
    setShowExplanation(true)

    // Add to score if all answers are correct
    if (correct.every((c) => c)) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setUserAnswers(
      Array(articlesPrepositionsExercises[currentExercise].questions[currentQuestion + 1]?.answers.length || 0).fill(
        "",
      ),
    )
    setIsAnswerChecked(false)
    setShowExplanation(false)

    if (currentQuestion < articlesPrepositionsExercises[currentExercise].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentExercise < articlesPrepositionsExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentQuestion(0)
    } else {
      setIsExerciseCompleted(true)
    }
  }

  const restartExercise = () => {
    setCurrentExercise(0)
    setCurrentQuestion(0)
    setUserAnswers(Array(articlesPrepositionsExercises[0].questions[0].answers.length).fill(""))
    setIsAnswerChecked(false)
    setShowExplanation(false)
    setScore(0)
    setIsExerciseCompleted(false)
    setActiveTab("practice")
  }

  // Calculate total questions across all exercises
  const totalQuestions = articlesPrepositionsExercises.reduce((total, exercise) => total + exercise.questions.length, 0)

  // Calculate completed questions
  let completedQuestions = 0
  for (let i = 0; i < currentExercise; i++) {
    completedQuestions += articlesPrepositionsExercises[i].questions.length
  }
  completedQuestions += currentQuestion

  const progress = (completedQuestions / totalQuestions) * 100

  // Parse the sentence to identify where the blanks should be
  const parseSentence = (sentence: string) => {
    const parts = sentence.split("____")
    return parts
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Articles & Prepositions</h1>
          <div className="text-sm text-muted-foreground">
            Exercise {currentExercise + 1} of {articlesPrepositionsExercises.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="reference">Reference Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="practice">
            {!isExerciseCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle>{articlesPrepositionsExercises[currentExercise].title}</CardTitle>
                  <CardDescription>{articlesPrepositionsExercises[currentExercise].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-lg font-medium">
                    Question {currentQuestion + 1} of {articlesPrepositionsExercises[currentExercise].questions.length}
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    {(() => {
                      const currentSentence =
                        articlesPrepositionsExercises[currentExercise].questions[currentQuestion].sentence
                      const parts = parseSentence(currentSentence)

                      return (
                        <div className="flex flex-wrap items-center gap-2">
                          {parts.map((part, index) => (
                            <React.Fragment key={index}>
                              <span>{part}</span>
                              {index < parts.length - 1 && (
                                <div className="inline-flex flex-col gap-1">
                                  <div className="flex items-center gap-1">
                                    <Input
                                      value={userAnswers[index] || ""}
                                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                                      className={`w-20 ${
                                        isAnswerChecked
                                          ? isCorrect[index]
                                            ? "border-green-500 focus-visible:ring-green-500"
                                            : "border-red-500 focus-visible:ring-red-500"
                                          : ""
                                      }`}
                                      disabled={isAnswerChecked}
                                      placeholder="..."
                                    />
                                    {isAnswerChecked &&
                                      (isCorrect[index] ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      ))}
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  {showExplanation && (
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      <AlertDescription>
                        {articlesPrepositionsExercises[currentExercise].questions[currentQuestion].explanation}
                      </AlertDescription>
                    </Alert>
                  )}

                  {isAnswerChecked && !isCorrect.every((c) => c) && (
                    <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                      <AlertDescription>
                        <span className="font-medium">
                          Correct answer
                          {articlesPrepositionsExercises[currentExercise].questions[currentQuestion].answers.length > 1
                            ? "s"
                            : ""}
                          :
                        </span>{" "}
                        {articlesPrepositionsExercises[currentExercise].questions[currentQuestion].answers.map(
                          (answer, index) => (
                            <span key={index}>
                              {index > 0 && ", "}
                              <span className="font-medium">{answer || "(no article/preposition)"}</span>
                            </span>
                          ),
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!isAnswerChecked ? (
                    <Button onClick={checkAnswer} disabled={userAnswers.some((answer) => answer.trim() === "")}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQuestion < articlesPrepositionsExercises[currentExercise].questions.length - 1
                        ? "Next Question"
                        : currentExercise < articlesPrepositionsExercises.length - 1
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
              <Card>
                <CardHeader>
                  <CardTitle>Exercise Completed!</CardTitle>
                  <CardDescription>You've completed all the articles and prepositions exercises.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold mb-4">
                    {score}/{totalQuestions}
                  </div>
                  <Progress value={(score / totalQuestions) * 100} className="h-2 mb-4" />
                  <p className="text-muted-foreground">
                    {score === totalQuestions
                      ? "Perfect score! You have an excellent understanding of articles and prepositions!"
                      : score >= totalQuestions * 0.8
                        ? "Great job! You have a strong grasp of articles and prepositions."
                        : score >= totalQuestions * 0.6
                          ? "Good effort! Keep practicing to improve your understanding of articles and prepositions."
                          : "Keep practicing to improve your understanding of articles and prepositions."}
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
          </TabsContent>

          <TabsContent value="reference">
            <Card>
              <CardHeader>
                <CardTitle>Articles & Prepositions Reference Guide</CardTitle>
                <CardDescription>
                  A quick reference guide to help you understand when and how to use articles and prepositions
                  correctly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Articles</h3>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Definite Article: "the"</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Used for specific nouns that both the speaker and listener know about</li>
                        <li>
                          Used with unique items: <em>the sun, the moon, the White House</em>
                        </li>
                        <li>
                          Used with superlatives: <em>the best, the tallest</em>
                        </li>
                        <li>
                          Used with ordinal numbers: <em>the first, the second</em>
                        </li>
                        <li>
                          Used with musical instruments: <em>the piano, the guitar</em>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Indefinite Articles: "a" and "an"</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Used when talking about something for the first time</li>
                        <li>Used with singular countable nouns</li>
                        <li>
                          Use "a" before consonant sounds: <em>a book, a university</em>
                        </li>
                        <li>
                          Use "an" before vowel sounds: <em>an apple, an hour</em>
                        </li>
                        <li>
                          Used with professions: <em>She is a doctor.</em>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">No Article (Zero Article)</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Used with plural and uncountable nouns when speaking generally:{" "}
                          <em>Dogs are loyal. Water is essential.</em>
                        </li>
                        <li>
                          Used with most countries, cities, streets: <em>France, London, Oxford Street</em>
                        </li>
                        <li>
                          Used with meals: <em>breakfast, lunch, dinner</em>
                        </li>
                        <li>
                          Used with languages and sports: <em>English, football</em>
                        </li>
                        <li>
                          Used with abstract nouns when speaking generally: <em>love, happiness, education</em>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Prepositions</h3>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Prepositions of Place</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>In</strong>: inside an enclosed space (in a box, in London)
                        </li>
                        <li>
                          <strong>On</strong>: on a surface (on the table, on the wall)
                        </li>
                        <li>
                          <strong>At</strong>: at a specific point or location (at the door, at the station)
                        </li>
                        <li>
                          <strong>Under</strong>: beneath something (under the table)
                        </li>
                        <li>
                          <strong>Above/Over</strong>: higher than something (above/over the fireplace)
                        </li>
                        <li>
                          <strong>Below/Under</strong>: lower than something (below/under the window)
                        </li>
                        <li>
                          <strong>Between</strong>: in the middle of two things (between the trees)
                        </li>
                        <li>
                          <strong>Among</strong>: in a group of things (among the flowers)
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Prepositions of Time</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>In</strong>: months, years, seasons, parts of the day (in May, in 2023, in summer, in
                          the morning)
                        </li>
                        <li>
                          <strong>On</strong>: days, dates (on Monday, on May 5th)
                        </li>
                        <li>
                          <strong>At</strong>: specific times, holidays (at 3 o'clock, at noon, at Christmas)
                        </li>
                        <li>
                          <strong>For</strong>: duration (for two hours, for a week)
                        </li>
                        <li>
                          <strong>Since</strong>: starting point in time (since Monday, since 1999)
                        </li>
                        <li>
                          <strong>By</strong>: deadline (by Friday, by next week)
                        </li>
                        <li>
                          <strong>Until/Till</strong>: up to a certain time (until Monday, till 5 PM)
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Prepositions of Movement</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>To</strong>: movement toward (go to London)
                        </li>
                        <li>
                          <strong>From</strong>: movement away from (come from Paris)
                        </li>
                        <li>
                          <strong>Into</strong>: movement to the inside (walk into the room)
                        </li>
                        <li>
                          <strong>Out of</strong>: movement from inside to outside (get out of the car)
                        </li>
                        <li>
                          <strong>Up</strong>: movement upward (climb up the ladder)
                        </li>
                        <li>
                          <strong>Down</strong>: movement downward (walk down the stairs)
                        </li>
                        <li>
                          <strong>Along</strong>: movement following a line (walk along the river)
                        </li>
                        <li>
                          <strong>Through</strong>: movement from one side to the other (drive through the tunnel)
                        </li>
                        <li>
                          <strong>Across</strong>: movement from one side to the other (swim across the lake)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("practice")} className="w-full">
                  Back to Practice
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}
