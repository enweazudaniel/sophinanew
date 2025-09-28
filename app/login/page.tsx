"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student")

  async function handleStudentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      // Query the students table directly
      const { data, error: dbError } = await supabase
        .from("students")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single()

      if (dbError) {
        console.error("Login error:", dbError)
        setError("Invalid username or password")
        return
      }

      if (data) {
        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username,
            fullName: data.full_name,
            role: "student",
            id: data.id,
            avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
          }),
        )

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleTeacherSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      // Query the teachers table
      const { data, error: dbError } = await supabase
        .from("teachers")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single()

      if (dbError) {
        console.error("Teacher login error:", dbError)
        setError("Invalid username or password")
        return
      }

      if (data) {
        // Store teacher info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username,
            fullName: data.full_name,
            role: "teacher",
            id: data.id,
            email: data.email,
            avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
          }),
        )

        // Redirect to teacher dashboard
        router.push("/teacher/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login to SophinaLearn</CardTitle>
          <CardDescription className="text-center">Access your learning dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "student" | "teacher")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentSubmit} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="student-username">Student ID</Label>
                  <Input id="student-username" name="username" placeholder="Enter your student ID" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="student-password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Student"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form onSubmit={handleTeacherSubmit} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="teacher-username">Username</Label>
                  <Input id="teacher-username" name="username" placeholder="Enter your username" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="teacher-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Teacher"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <span>Don&apos;t have an account? Contact your administrator for access.</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
