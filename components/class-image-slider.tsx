"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface ClassImageSliderProps {
  className: string
  customImages?: string[] // Add support for custom images
}

export function ClassImageSlider({ className, customImages }: ClassImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Use custom images if provided, otherwise generate placeholders
  const slides = customImages
    ? customImages.map((url, i) => ({
        url,
        alt: `${className} Image ${i + 1}`,
      }))
    : Array.from({ length: 10 }, (_, i) => ({
        url: `/placeholder.svg?height=300&width=400&text=${className}_${i + 1}`,
        alt: `${className} Image ${i + 1}`,
      }))

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide.url || "/placeholder.svg"}
          alt={slide.alt}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 z-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
