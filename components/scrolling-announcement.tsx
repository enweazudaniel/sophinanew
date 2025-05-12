"use client"

import { useEffect, useRef } from "react"

interface ScrollingAnnouncementProps {
  text: string
  speed?: number // pixels per second
  className?: string
}

export function ScrollingAnnouncement({ text, speed = 50, className = "" }: ScrollingAnnouncementProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    // Create duplicate content for seamless scrolling
    const content = contentRef.current
    const container = containerRef.current

    // Calculate animation duration based on content width and speed
    const contentWidth = content.offsetWidth
    const duration = contentWidth / speed

    // Set animation properties
    content.style.animationDuration = `${duration}s`

    // Create a duplicate of the content for seamless scrolling
    const clone = content.cloneNode(true) as HTMLDivElement
    container.appendChild(clone)

    // Clean up
    return () => {
      if (container.contains(clone)) {
        container.removeChild(clone)
      }
    }
  }, [speed, text])

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden whitespace-nowrap bg-primary/10 py-3 ${className}`}
      aria-live="polite"
      role="marquee"
    >
      <div
        ref={contentRef}
        className="inline-block animate-marquee"
        style={{
          animationName: "scroll",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <span className="mx-4 text-primary font-semibold">{text}</span>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-marquee {
          animation: scroll 15s linear infinite;
        }
      `}</style>
    </div>
  )
}
