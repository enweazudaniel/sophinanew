"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { getLessonCompletionStatus } from "@/lib/tracking-utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LessonStatusProps {
  studentId: number
  lessonId: number
  showScore?: boolean
}

export function LessonStatus({ studentId, lessonId, showScore = true }: LessonStatusProps) {
  const [status, setStatus] = useState<{
    completed: boolean
    score: number
    completed_at: string
    attempts: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      if (!studentId || !lessonId) return

      setLoading(true)
      try {
        const completionData = await getLessonCompletionStatus(studentId, lessonId)

        if (completionData) {
          setStatus({
            completed: true,
            score: completionData.score,
            completed_at: completionData.completed_at,
            attempts: completionData.attempts || 1,
          })
        } else {
          setStatus(null)
        }
      } catch (error) {
        console.error("Error fetching lesson status:", error)
        setStatus(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [studentId, lessonId])

  if (loading) {
    return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
  }

  if (!status) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Not completed yet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {showScore && <span className="ml-1 text-xs font-medium text-green-500">{status.score}%</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>Completed on {new Date(status.completed_at).toLocaleDateString()}</p>
            <p>Score: {status.score}%</p>
            <p>Attempts: {status.attempts}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
