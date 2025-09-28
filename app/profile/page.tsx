"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { AvatarDisplay } from "@/components/avatar-selector"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setFullName(parsedUser.fullName || parsedUser.full_name || "")
      setEmail(parsedUser.email || "")

      // Set created_at date
      if (parsedUser.created_at) {
        setCreatedAt(parsedUser.created_at)
      } else {
        // Fetch user data to get created_at if not in localStorage
        fetchUserData(parsedUser.id, parsedUser.role)
      }
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchUserData = async (userId: number, role: string) => {
    try {
      const tableName = role === "teacher" ? "teachers" : "students"

      const { data, error } = await supabase.from(tableName).select("created_at").eq("id", userId).single()

      if (error) throw error

      if (data && data.created_at) {
        setCreatedAt(data.created_at)

        // Update localStorage with created_at
        const updatedUser = { ...user, created_at: data.created_at }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const tableName = user.role === "teacher" ? "teachers" : "students"

      const { error } = await supabase
        .from(tableName)
        .update({
          full_name: fullName,
          email: email || null,
        })
        .eq("id", user.id)

      if (error) throw error

      // Update localStorage
      const updatedUser = { ...user, fullName, full_name: fullName, email }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccess("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <DashboardShell>
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>You need to be logged in to view your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/login")}>Log In</Button>
            </CardContent>
          </Card>
        </DashboardShell>
      </div>
    )
  }

  const isTeacher = user.role === "teacher" || user.role === "admin"

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <Button onClick={() => router.push("/settings")}>Settings</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Your current avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <AvatarDisplay
                  avatarId={user.avatarId}
                  isTeacher={isTeacher}
                  size="lg"
                  fallback={(user.fullName || user.full_name || user.username)?.charAt(0) || "U"}
                />
                <Button variant="outline" onClick={() => router.push("/settings")}>
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={user.username} disabled className="bg-muted" />
                  <p className="text-sm text-muted-foreground">Username cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input
                    value={createdAt ? format(new Date(createdAt), "PPP") : "Loading..."}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
