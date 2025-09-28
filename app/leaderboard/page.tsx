"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star, ArrowUp, ArrowDown, Minus } from "lucide-react"

// Mock data for leaderboard
const leaderboardData = {
  weekly: [
    { id: 1, name: "Emma Johnson", score: 1250, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 2, name: "James Smith", score: 1180, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 3, name: "Sophia Chen", score: 1120, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
    { id: 4, name: "Michael Brown", score: 980, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
    { id: 5, name: "Olivia Davis", score: 920, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 6, name: "William Wilson", score: 890, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
    { id: 7, name: "Ava Martinez", score: 850, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 8, name: "Ethan Taylor", score: 820, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
    { id: 9, name: "Isabella Thomas", score: 780, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
    { id: 10, name: "Alexander Lee", score: 750, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
  ],
  monthly: [
    { id: 1, name: "Sophia Chen", score: 5240, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 2, name: "Emma Johnson", score: 4980, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
    { id: 3, name: "James Smith", score: 4750, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 4, name: "Olivia Davis", score: 4320, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 5, name: "Michael Brown", score: 4150, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
    { id: 6, name: "Ava Martinez", score: 3980, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 7, name: "William Wilson", score: 3820, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
    { id: 8, name: "Alexander Lee", score: 3650, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    { id: 9, name: "Ethan Taylor", score: 3480, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
    { id: 10, name: "Isabella Thomas", score: 3320, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
  ],
  allTime: [
    {
      id: 1,
      name: "Emma Johnson",
      score: 24680,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["grammar-master", "vocabulary-champion"],
    },
    {
      id: 2,
      name: "Sophia Chen",
      score: 23450,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["reading-expert", "speaking-star"],
    },
    {
      id: 3,
      name: "James Smith",
      score: 21980,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["perfect-attendance", "fast-learner"],
    },
    {
      id: 4,
      name: "Michael Brown",
      score: 19750,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["writing-wizard"],
    },
    {
      id: 5,
      name: "Olivia Davis",
      score: 18640,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["listening-legend"],
    },
    { id: 6, name: "William Wilson", score: 17520, avatar: "/placeholder.svg?height=40&width=40", badges: [] },
    {
      id: 7,
      name: "Ava Martinez",
      score: 16890,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["grammar-master"],
    },
    { id: 8, name: "Ethan Taylor", score: 15740, avatar: "/placeholder.svg?height=40&width=40", badges: [] },
    {
      id: 9,
      name: "Isabella Thomas",
      score: 14980,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["vocabulary-champion"],
    },
    { id: 10, name: "Alexander Lee", score: 14320, avatar: "/placeholder.svg?height=40&width=40", badges: [] },
  ],
}

// Badge data
const badgeInfo = {
  "grammar-master": {
    label: "Grammar Master",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  "vocabulary-champion": {
    label: "Vocabulary Champion",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  "reading-expert": {
    label: "Reading Expert",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  "speaking-star": {
    label: "Speaking Star",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "writing-wizard": { label: "Writing Wizard", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  "listening-legend": {
    label: "Listening Legend",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  "perfect-attendance": {
    label: "Perfect Attendance",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  },
  "fast-learner": {
    label: "Fast Learner",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
}

// User's current rank
const currentUserRank = {
  weekly: 4, // Michael Brown
  monthly: 5, // Michael Brown
  allTime: 4, // Michael Brown
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "allTime">("weekly")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />
      default:
        return <span className="flex h-5 w-5 items-center justify-center font-medium">{rank}</span>
    }
  }

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">My Achievements</Button>
            <Button>My Progress</Button>
          </div>
        </div>

        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as "weekly" | "monthly" | "allTime")}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          {["weekly", "monthly", "allTime"].map((periodKey) => (
            <TabsContent key={periodKey} value={periodKey} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {periodKey === "weekly" ? "Weekly" : periodKey === "monthly" ? "Monthly" : "All-Time"} Top Students
                  </CardTitle>
                  <CardDescription>
                    Students with the highest scores{" "}
                    {periodKey === "weekly" ? "this week" : periodKey === "monthly" ? "this month" : "of all time"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Top 3 with special styling */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {leaderboardData[periodKey as keyof typeof leaderboardData].slice(0, 3).map((student, index) => (
                        <Card
                          key={student.id}
                          className={`overflow-hidden ${index === 0 ? "border-yellow-500 dark:border-yellow-500" : index === 1 ? "border-gray-400 dark:border-gray-400" : "border-amber-700 dark:border-amber-700"}`}
                        >
                          <div
                            className={`h-2 ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"}`}
                          ></div>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <div className="relative mb-2">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={student.avatar} alt={student.name} />
                                  <AvatarFallback>
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-2 -right-2 rounded-full p-1 ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"}`}
                                >
                                  {index === 0 ? (
                                    <Trophy className="h-5 w-5 text-white" />
                                  ) : index === 1 ? (
                                    <Medal className="h-5 w-5 text-white" />
                                  ) : (
                                    <Award className="h-5 w-5 text-white" />
                                  )}
                                </div>
                              </div>
                              <h3 className="mt-2 font-medium">{student.name}</h3>
                              <p className="text-2xl font-bold">{student.score.toLocaleString()}</p>
                              {periodKey !== "allTime" && (
                                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                  {getChangeIcon(student.change as string)}
                                  <span className="ml-1">
                                    {student.change === "up"
                                      ? "Improving"
                                      : student.change === "down"
                                        ? "Declining"
                                        : "Stable"}
                                  </span>
                                </div>
                              )}
                              {periodKey === "allTime" && student.badges && (
                                <div className="mt-2 flex flex-wrap justify-center gap-1">
                                  {(student.badges as string[]).slice(0, 2).map((badge) => (
                                    <Badge key={badge} className={badgeInfo[badge as keyof typeof badgeInfo].color}>
                                      {badgeInfo[badge as keyof typeof badgeInfo].label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Rest of the leaderboard */}
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5 md:col-span-6">Student</div>
                        <div className="col-span-4 md:col-span-3">Score</div>
                        <div className="col-span-2">Status</div>
                      </div>
                      <div className="divide-y">
                        {leaderboardData[periodKey as keyof typeof leaderboardData].slice(3).map((student, index) => (
                          <div
                            key={student.id}
                            className={`grid grid-cols-12 gap-4 p-4 items-center ${
                              currentUserRank[period as keyof typeof currentUserRank] === index + 4 ? "bg-muted/50" : ""
                            }`}
                          >
                            <div className="col-span-1 flex justify-center">{getRankIcon(index + 4)}</div>
                            <div className="col-span-5 md:col-span-6 flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student.name}</span>
                              {currentUserRank[period as keyof typeof currentUserRank] === index + 4 && (
                                <Badge variant="outline" className="ml-2">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="col-span-4 md:col-span-3 font-medium">{student.score.toLocaleString()}</div>
                            <div className="col-span-2 flex items-center">
                              {periodKey !== "allTime" ? (
                                <div className="flex items-center">{getChangeIcon(student.change as string)}</div>
                              ) : student.badges && (student.badges as string[]).length > 0 ? (
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="ml-1 text-xs">{(student.badges as string[]).length}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DashboardShell>
    </div>
  )
}
