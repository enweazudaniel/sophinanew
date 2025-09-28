"use client"

import { useState, useEffect } from "react"
import type { SRSItem, ResponseQuality } from "@/lib/srs-utils"

interface UseSRSProps {
  studentId: number
  limit?: number
}

interface UseSRSReturn {
  currentItem: SRSItem | null
  isLoading: boolean
  isComplete: boolean
  progress: {
    reviewed: number
    total: number
  }
  handleResponse: (quality: ResponseQuality) => Promise<void>
  error: string | null
}

export function useSRS({ studentId, limit = 20 }: UseSRSProps): UseSRSReturn {
  const [items, setItems] = useState<SRSItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewStartTime, setReviewStartTime] = useState<number>(Date.now())

  // Fetch due items on mount
  useEffect(() => {
    async function fetchDueItems() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/srs/due-items?studentId=${studentId}&limit=${limit}`)

        if (!response.ok) {
          throw new Error("Failed to fetch due items")
        }

        const data = await response.json()
        setItems(data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching SRS items:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDueItems()
  }, [studentId, limit])

  // Reset review start time when current item changes
  useEffect(() => {
    setReviewStartTime(Date.now())
  }, [currentIndex])

  // Handle user response to current item
  const handleResponse = async (quality: ResponseQuality) => {
    if (!items.length || currentIndex >= items.length) return

    const currentItem = items[currentIndex]
    const timeTaken = Date.now() - reviewStartTime

    try {
      // Record the review
      const response = await fetch("/api/srs/record-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: currentItem.id,
          studentId,
          responseQuality: quality,
          timeTaken,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to record review")
      }

      // Move to next item
      setCurrentIndex((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record review")
      console.error("Error recording review:", err)
    }
  }

  return {
    currentItem: items.length > 0 && currentIndex < items.length ? items[currentIndex] : null,
    isLoading,
    isComplete: items.length > 0 && currentIndex >= items.length,
    progress: {
      reviewed: currentIndex,
      total: items.length,
    },
    handleResponse,
    error,
  }
}
