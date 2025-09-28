import { NextResponse } from "next/server"
import { getStudentByUsername } from "@/lib/db-utils"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const username = url.searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const student = await getStudentByUsername(username)

    if (student) {
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = student
      return NextResponse.json({ user: userWithoutPassword })
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
