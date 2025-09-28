"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, CheckCircle, Loader2 } from "lucide-react"

interface AddToSRSProps {
  studentId: number
  contentType: "vocabulary" | "grammar"
  contentId: number
  frontContent: string
  backContent: string
  example?: string
  imageUrl?: string
  audioUrl?: string
  onSuccess?: () => void
}

export function AddToSRS({
  studentId,
  contentType,
  contentId,
  frontContent,
  backContent,
  example,
  imageUrl,
  audioUrl,
  onSuccess,
}: AddToSRSProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const handleAddToSRS = async () => {
    if (isAdding || isAdded) return

    setIsAdding(true)

    try {
      const response = await fetch("/api/srs/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          contentType,
          contentId,
          frontContent,
          backContent,
          example,
          imageUrl,
          audioUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to SRS")
      }

      setIsAdded(true)
      toast({
        title: "Added to flashcards",
        description: "This item has been added to your spaced repetition system.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error adding item to SRS:", error)
      toast({
        title: "Error",
        description: "Failed to add item to flashcards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      variant={isAdded ? "outline" : "secondary"}
      size="sm"
      onClick={handleAddToSRS}
      disabled={isAdding || isAdded}
      className={isAdded ? "text-green-600 border-green-600" : ""}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Added to Flashcards
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Flashcards
        </>
      )}
    </Button>
  )
}
