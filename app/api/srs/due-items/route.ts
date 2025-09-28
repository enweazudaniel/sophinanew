import { NextResponse } from "next/server"
import { getDueItems } from "@/lib/srs-utils"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const studentId = url.searchParams.get("studentId")
  const limit = url.searchParams.get("limit") || "20"

  if (!studentId) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
  }

  try {
    const items = await getDueItems(Number.parseInt(studentId), Number.parseInt(limit))
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching due items:", error)
    return NextResponse.json({ error: "Failed to fetch due items" }, { status: 500 })
  }
}
