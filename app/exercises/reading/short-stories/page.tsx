"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"

const shortStory = {
  title: "The Lost Key",
  content: `
    Sarah was having a terrible day. She woke up late for work, spilled coffee on her new shirt, and now she couldn't find her keys. She looked everywhere: under the couch, in her coat pockets, and even in the refrigerator. Sometimes she put things in strange places when she was tired.
    
    "I'm going to be so late," she said to herself. She called her boss to explain the situation.
    
    Just as she was about to give up and call a locksmith, she heard a small jingling sound. It was coming from her cat's bed. There, beneath the blanket, were her keys! Her cat must have been playing with them.
    
    "You little troublemaker," Sarah said with a smile, petting her cat. She was still going to be late, but at least she had found her keys. Sometimes the things we lose are closer than we think.
  `,
  questions: [
    {
      id: 1,
      question: "Why was Sarah having a terrible day?",
      options: [
        { id: "a", text: "She was sick" },
        { id: "b", text: "She woke up late, spilled coffee, and lost her keys" },
        { id: "c", text: "Her cat was missing" },
        { id: "d", text: "She had an argument with her boss" },
      ],
      correctAnswer: "b",
    },
    {
      id: 2,
      question: "Where did Sarah look for her keys?",
      options: [
        { id: "a", text: "In her car" },
        { id: "b", text: "At her office" },
        { id: "c", text: "Under the couch, in coat pockets, and in the refrigerator" },
        { id: "d", text: "In her purse" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      question: "Who had Sarah's keys?",
      options: [
        { id: "a", text: "Her boss" },
        { id: "b", text: "The locksmith" },
        { id: "c", text: "Her cat" },
        { id: "d", text: "Her roommate" },
      ],
      correctAnswer: "c",
    },
    {
      id: 4,
      question: "What was Sarah going to do before she found her keys?",
      options: [
        { id: "a", text: "Call a taxi" },
        { id: "b", text: "Call a locksmith" },
        { id: "c", text: "Go to work without the keys" },
        { id: "d", text: "Buy new keys" },
      ],
      correctAnswer: "b",
    },
    {
      id: 5,
      question: "What is the main message of the story?",
      options: [
        { id: "a", text: "Never trust your cat" },
        { id: "b", text: "Always wake up early" },
        { id: "c", text: "Sometimes what we're looking for is closer than we think" },
        { id: "d", text: "It's important to call your boss when you're late" },
      ],
      correctAnswer: "c",
    },
  ],
}

export default function ReadingShortStoriesPage() {
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)

  const handleAnswerSelection = (value: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(value)
    }
  }

  const checkAnswer = () => {
    setIsAnswerChecked(true)
    if (selectedAnswer === shortStory.questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)

    if (currentQuestion < shortStory.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setShowQuestions(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setScore(0)
    setIsQuizCompleted(false)
  }

  const progress = showQuestions ? ((currentQuestion + 1) / shortStory.questions.length) * 100 : 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reading Comprehension</h1>
          {showQuestions && (
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {shortStory.questions.length}
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />

        {!showQuestions ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{shortStory.title}</CardTitle>
              <CardDescription>Read the story carefully and then answer the questions that follow.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {shortStory.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowQuestions(true)}>Continue to Questions</Button>
            </CardFooter>
          </Card>
        ) : !isQuizCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">{shortStory.questions[currentQuestion].question}</CardTitle>
              <CardDescription>Select the correct answer based on the story you just read.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                {shortStory.questions[currentQuestion].options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      isAnswerChecked && option.id === shortStory.questions[currentQuestion].correctAnswer
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
                      {isAnswerChecked && option.id === shortStory.questions[currentQuestion].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswerChecked &&
                        option.id === selectedAnswer &&
                        option.id !== shortStory.questions[currentQuestion].correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerChecked ? (
                <Button onClick={checkAnswer} disabled={!selectedAnswer}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {currentQuestion < shortStory.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
              <div className="text-sm font-medium">
                Score: {score}/{shortStory.questions.length}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reading Comprehension Complete!</CardTitle>
              <CardDescription>You've completed the reading comprehension exercise.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-4">
                {score}/{shortStory.questions.length}
              </div>
              <Progress value={(score / shortStory.questions.length) * 100} className="h-2 mb-4" />
              <p className="text-muted-foreground">
                {score === shortStory.questions.length
                  ? "Perfect score! Excellent reading comprehension skills!"
                  : score >= shortStory.questions.length * 0.8
                    ? "Great job! You understood the story very well."
                    : score >= shortStory.questions.length * 0.6
                      ? "Good effort! Keep practicing to improve your reading comprehension."
                      : "Keep practicing to improve your reading comprehension skills."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={restartQuiz}>Read Another Story</Button>
              <Button variant="outline">Back to Exercises</Button>
            </CardFooter>
          </Card>
        )}
      </DashboardShell>
    </div>
  )
}
