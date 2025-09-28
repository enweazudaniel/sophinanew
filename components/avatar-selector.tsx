"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Users } from "lucide-react"

// Boy avatars for students
export const boyAvatars = [
  { id: "boy1", name: "Alex", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4" },
  { id: "boy2", name: "Ben", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ben&backgroundColor=c0aede" },
  {
    id: "boy3",
    name: "Charlie",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=d1d4f9",
  },
  { id: "boy4", name: "David", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffd93d" },
  { id: "boy5", name: "Ethan", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=ffb3ba" },
  { id: "boy6", name: "Felix", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=bae1ff" },
]

// Girl avatars for students
export const girlAvatars = [
  { id: "girl1", name: "Alice", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=ffb3d9" },
  { id: "girl2", name: "Bella", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&backgroundColor=c7ceea" },
  { id: "girl3", name: "Chloe", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=ffd1dc" },
  { id: "girl4", name: "Diana", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana&backgroundColor=e0bbe4" },
  { id: "girl5", name: "Emma", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=957dad" },
  { id: "girl6", name: "Fiona", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona&backgroundColor=fec89a" },
]

// Male teacher avatars
export const maleTeacherAvatars = [
  {
    id: "teacher_m1",
    name: "Mr. Anderson",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrAnderson&backgroundColor=4a90e2",
  },
  {
    id: "teacher_m2",
    name: "Mr. Brown",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrBrown&backgroundColor=7ed321",
  },
  {
    id: "teacher_m3",
    name: "Mr. Clark",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrClark&backgroundColor=f5a623",
  },
  {
    id: "teacher_m4",
    name: "Mr. Davis",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrDavis&backgroundColor=bd10e0",
  },
]

// Female teacher avatars
export const femaleTeacherAvatars = [
  {
    id: "teacher_f1",
    name: "Ms. Johnson",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MsJohnson&backgroundColor=e74c3c",
  },
  {
    id: "teacher_f2",
    name: "Ms. Smith",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MsSmith&backgroundColor=9b59b6",
  },
  {
    id: "teacher_f3",
    name: "Ms. Wilson",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MsWilson&backgroundColor=3498db",
  },
  {
    id: "teacher_f4",
    name: "Ms. Taylor",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MsTaylor&backgroundColor=1abc9c",
  },
]

interface AvatarDisplayProps {
  avatarId?: string
  isTeacher?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  fallback?: string
  alt?: string
}

export function AvatarDisplay({
  avatarId,
  isTeacher = false,
  size = "md",
  fallback = "U",
  alt = "Avatar",
}: AvatarDisplayProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  }

  // Find avatar from appropriate collection
  let avatar = null
  if (avatarId) {
    if (isTeacher) {
      avatar = [...maleTeacherAvatars, ...femaleTeacherAvatars].find((a) => a.id === avatarId)
    } else {
      avatar = [...boyAvatars, ...girlAvatars].find((a) => a.id === avatarId)
    }
  }

  if (avatar) {
    return (
      <img
        src={avatar.url || "/placeholder.svg"}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full border-2 border-border`}
      />
    )
  }

  // Fallback to initials
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center border-2 border-border`}
    >
      <span className="font-medium text-primary">{fallback}</span>
    </div>
  )
}

interface AvatarSelectorProps {
  currentAvatarId?: string
  isTeacher?: boolean
  onSelect: (avatarId: string) => void
}

export function AvatarSelector({ currentAvatarId, isTeacher = false, onSelect }: AvatarSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<"boys" | "girls" | "male_teachers" | "female_teachers">(
    isTeacher ? "male_teachers" : "boys",
  )

  const getAvatars = () => {
    switch (selectedCategory) {
      case "boys":
        return boyAvatars
      case "girls":
        return girlAvatars
      case "male_teachers":
        return maleTeacherAvatars
      case "female_teachers":
        return femaleTeacherAvatars
      default:
        return boyAvatars
    }
  }

  const categories = isTeacher
    ? [
        { id: "male_teachers" as const, label: "Male Teachers", icon: Users },
        { id: "female_teachers" as const, label: "Female Teachers", icon: Users },
      ]
    : [
        { id: "boys" as const, label: "Boys", icon: User },
        { id: "girls" as const, label: "Girls", icon: User },
      ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
          <AvatarDisplay avatarId={currentAvatarId} isTeacher={isTeacher} size="lg" />
          <span className="text-sm">Change Avatar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>Select an avatar that represents you best.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selection */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {getAvatars().map((avatar) => (
              <Card
                key={avatar.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  currentAvatarId === avatar.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelect(avatar.id)}
              >
                <CardContent className="p-3 flex flex-col items-center gap-2">
                  <img
                    src={avatar.url || "/placeholder.svg"}
                    alt={avatar.name}
                    className="h-12 w-12 rounded-full border-2 border-border"
                  />
                  <span className="text-xs font-medium text-center">{avatar.name}</span>
                  {currentAvatarId === avatar.id && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
