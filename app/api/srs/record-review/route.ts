import { NextResponse } from "next/server"
import { recordReview, type ResponseQuality } from "@/lib/srs-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { itemId, studentId, responseQuality, timeTaken } = body

    if (!itemId || !studentId || responseQuality === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await recordReview(
      Number.parseInt(itemId),
      Number.parseInt(studentId),
      responseQuality as ResponseQuality,
      timeTaken || 0,
    )

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to record review" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error recording review:", error)
    return NextResponse.json({ error: "Failed to record review" }, { status: 500 })
  }
}
