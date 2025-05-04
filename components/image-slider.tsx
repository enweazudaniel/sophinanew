"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface Slide {
  url: string
  alt: string
}

interface ImageSliderProps {
  slides: Slide[]
}

export function ImageSlider({ slides }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 10000)

    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-[600px]">
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
          sizes="100vw"
          quality={80}
        />
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8 text-white" />
      </Button>
    </section>
  )
}
