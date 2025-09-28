import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // In a real application, you would check against an admin table in your database
    // For demo purposes, we'll use hardcoded admin credentials
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({
        user: {
          id: 1,
          username: "admin",
          fullName: "Administrator",
          role: "admin",
          email: "admin@sophina.edu",
        },
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
