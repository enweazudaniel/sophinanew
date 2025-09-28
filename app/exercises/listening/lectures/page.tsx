"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Volume2, Pause, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { getOrGenerateAudio } from "@/utils/audio-utils"

const lectureExercises = [
  {
    id: 1,
    title: "Introduction to Climate Change",
    subject: "Environmental Science",
    level: "Intermediate",
    description: "Listen to the lecture about climate change and answer the questions.",
    transcript: `Today, I want to talk about climate change, one of the most pressing issues of our time. Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas, which produces heat-trapping gases.

The primary cause of climate change is the greenhouse effect. When we burn fossil fuels, we release greenhouse gases like carbon dioxide and methane into the atmosphere. These gases trap the sun's heat and prevent it from escaping back into space, much like a greenhouse. This leads to global warming, which is the long-term heating of Earth's climate system.

The effects of climate change are far-reaching and include rising global temperatures, melting ice caps and glaciers, rising sea levels, and more frequent and severe weather events such as hurricanes, floods, and droughts. These changes affect ecosystems, wildlife, and human communities around the world.

To address climate change, we need both mitigation and adaptation strategies. Mitigation involves reducing greenhouse gas emissions through actions like transitioning to renewable energy sources, improving energy efficiency, and protecting forests. Adaptation involves adjusting to the actual or expected effects of climate change, such as building sea walls to protect against rising sea levels or developing drought-resistant crops.

International cooperation is essential in combating climate change. The Paris Agreement, adopted in 2015, is a landmark international accord that aims to limit global warming to well below 2 degrees Celsius above pre-industrial levels. However, current pledges from countries are not sufficient to meet this goal, and more ambitious action is needed.

Individual actions also play a crucial role. These include reducing energy consumption, using public transportation or electric vehicles, adopting plant-based diets, and supporting policies and businesses that prioritize sustainability.

In conclusion, climate change is a complex global challenge that requires urgent action at all levels of society. By understanding the causes and effects of climate change and taking steps to address it, we can work towards a more sustainable future for our planet.`,
    audioUrl: "/audio/climate-change-lecture.mp3",
    audioText:
      "Today, I want to talk about climate change, one of the most pressing issues of our time. Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas, which produces heat-trapping gases. The primary cause of climate change is the greenhouse effect. When we burn fossil fuels, we release greenhouse gases like carbon dioxide and methane into the atmosphere. These gases trap the sun's heat and prevent it from escaping back into space, much like a greenhouse. This leads to global warming, which is the long-term heating of Earth's climate system. The effects of climate change are far-reaching and include rising global temperatures, melting ice caps and glaciers, rising sea levels, and more frequent and severe weather events such as hurricanes, floods, and droughts. These changes affect ecosystems, wildlife, and human communities around the world. To address climate change, we need both mitigation and adaptation strategies. Mitigation involves reducing greenhouse gas emissions through actions like transitioning to renewable energy sources, improving energy efficiency, and protecting forests. Adaptation involves adjusting to the actual or expected effects of climate change, such as building sea walls to protect against rising sea levels or developing drought-resistant crops. International cooperation is essential in combating climate change. The Paris Agreement, adopted in 2015, is a landmark international accord that aims to limit global warming to well below 2 degrees Celsius above pre-industrial levels. However, current pledges from countries are not sufficient to meet this goal, and more ambitious action is needed. Individual actions also play a crucial role. These include reducing energy consumption, using public transportation or electric vehicles, adopting plant-based diets, and supporting policies and businesses that prioritize sustainability. In conclusion, climate change is a complex global challenge that requires urgent action at all levels of society. By understanding the causes and effects of climate change and taking steps to address it, we can work towards a more sustainable future for our planet.",
    keyTerms: [
      {
        term: "Climate Change",
        definition:
          "Long-term shifts in temperatures and weather patterns, primarily caused by human activities since the 1800s.",
      },
      {
        term: "Greenhouse Effect",
        definition:
          "The trapping of the sun's heat by gases in the atmosphere, preventing it from escaping back into space.",
      },
      {
        term: "Global Warming",
        definition: "The long-term heating of Earth's climate system observed since the pre-industrial period.",
      },
      {
        term: "Mitigation",
        definition: "Actions to reduce greenhouse gas emissions and their concentration in the atmosphere.",
      },
      {
        term: "Adaptation",
        definition: "Adjusting to the actual or expected effects of climate change to reduce vulnerability.",
      },
      {
        term: "Paris Agreement",
        definition:
          "A 2015 international accord that aims to limit global warming to well below 2 degrees Celsius above pre-industrial levels.",
      },
    ],
    questions: [
      {
        id: 1,
        question: "According to the lecture, what is the main driver of climate change since the 1800s?",
        options: [
          { id: "a", text: "Natural weather patterns" },
          { id: "b", text: "Solar radiation" },
          { id: "c", text: "Human activities, primarily burning fossil fuels" },
          { id: "d", text: "Volcanic eruptions" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture states that 'since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas'.",
      },
      {
        id: 2,
        question: "What is the primary cause of the greenhouse effect?",
        options: [
          { id: "a", text: "Deforestation" },
          { id: "b", text: "Release of greenhouse gases like carbon dioxide and methane" },
          { id: "c", text: "Industrial pollution" },
          { id: "d", text: "Urban development" },
        ],
        correctAnswer: "b",
        explanation:
          "The lecture explains that 'When we burn fossil fuels, we release greenhouse gases like carbon dioxide and methane into the atmosphere. These gases trap the sun's heat and prevent it from escaping back into space, much like a greenhouse.'",
      },
      {
        id: 3,
        question: "Which of the following is NOT mentioned as an effect of climate change?",
        options: [
          { id: "a", text: "Rising global temperatures" },
          { id: "b", text: "Melting ice caps and glaciers" },
          { id: "c", text: "Increased agricultural productivity" },
          { id: "d", text: "More frequent and severe weather events" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture mentions rising global temperatures, melting ice caps and glaciers, rising sea levels, and more frequent and severe weather events as effects of climate change. Increased agricultural productivity is not mentioned.",
      },
      {
        id: 4,
        question: "What does mitigation involve in addressing climate change?",
        options: [
          { id: "a", text: "Building sea walls to protect against rising sea levels" },
          { id: "b", text: "Developing drought-resistant crops" },
          { id: "c", text: "Reducing greenhouse gas emissions" },
          { id: "d", text: "Relocating communities affected by climate change" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture states that 'Mitigation involves reducing greenhouse gas emissions through actions like transitioning to renewable energy sources, improving energy efficiency, and protecting forests.'",
      },
      {
        id: 5,
        question: "What is the goal of the Paris Agreement according to the lecture?",
        options: [
          { id: "a", text: "To eliminate all fossil fuel use by 2030" },
          { id: "b", text: "To limit global warming to well below 2 degrees Celsius above pre-industrial levels" },
          { id: "c", text: "To provide funding for developing countries affected by climate change" },
          { id: "d", text: "To establish a global carbon tax" },
        ],
        correctAnswer: "b",
        explanation:
          "The lecture mentions that 'The Paris Agreement, adopted in 2015, is a landmark international accord that aims to limit global warming to well below 2 degrees Celsius above pre-industrial levels.'",
      },
    ],
  },
  {
    id: 2,
    title: "The Basics of Economics",
    subject: "Economics",
    level: "Beginner",
    description: "Listen to the lecture about basic economic concepts and answer the questions.",
    transcript: `Today, we're going to explore some fundamental concepts in economics. Economics is the study of how societies use scarce resources to produce valuable goods and services and distribute them among different people. At its core, economics is about making choices in the face of scarcity.

Let's start with the concept of scarcity. Scarcity means that society has limited resources and therefore cannot produce all the goods and services people wish to have. Even the richest societies face scarcity because human wants exceed what can be produced with the available resources. This fundamental problem of scarcity leads to the need to make choices, and economics studies how these choices are made.

Next, let's discuss supply and demand, which are the forces that make market economies work. Demand refers to how much of a product or service consumers are willing and able to purchase at various prices. The law of demand states that, all else being equal, as the price of a good increases, the quantity demanded decreases, and vice versa. This creates a downward-sloping demand curve.

Supply, on the other hand, refers to how much of a product or service producers are willing and able to supply at various prices. The law of supply states that, all else being equal, as the price of a good increases, the quantity supplied increases, and vice versa. This creates an upward-sloping supply curve.

The point where the supply and demand curves intersect is called the equilibrium. At this point, the quantity demanded equals the quantity supplied, and there is no tendency for price to change. If the price is above equilibrium, there is a surplus, and the price tends to fall. If the price is below equilibrium, there is a shortage, and the price tends to rise.

Another important concept is opportunity cost. Opportunity cost is the value of the next best alternative that must be given up to get something. For example, if you choose to spend money on a new phone, the opportunity cost might be the vacation you could have taken with that money. Opportunity cost is a crucial concept because it helps us understand the real cost of our choices.

Finally, let's talk about economic systems. An economic system is the way a society organizes the production, distribution, and consumption of goods and services. The main types of economic systems are traditional, command, market, and mixed economies. Most modern economies are mixed economies, combining elements of both market and command systems.

In conclusion, economics provides a framework for understanding how societies allocate scarce resources. By studying concepts like scarcity, supply and demand, opportunity cost, and economic systems, we can better understand the choices made by individuals, businesses, and governments in our complex world.`,
    audioUrl: "/audio/economics-lecture.mp3",
    audioText:
      "Today, we're going to explore some fundamental concepts in economics. Economics is the study of how societies use scarce resources to produce valuable goods and services and distribute them among different people. At its core, economics is about making choices in the face of scarcity. Let's start with the concept of scarcity. Scarcity means that society has limited resources and therefore cannot produce all the goods and services people wish to have. Even the richest societies face scarcity because human wants exceed what can be produced with the available resources. This fundamental problem of scarcity leads to the need to make choices, and economics studies how these choices are made. Next, let's discuss supply and demand, which are the forces that make market economies work. Demand refers to how much of a product or service consumers are willing and able to purchase at various prices. The law of demand states that, all else being equal, as the price of a good increases, the quantity demanded decreases, and vice versa. This creates a downward-sloping demand curve. Supply, on the other hand, refers to how much of a product or service producers are willing and able to supply at various prices. The law of supply states that, all else being equal, as the price of a good increases, the quantity supplied increases, and vice versa. This creates an upward-sloping supply curve. The point where the supply and demand curves intersect is called the equilibrium. At this point, the quantity demanded equals the quantity supplied, and there is no tendency for price to change. If the price is above equilibrium, there is a surplus, and the price tends to fall. If the price is below equilibrium, there is a shortage, and the price tends to rise. Another important concept is opportunity cost. Opportunity cost is the value of the next best alternative that must be given up to get something. For example, if you choose to spend money on a new phone, the opportunity cost might be the vacation you could have taken with that money. Opportunity cost is a crucial concept because it helps us understand the real cost of our choices. Finally, let's talk about economic systems. An economic system is the way a society organizes the production, distribution, and consumption of goods and services. The main types of economic systems are traditional, command, market, and mixed economies. Most modern economies are mixed economies, combining elements of both market and command systems. In conclusion, economics provides a framework for understanding how societies allocate scarce resources. By studying concepts like scarcity, supply and demand, opportunity cost, and economic systems, we can better understand the choices made by individuals, businesses, and governments in our complex world.",
    keyTerms: [
      {
        term: "Economics",
        definition:
          "The study of how societies use scarce resources to produce valuable goods and services and distribute them among different people.",
      },
      {
        term: "Scarcity",
        definition: "The limited availability of resources relative to unlimited wants, necessitating choices.",
      },
      {
        term: "Demand",
        definition: "How much of a product or service consumers are willing and able to purchase at various prices.",
      },
      {
        term: "Supply",
        definition: "How much of a product or service producers are willing and able to supply at various prices.",
      },
      {
        term: "Equilibrium",
        definition:
          "The point where the supply and demand curves intersect, and the quantity demanded equals the quantity supplied.",
      },
      {
        term: "Opportunity Cost",
        definition: "The value of the next best alternative that must be given up to get something.",
      },
      {
        term: "Economic System",
        definition: "The way a society organizes the production, distribution, and consumption of goods and services.",
      },
    ],
    questions: [
      {
        id: 1,
        question: "According to the lecture, what is economics primarily about?",
        options: [
          { id: "a", text: "Making money" },
          { id: "b", text: "Business management" },
          { id: "c", text: "Making choices in the face of scarcity" },
          { id: "d", text: "Government regulation" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture states that 'At its core, economics is about making choices in the face of scarcity.'",
      },
      {
        id: 2,
        question:
          "What happens to the quantity demanded of a good when its price increases, according to the law of demand?",
        options: [
          { id: "a", text: "It increases" },
          { id: "b", text: "It decreases" },
          { id: "c", text: "It remains the same" },
          { id: "d", text: "It fluctuates unpredictably" },
        ],
        correctAnswer: "b",
        explanation:
          "The lecture explains that 'The law of demand states that, all else being equal, as the price of a good increases, the quantity demanded decreases, and vice versa.'",
      },
      {
        id: 3,
        question: "What is the point called where the supply and demand curves intersect?",
        options: [
          { id: "a", text: "Balance point" },
          { id: "b", text: "Market point" },
          { id: "c", text: "Equilibrium" },
          { id: "d", text: "Stability" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture states that 'The point where the supply and demand curves intersect is called the equilibrium.'",
      },
      {
        id: 4,
        question: "What is opportunity cost?",
        options: [
          { id: "a", text: "The monetary cost of a product" },
          { id: "b", text: "The value of the next best alternative that must be given up" },
          { id: "c", text: "The cost of producing goods and services" },
          { id: "d", text: "The cost of entering a market" },
        ],
        correctAnswer: "b",
        explanation:
          "The lecture defines opportunity cost as 'the value of the next best alternative that must be given up to get something.'",
      },
      {
        id: 5,
        question: "According to the lecture, what type of economic system do most modern economies have?",
        options: [
          { id: "a", text: "Traditional economies" },
          { id: "b", text: "Command economies" },
          { id: "c", text: "Market economies" },
          { id: "d", text: "Mixed economies" },
        ],
        correctAnswer: "d",
        explanation:
          "The lecture states that 'Most modern economies are mixed economies, combining elements of both market and command systems.'",
      },
    ],
  },
  {
    id: 3,
    title: "Introduction to Psychology",
    subject: "Psychology",
    level: "Intermediate",
    description: "Listen to the lecture about psychology and answer the questions.",
    transcript: `Welcome to our introduction to psychology. Psychology is the scientific study of the mind and behavior. It encompasses a wide range of topics, from brain function to social interactions, and uses various research methods to understand how people think, feel, and behave.

Psychology has a rich history that dates back to ancient civilizations, but it emerged as a distinct scientific discipline in the late 19th century. Wilhelm Wundt, often considered the father of psychology, established the first psychology laboratory in Leipzig, Germany, in 1879. Since then, psychology has evolved through various schools of thought, including structuralism, functionalism, behaviorism, psychoanalysis, humanism, and cognitive psychology.

Let's explore some of the major perspectives in psychology. The biological perspective emphasizes the physical and biological bases of behavior, including the role of the brain, nervous system, and genetics. The cognitive perspective focuses on mental processes such as perception, memory, thinking, and problem-solving. The behavioral perspective emphasizes the role of environmental factors in shaping behavior through learning and reinforcement. The psychodynamic perspective, rooted in Freud's psychoanalytic theory, emphasizes unconscious motivations and early childhood experiences. The humanistic perspective focuses on personal growth, free will, and the inherent goodness of human nature. The sociocultural perspective examines how social and cultural factors influence behavior.

Research methods in psychology include experiments, correlational studies, case studies, surveys, and naturalistic observation. Experiments are particularly valuable because they allow researchers to establish cause-and-effect relationships by manipulating variables and observing the results. However, each method has its strengths and limitations, and psychologists often use multiple methods to gain a comprehensive understanding of behavior.

Psychology has numerous applications in everyday life. Clinical psychology focuses on diagnosing and treating mental disorders. Educational psychology applies psychological principles to improve teaching and learning. Industrial-organizational psychology aims to enhance workplace productivity and employee well-being. Health psychology examines how psychological factors affect physical health. Forensic psychology applies psychological principles to legal issues. Sports psychology helps athletes improve performance and cope with pressure.

One of the most fascinating aspects of psychology is its relevance to our daily lives. Understanding psychological principles can help us improve our decision-making, enhance our relationships, manage stress more effectively, and gain insight into our own behavior and the behavior of others.

In conclusion, psychology is a diverse and dynamic field that seeks to understand the complexity of human behavior through scientific inquiry. By studying psychology, we gain valuable insights into ourselves and others, which can lead to personal growth and a deeper understanding of the human experience.`,
    audioUrl: "/audio/psychology-lecture.mp3",
    audioText:
      "Welcome to our introduction to psychology. Psychology is the scientific study of the mind and behavior. It encompasses a wide range of topics, from brain function to social interactions, and uses various research methods to understand how people think, feel, and behave. Psychology has a rich history that dates back to ancient civilizations, but it emerged as a distinct scientific discipline in the late 19th century. Wilhelm Wundt, often considered the father of psychology, established the first psychology laboratory in Leipzig, Germany, in 1879. Since then, psychology has evolved through various schools of thought, including structuralism, functionalism, behaviorism, psychoanalysis, humanism, and cognitive psychology. Let's explore some of the major perspectives in psychology. The biological perspective emphasizes the physical and biological bases of behavior, including the role of the brain, nervous system, and genetics. The cognitive perspective focuses on mental processes such as perception, memory, thinking, and problem-solving. The behavioral perspective emphasizes the role of environmental factors in shaping behavior through learning and reinforcement. The psychodynamic perspective, rooted in Freud's psychoanalytic theory, emphasizes unconscious motivations and early childhood experiences. The humanistic perspective focuses on personal growth, free will, and the inherent goodness of human nature. The sociocultural perspective examines how social and cultural factors influence behavior. Research methods in psychology include experiments, correlational studies, case studies, surveys, and naturalistic observation. Experiments are particularly valuable because they allow researchers to establish cause-and-effect relationships by manipulating variables and observing the results. However, each method has its strengths and limitations, and psychologists often use multiple methods to gain a comprehensive understanding of behavior. Psychology has numerous applications in everyday life. Clinical psychology focuses on diagnosing and treating mental disorders. Educational psychology applies psychological principles to improve teaching and learning. Industrial-organizational psychology aims to enhance workplace productivity and employee well-being. Health psychology examines how psychological factors affect physical health. Forensic psychology applies psychological principles to legal issues. Sports psychology helps athletes improve performance and cope with pressure. One of the most fascinating aspects of psychology is its relevance to our daily lives. Understanding psychological principles can help us improve our decision-making, enhance our relationships, manage stress more effectively, and gain insight into our own behavior and the behavior of others. In conclusion, psychology is a diverse and dynamic field that seeks to understand the complexity of human behavior through scientific inquiry. By studying psychology, we gain valuable insights into ourselves and others, which can lead to personal growth and a deeper understanding of the human experience.",
    keyTerms: [
      { term: "Psychology", definition: "The scientific study of the mind and behavior." },
      {
        term: "Wilhelm Wundt",
        definition: "Often considered the father of psychology, established the first psychology laboratory in 1879.",
      },
      {
        term: "Biological Perspective",
        definition:
          "Emphasizes the physical and biological bases of behavior, including the brain, nervous system, and genetics.",
      },
      {
        term: "Cognitive Perspective",
        definition: "Focuses on mental processes such as perception, memory, thinking, and problem-solving.",
      },
      {
        term: "Behavioral Perspective",
        definition:
          "Emphasizes the role of environmental factors in shaping behavior through learning and reinforcement.",
      },
      {
        term: "Psychodynamic Perspective",
        definition: "Rooted in Freud's theory, emphasizes unconscious motivations and early childhood experiences.",
      },
      {
        term: "Humanistic Perspective",
        definition: "Focuses on personal growth, free will, and the inherent goodness of human nature.",
      },
      { term: "Sociocultural Perspective", definition: "Examines how social and cultural factors influence behavior." },
      {
        term: "Experiment",
        definition:
          "A research method that allows researchers to establish cause-and-effect relationships by manipulating variables.",
      },
    ],
    questions: [
      {
        id: 1,
        question: "According to the lecture, what is psychology?",
        options: [
          { id: "a", text: "The study of mental disorders" },
          { id: "b", text: "The scientific study of the mind and behavior" },
          { id: "c", text: "The study of brain function" },
          { id: "d", text: "The study of human relationships" },
        ],
        correctAnswer: "b",
        explanation: "The lecture defines psychology as 'the scientific study of the mind and behavior.'",
      },
      {
        id: 2,
        question: "Who is often considered the father of psychology?",
        options: [
          { id: "a", text: "Sigmund Freud" },
          { id: "b", text: "B.F. Skinner" },
          { id: "c", text: "Wilhelm Wundt" },
          { id: "d", text: "Carl Rogers" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture states that 'Wilhelm Wundt, often considered the father of psychology, established the first psychology laboratory in Leipzig, Germany, in 1879.'",
      },
      {
        id: 3,
        question: "Which perspective in psychology emphasizes the role of environmental factors in shaping behavior?",
        options: [
          { id: "a", text: "Biological perspective" },
          { id: "b", text: "Cognitive perspective" },
          { id: "c", text: "Behavioral perspective" },
          { id: "d", text: "Psychodynamic perspective" },
        ],
        correctAnswer: "c",
        explanation:
          "The lecture explains that 'The behavioral perspective emphasizes the role of environmental factors in shaping behavior through learning and reinforcement.'",
      },
      {
        id: 4,
        question: "Which research method allows researchers to establish cause-and-effect relationships?",
        options: [
          { id: "a", text: "Case studies" },
          { id: "b", text: "Surveys" },
          { id: "c", text: "Correlational studies" },
          { id: "d", text: "Experiments" },
        ],
        correctAnswer: "d",
        explanation:
          "The lecture states that 'Experiments are particularly valuable because they allow researchers to establish cause-and-effect relationships by manipulating variables and observing the results.'",
      },
      {
        id: 5,
        question: "Which branch of psychology focuses on diagnosing and treating mental disorders?",
        options: [
          { id: "a", text: "Educational psychology" },
          { id: "b", text: "Clinical psychology" },
          { id: "c", text: "Industrial-organizational psychology" },
          { id: "d", text: "Health psychology" },
        ],
        correctAnswer: "b",
        explanation:
          "The lecture mentions that 'Clinical psychology focuses on diagnosing and treating mental disorders.'",
      },
    ],
  },
]

export default function LecturesPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [activeTab, setActiveTab] = useState("listen")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [notesTaken, setNotesTaken] = useState("")

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load or generate audio when exercise changes
  useEffect(() => {
    const loadAudio = async () => {
      setIsLoadingAudio(true)
      try {
        const url = await getOrGenerateAudio(
          lectureExercises[currentExercise].audioUrl,
          lectureExercises[currentExercise].audioText,
        )
        setAudioUrl(url)
      } catch (error) {
        console.error("Error loading audio:", error)
        // Fallback to the original URL if there's an error
        setAudioUrl(lectureExercises[currentExercise].audioUrl)
      } finally {
        setIsLoadingAudio(false)
      }
    }

    loadAudio()

    // Preload audio for the next exercise if available
    if (currentExercise < lectureExercises.length - 1) {
      getOrGenerateAudio(
        lectureExercises[currentExercise + 1].audioUrl,
        lectureExercises[currentExercise + 1].audioText,
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
    if (selectedAnswer === lectureExercises[currentExercise].questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setShowExplanation(false)

    if (currentQuestion < lectureExercises[currentExercise].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentExercise < lectureExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentQuestion(0)
      setActiveTab("listen")
      setNotesTaken("")
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
    setActiveTab("listen")
    setNotesTaken("")
  }

  // Calculate total questions across all exercises
  const totalQuestions = lectureExercises.reduce((total, exercise) => total + exercise.questions.length, 0)

  // Calculate completed questions
  let completedQuestions = 0
  for (let i = 0; i < currentExercise; i++) {
    completedQuestions += lectureExercises[i].questions.length
  }
  completedQuestions += currentQuestion

  const progress = (completedQuestions / totalQuestions) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Academic Lectures</h1>
          <div className="text-sm text-muted-foreground">
            Lecture {currentExercise + 1} of {lectureExercises.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        {!isExerciseCompleted ? (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{lectureExercises[currentExercise].title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{lectureExercises[currentExercise].subject}</Badge>
                  <Badge>{lectureExercises[currentExercise].level}</Badge>
                </div>
              </div>
              <CardDescription>{lectureExercises[currentExercise].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="listen">Listen</TabsTrigger>
                  <TabsTrigger value="notes">Take Notes</TabsTrigger>
                  <TabsTrigger value="questions" disabled={activeTab === "listen" && !notesTaken.trim()}>
                    Questions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="listen" className="space-y-4 pt-4">
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
                          Pause Lecture
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-5 w-5" />
                          Play Lecture
                        </>
                      )}
                    </Button>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Listening Tips</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>Listen carefully for key concepts and main ideas</li>
                        <li>Pay attention to examples that illustrate important points</li>
                        <li>Note any definitions or technical terms mentioned</li>
                        <li>Consider taking notes to help remember important information</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Key Terms:</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {lectureExercises[currentExercise].keyTerms.slice(0, 4).map((term, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{term.term}:</span> {term.definition}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button onClick={() => setActiveTab("notes")} disabled={isPlaying}>
                      Continue to Take Notes
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 pt-4">
                  <div className="flex justify-between mb-4">
                    <Button
                      variant="outline"
                      onClick={playAudio}
                      className="flex gap-2"
                      disabled={isLoadingAudio || !audioUrl}
                    >
                      {isLoadingAudio ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : isPlaying ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          Listen Again
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("listen")}>
                      Back to Lecture
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Your Notes:</Label>
                    <textarea
                      id="notes"
                      className="w-full min-h-[200px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Take notes on the lecture here..."
                      value={notesTaken}
                      onChange={(e) => setNotesTaken(e.target.value)}
                    />
                  </div>

                  <Alert className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Taking notes helps you remember key information. Try to summarize the main points in your own
                      words.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-center mt-4">
                    <Button onClick={() => setActiveTab("questions")} disabled={!notesTaken.trim()}>
                      Continue to Questions
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4 pt-4">
                  <div className="text-lg font-medium">
                    Question {currentQuestion + 1}:{" "}
                    {lectureExercises[currentExercise].questions[currentQuestion].question}
                  </div>

                  <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                    {lectureExercises[currentExercise].questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 rounded-md border p-4 ${
                          isAnswerChecked &&
                          option.id === lectureExercises[currentExercise].questions[currentQuestion].correctAnswer
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
                              lectureExercises[currentExercise].questions[currentQuestion].correctAnswer && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          {isAnswerChecked &&
                            option.id === selectedAnswer &&
                            option.id !==
                              lectureExercises[currentExercise].questions[currentQuestion].correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {showExplanation && (
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      <AlertDescription>
                        {lectureExercises[currentExercise].questions[currentQuestion].explanation}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("notes")} disabled={isAnswerChecked}>
                      Review Notes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={playAudio}
                      disabled={isLoadingAudio || !audioUrl || isAnswerChecked}
                    >
                      Listen Again
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              {activeTab === "questions" && (
                <>
                  {!isAnswerChecked ? (
                    <Button onClick={checkAnswer} disabled={!selectedAnswer}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQuestion < lectureExercises[currentExercise].questions.length - 1
                        ? "Next Question"
                        : currentExercise < lectureExercises.length - 1
                          ? "Next Lecture"
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
              <CardDescription>You've completed all the lecture exercises.</CardDescription>
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
                    ? "Great job! You have strong academic listening skills."
                    : score >= totalQuestions * 0.6
                      ? "Good effort! Keep practicing to improve your academic listening skills."
                      : "Keep practicing to improve your academic listening comprehension skills."}
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
