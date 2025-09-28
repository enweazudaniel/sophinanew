"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, Search, ChevronDown, ChevronUp, MoreHorizontal, Eye, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Student = {
  id: number
  username: string
  full_name: string
  avatar_url?: string
  created_at: string
  average_score?: number
  completed_exercises?: number
}

export default function StudentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Student>("full_name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    // Check if user is logged in and is a teacher
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.role !== "teacher") {
        router.push("/login")
        return
      }
      setUser(parsedUser)

      // Fetch students
      fetchStudents()
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      // Get students
      const { data: studentsData, error } = await supabase
        .from("students")
        .select("*")
        .order("full_name", { ascending: true })

      if (error) throw error

      // Get exercise scores for each student
      const studentsWithScores = await Promise.all(
        (studentsData || []).map(async (student) => {
          // Get scores
          const { data: scores } = await supabase
            .from("exercise_scores")
            .select("score, max_score")
            .eq("student_id", student.id)

          // Calculate average score
          let averageScore = 0
          if (scores && scores.length > 0) {
            const totalPercentage = scores.reduce((sum, item) => {
              return sum + (item.score / item.max_score) * 100
            }, 0)
            averageScore = Math.round(totalPercentage / scores.length)
          }

          return {
            ...student,
            average_score: averageScore,
            completed_exercises: scores?.length || 0,
          }
        }),
      )

      setStudents(studentsWithScores)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === undefined || bValue === undefined) return 0

    const comparison =
      typeof aValue === "string" && typeof bValue === "string"
        ? aValue.localeCompare(bValue)
        : Number(aValue) - Number(bValue)

    return sortDirection === "asc" ? comparison : -comparison
  })

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>View and manage all students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading students...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">
                        <button className="flex items-center gap-1" onClick={() => handleSort("full_name")}>
                          Student Name
                          {sortField === "full_name" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center gap-1" onClick={() => handleSort("username")}>
                          Student ID
                          {sortField === "username" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">
                        <button className="flex items-center gap-1 ml-auto" onClick={() => handleSort("average_score")}>
                          Average Score
                          {sortField === "average_score" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">
                        <button
                          className="flex items-center gap-1 ml-auto"
                          onClick={() => handleSort("completed_exercises")}
                        >
                          Exercises
                          {sortField === "completed_exercises" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            <span>{student.full_name}</span>
                          </TableCell>
                          <TableCell>{student.username}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <BarChart className="h-4 w-4 text-muted-foreground" />
                              <span>{student.average_score || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{student.completed_exercises || 0}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/teacher/students/${student.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/teacher/students/${student.id}/assignments`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Assignments
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    </div>
  )
}
