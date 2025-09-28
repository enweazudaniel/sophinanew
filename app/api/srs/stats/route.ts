import { NextResponse } from "next/server"
import { getSRSStats } from "@/lib/srs-utils"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const studentId = url.searchParams.get("studentId")

  if (!studentId) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
  }

  try {
    const stats = await getSRSStats(Number.parseInt(studentId))

    if (stats) {
      return NextResponse.json({ stats })
    } else {
      return NextResponse.json({ error: "Failed to fetch SRS stats" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error fetching SRS stats:", error)
    return NextResponse.json({ error: "Failed to fetch SRS stats" }, { status: 500 })
  }
}
