"use client"

import { useEffect, useState } from "react"
import { markLessonCompleted, refreshStudentMetrics } from "@/lib/tracking-utils"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface LessonCompletionProps {
  studentId: number
  lessonId: number
  score: number
  onComplete?: () => void
  showIndicator?: boolean
}

export function LessonCompletion({
  studentId,
  lessonId,
  score,
  onComplete,
  showIndicator = false,
}: LessonCompletionProps) {
  const { toast } = useToast()
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const updateCompletion = async () => {
      if (studentId && lessonId && score > 0 && !isCompleted && !isCompleting) {
        setIsCompleting(true)
        try {
          console.log(
            `LessonCompletion component: Marking lesson ${lessonId} as completed for student ${studentId} with score ${score}`,
          )
          const success = await markLessonCompleted(studentId, lessonId, score)

          if (success) {
            setIsCompleted(true)
            console.log("Successfully marked lesson as completed")

            // Refresh metrics to ensure dashboard is updated
            await refreshStudentMetrics(studentId)

            toast({
              title: "Progress saved",
              description: "Your lesson progress has been recorded.",
            })

            if (onComplete) {
              onComplete()
            }
          } else {
            console.error(`Failed to mark lesson ${lessonId} as completed.`)
            toast({
              title: "Error saving progress",
              description: "There was a problem saving your progress. Please try again.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error in lesson completion:", error)
          toast({
            title: "Error saving progress",
            description: "There was a problem saving your progress. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsCompleting(false)
        }
      }
    }

    updateCompletion()
  }, [studentId, lessonId, score, onComplete, isCompleted, isCompleting, toast])

  if (!showIndicator) return null

  return (
    <div className="flex items-center justify-center">
      {isCompleting ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : isCompleted ? (
        <div className="text-sm text-green-500 font-medium">Progress saved!</div>
      ) : null}
    </div>
  )
}
