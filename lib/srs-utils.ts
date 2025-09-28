import { supabase } from "./supabase"

// SM-2 algorithm parameters
const MIN_EASE_FACTOR = 1.3
const INITIAL_EASE_FACTOR = 2.5
const EASE_BONUS = 0.1
const EASE_PENALTY = 0.2

// Response quality ratings
export enum ResponseQuality {
  CompleteBlackout = 0, // Complete blackout, didn't remember at all
  IncorrectButRecognized = 1, // Incorrect response, but upon seeing the answer, it felt familiar
  IncorrectButEasyToRecall = 2, // Incorrect response, but the correct answer was easy to recall once shown
  CorrectWithDifficulty = 3, // Correct response, but required significant effort to recall
  CorrectWithHesitation = 4, // Correct response after some hesitation
  PerfectRecall = 5, // Perfect response with no hesitation
}

// Interface for SRS item
export interface SRSItem {
  id: number
  student_id: number
  content_type: "vocabulary" | "grammar"
  content_id: number
  front_content: string
  back_content: string
  example?: string
  image_url?: string
  audio_url?: string
  next_review_date?: string
  ease_factor?: number
  interval?: number
  repetition?: number
}

// Interface for review result
export interface ReviewResult {
  nextReviewDate: Date
  easeFactor: number
  interval: number
  repetition: number
}

/**
 * Calculate the next review date using the SM-2 algorithm
 */
export function calculateNextReview(
  responseQuality: ResponseQuality,
  currentEaseFactor: number = INITIAL_EASE_FACTOR,
  currentInterval = 0,
  currentRepetition = 0,
): ReviewResult {
  // Clone the parameters to avoid modifying the originals
  let easeFactor = currentEaseFactor
  let interval = currentInterval
  let repetition = currentRepetition

  // If the response was correct (3 or higher)
  if (responseQuality >= ResponseQuality.CorrectWithDifficulty) {
    // Calculate the next interval based on the repetition number
    if (repetition === 0) {
      interval = 1 // First successful review: 1 day
    } else if (repetition === 1) {
      interval = 6 // Second successful review: 6 days
    } else {
      interval = Math.round(interval * easeFactor) // Subsequent reviews: interval * easeFactor
    }
    repetition += 1
  } else {
    // If the response was incorrect, reset repetition and interval
    repetition = 0
    interval = 1
  }

  // Update the ease factor based on the response quality
  easeFactor += 0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.02)

  // Ensure ease factor doesn't go below minimum
  if (easeFactor < MIN_EASE_FACTOR) {
    easeFactor = MIN_EASE_FACTOR
  }

  // Calculate the next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    nextReviewDate,
    easeFactor,
    interval,
    repetition,
  }
}

/**
 * Get all due SRS items for a student
 */
export async function getDueItems(studentId: number, limit = 20): Promise<SRSItem[]> {
  try {
    const { data, error } = await supabase
      .from("srs_due_items")
      .select("*")
      .eq("student_id", studentId)
      .lte("next_review_date", new Date().toISOString())
      .order("next_review_date", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("Error fetching due SRS items:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getDueItems:", error)
    return []
  }
}

/**
 * Get the total number of due items for a student
 */
export async function getDueItemsCount(studentId: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("srs_due_items")
      .select("*", { count: "exact", head: true })
      .eq("student_id", studentId)
      .lte("next_review_date", new Date().toISOString())

    if (error) {
      console.error("Error counting due SRS items:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getDueItemsCount:", error)
    return 0
  }
}

/**
 * Record a review for an SRS item
 */
export async function recordReview(
  itemId: number,
  studentId: number,
  responseQuality: ResponseQuality,
  timeTaken: number,
): Promise<boolean> {
  try {
    // Get the current state of the item
    const { data: itemData, error: itemError } = await supabase
      .from("srs_review_history")
      .select("*")
      .eq("srs_item_id", itemId)
      .eq("student_id", studentId)
      .order("review_date", { ascending: false })
      .limit(1)

    if (itemError) {
      console.error("Error fetching SRS item history:", itemError)
      return false
    }

    // Get current parameters or use defaults
    const currentItem = itemData && itemData.length > 0 ? itemData[0] : null
    const currentEaseFactor = currentItem?.ease_factor || INITIAL_EASE_FACTOR
    const currentInterval = currentItem?.interval || 0
    const currentRepetition = currentItem?.repetition || 0

    // Calculate next review parameters
    const result = calculateNextReview(responseQuality, currentEaseFactor, currentInterval, currentRepetition)

    // Record the review
    const { error } = await supabase.from("srs_review_history").insert({
      srs_item_id: itemId,
      student_id: studentId,
      ease_factor: result.easeFactor,
      interval: result.interval,
      repetition: result.repetition,
      next_review_date: result.nextReviewDate.toISOString(),
      response_quality: responseQuality,
      time_taken: timeTaken,
    })

    if (error) {
      console.error("Error recording SRS review:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in recordReview:", error)
    return false
  }
}

/**
 * Add a new item to the SRS system
 */
export async function addSRSItem(
  studentId: number,
  contentType: "vocabulary" | "grammar",
  contentId: number,
  frontContent: string,
  backContent: string,
  example?: string,
  imageUrl?: string,
  audioUrl?: string,
): Promise<number | null> {
  try {
    // First, check if this item already exists for this student
    const { data: existingItems, error: checkError } = await supabase
      .from("srs_items")
      .select("id")
      .eq("student_id", studentId)
      .eq("content_type", contentType)
      .eq("content_id", contentId)

    if (checkError) {
      console.error("Error checking existing SRS item:", checkError)
      return null
    }

    // If item already exists, return its ID
    if (existingItems && existingItems.length > 0) {
      return existingItems[0].id
    }

    // Otherwise, insert a new item
    const { data, error } = await supabase
      .from("srs_items")
      .insert({
        student_id: studentId,
        content_type: contentType,
        content_id: contentId,
        front_content: frontContent,
        back_content: backContent,
        example,
        image_url: imageUrl,
        audio_url: audioUrl,
      })
      .select()

    if (error) {
      console.error("Error adding SRS item:", error)
      return null
    }

    const itemId = data?.[0]?.id

    if (!itemId) {
      console.error("Failed to get ID of inserted SRS item")
      return null
    }

    // Initialize the review history with default values
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { error: historyError } = await supabase.from("srs_review_history").insert({
      srs_item_id: itemId,
      student_id: studentId,
      ease_factor: INITIAL_EASE_FACTOR,
      interval: 0,
      repetition: 0,
      next_review_date: tomorrow.toISOString(),
      response_quality: ResponseQuality.PerfectRecall, // Initial "review" is perfect by definition
    })

    if (historyError) {
      console.error("Error initializing SRS review history:", historyError)
      return null
    }

    return itemId
  } catch (error) {
    console.error("Error in addSRSItem:", error)
    return null
  }
}

/**
 * Get SRS statistics for a student
 */
export async function getSRSStats(studentId: number) {
  try {
    // Get total items
    const { count: totalItems, error: countError } = await supabase
      .from("srs_items")
      .select("*", { count: "exact", head: true })
      .eq("student_id", studentId)

    if (countError) {
      console.error("Error counting SRS items:", countError)
      return null
    }

    // Get items by maturity level
    const { data: reviewData, error: reviewError } = await supabase
      .from("srs_review_history")
      .select("srs_item_id, repetition")
      .eq("student_id", studentId)
      .order("review_date", { ascending: false })

    if (reviewError) {
      console.error("Error fetching SRS review history:", reviewError)
      return null
    }

    // Count items by repetition level (maturity)
    const itemsByMaturity = new Map<number, number>()
    const processedItems = new Set<number>()

    reviewData?.forEach((review) => {
      if (!processedItems.has(review.srs_item_id)) {
        processedItems.add(review.srs_item_id)
        const maturity = review.repetition
        itemsByMaturity.set(maturity, (itemsByMaturity.get(maturity) || 0) + 1)
      }
    })

    // Get due items count
    const dueCount = await getDueItemsCount(studentId)

    return {
      totalItems: totalItems || 0,
      dueItems: dueCount,
      newItems: itemsByMaturity.get(0) || 0,
      learningItems: (itemsByMaturity.get(1) || 0) + (itemsByMaturity.get(2) || 0),
      matureItems:
        Array.from(itemsByMaturity.entries())
          .filter(([maturity]) => maturity >= 3)
          .reduce((sum, [_, count]) => sum + count, 0) || 0,
    }
  } catch (error) {
    console.error("Error in getSRSStats:", error)
    return null
  }
}

/**
 * Bulk add vocabulary items to SRS
 */
export async function bulkAddVocabularyToSRS(
  studentId: number,
  vocabularyItems: Array<{
    id: number
    word: string
    definition: string
    example?: string
    imageUrl?: string
    audioUrl?: string
  }>,
): Promise<boolean> {
  try {
    for (const item of vocabularyItems) {
      await addSRSItem(
        studentId,
        "vocabulary",
        item.id,
        item.word,
        item.definition,
        item.example,
        item.imageUrl,
        item.audioUrl,
      )
    }
    return true
  } catch (error) {
    console.error("Error in bulkAddVocabularyToSRS:", error)
    return false
  }
}

/**
 * Bulk add grammar items to SRS
 */
export async function bulkAddGrammarToSRS(
  studentId: number,
  grammarItems: Array<{
    id: number
    rule: string
    explanation: string
    example?: string
    imageUrl?: string
  }>,
): Promise<boolean> {
  try {
    for (const item of grammarItems) {
      await addSRSItem(studentId, "grammar", item.id, item.rule, item.explanation, item.example, item.imageUrl)
    }
    return true
  } catch (error) {
    console.error("Error in bulkAddGrammarToSRS:", error)
    return false
  }
}
