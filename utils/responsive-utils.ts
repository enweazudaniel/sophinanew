"use client"

import { useEffect, useState } from "react"

// Breakpoints that match Tailwind's default breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

/**
 * Custom hook to detect if the viewport is mobile-sized
 * @param breakpoint The breakpoint to check against (default: md)
 * @returns Boolean indicating if the viewport is smaller than the breakpoint
 */
export function useIsMobile(breakpoint: keyof typeof breakpoints = "md"): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if window width is less than the breakpoint
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoints[breakpoint])
    }

    // Check on mount
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}

/**
 * Custom hook to get the current viewport size
 * @returns Object with width and height of the viewport
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    // Function to update size
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Check on mount
    updateSize()

    // Add event listener for window resize
    window.addEventListener("resize", updateSize)

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return size
}

/**
 * Custom hook to detect the current breakpoint
 * @returns The current breakpoint as a string ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export function useBreakpoint() {
  const { width } = useViewportSize()

  if (width < breakpoints.sm) return "xs"
  if (width < breakpoints.md) return "sm"
  if (width < breakpoints.lg) return "md"
  if (width < breakpoints.xl) return "lg"
  if (width < breakpoints["2xl"]) return "xl"
  return "2xl"
}
