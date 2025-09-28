"use client"

import { useEffect, useRef } from "react"
import { trackTimeSpent } from "@/lib/tracking-utils"

export function useTimeTracking(studentId: number | null) {
  const lastActivityRef = useRef<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef<boolean>(true)

  useEffect(() => {
    if (!studentId) return

    // Function to track time
    const trackTime = async () => {
      if (!isActiveRef.current) return

      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current

      // Only track if less than 5 minutes of inactivity (to avoid tracking idle time)
      if (timeSinceLastActivity < 5 * 60 * 1000) {
        // Convert to seconds
        const sessionDuration = Math.floor(timeSinceLastActivity / 1000)

        if (sessionDuration > 0) {
          await trackTimeSpent(studentId, sessionDuration)
        }
      }

      lastActivityRef.current = now
    }

    // Set up activity tracking
    const handleActivity = () => {
      isActiveRef.current = true
      lastActivityRef.current = Date.now()
    }

    // Set up visibility change tracking
    const handleVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === "visible"

      if (!isActiveRef.current) {
        // Track time when page becomes hidden
        trackTime()
      } else {
        // Reset timer when page becomes visible again
        lastActivityRef.current = Date.now()
      }
    }

    // Set up interval to track time every minute
    intervalRef.current = setInterval(trackTime, 60 * 1000)

    // Add event listeners
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("click", handleActivity)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Initial activity
    handleActivity()

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Track time before unmounting
      trackTime()

      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("click", handleActivity)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [studentId])
}
