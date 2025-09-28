"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import {
  AvatarDisplay,
  boyAvatars,
  girlAvatars,
  maleTeacherAvatars,
  femaleTeacherAvatars,
} from "@/components/avatar-selector"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    emailUpdates: false,
  })

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
      setSelectedAvatar(parsedUser.avatarId)

      // Load saved settings
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)

        // Apply theme from settings
        if (parsedSettings.theme) {
          setTheme(parsedSettings.theme)
        }
      } else {
        // Set theme based on current theme
        setSettings((prev) => ({
          ...prev,
          theme: theme || "light",
        }))
      }
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router, theme, setTheme])

  const handleSave = () => {
    setIsSaving(true)

    try {
      // Save settings to localStorage
      localStorage.setItem("userSettings", JSON.stringify(settings))

      // Update user avatar
      const updatedUser = { ...user, avatarId: selectedAvatar }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Apply theme
      setTheme(settings.theme)

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isTeacher = user?.role === "teacher" || user?.role === "admin"

  // Determine which avatar set to use
  const getAvatarOptions = () => {
    if (isTeacher) {
      return user?.gender === "female" ? femaleTeacherAvatars : maleTeacherAvatars
    } else {
      return user?.gender === "female" ? girlAvatars : boyAvatars
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how SophinaLearn looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>Choose your avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {getAvatarOptions().map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${
                      selectedAvatar === avatar.id ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <AvatarDisplay avatarId={avatar.id} isTeacher={isTeacher} size="lg" />
                    <span className="mt-2 text-xs text-center">{avatar.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about your progress</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your progress</p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </div>
  )
}
