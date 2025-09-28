import { NextResponse } from "next/server"
import { addSRSItem } from "@/lib/srs-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, contentType, contentId, frontContent, backContent, example, imageUrl, audioUrl } = body

    if (!studentId || !contentType || !contentId || !frontContent || !backContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const itemId = await addSRSItem(
      Number.parseInt(studentId),
      contentType,
      Number.parseInt(contentId),
      frontContent,
      backContent,
      example,
      imageUrl,
      audioUrl,
    )

    if (itemId) {
      return NextResponse.json({ success: true, itemId })
    } else {
      return NextResponse.json({ error: "Failed to add SRS item" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding SRS item:", error)
    return NextResponse.json({ error: "Failed to add SRS item" }, { status: 500 })
  }
}
