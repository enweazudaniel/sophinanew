"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, VolumeIcon as VolumeUp } from "lucide-react"
import Image from "next/image"
import { ResponseQuality } from "@/lib/srs-utils"

interface FlashcardProps {
  front: string
  back: string
  example?: string
  imageUrl?: string
  audioUrl?: string
  onResponse: (quality: ResponseQuality) => void
  isLoading?: boolean
}

export function Flashcard({ front, back, example, imageUrl, audioUrl, onResponse, isLoading = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    // Reset state when card changes
    setIsFlipped(false)
    setStartTime(Date.now())

    // Initialize audio if URL is provided
    if (audioUrl && typeof window !== "undefined") {
      const newAudio = new Audio(audioUrl)
      setAudio(newAudio)
      return () => {
        newAudio.pause()
        newAudio.src = ""
      }
    }
  }, [front, back, audioUrl])

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true)
    }
  }

  const handlePlayAudio = () => {
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((err) => console.error("Error playing audio:", err))
    }
  }

  const handleResponse = (quality: ResponseQuality) => {
    onResponse(quality)
  }

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div
        className={`relative w-full transition-transform duration-500 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
        style={{ minHeight: "300px" }}
      >
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full backface-hidden ${isFlipped ? "invisible" : "visible"} cursor-pointer`}
          onClick={handleFlip}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 h-full">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold mb-4">{front}</div>
                {imageUrl && (
                  <div className="relative w-full h-40 mb-4">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={front}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                )}
                {audioUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayAudio()
                    }}
                  >
                    <VolumeUp className="h-4 w-4" />
                  </Button>
                )}
                <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? "visible" : "invisible"}`}>
          <CardContent className="flex flex-col p-6 h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-muted-foreground">Answer:</h3>
              <p className="text-xl font-bold">{back}</p>
            </div>

            {example && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Example:</h3>
                <p className="italic">{example}</p>
              </div>
            )}

            <div className="mt-auto">
              <h3 className="text-sm font-semibold mb-2">How well did you remember?</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleResponse(ResponseQuality.CompleteBlackout)}
                >
                  Forgot
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(ResponseQuality.CorrectWithDifficulty)}
                >
                  Hard
                </Button>
                <Button variant="default" size="sm" onClick={() => handleResponse(ResponseQuality.PerfectRecall)}>
                  Easy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
