"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BookOpen, Users, FileText, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "lesson" | "student" | "assignment"
  url: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const searchResults: SearchResult[] = []

      // Search lessons
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, description, category")
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5)

      if (lessons) {
        lessons.forEach((lesson) => {
          searchResults.push({
            id: `lesson-${lesson.id}`,
            title: lesson.title,
            description: lesson.description,
            type: "lesson",
            url: `/exercises/${lesson.category}/${lesson.id}`,
          })
        })
      }

      // Search students (for teachers)
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.role === "teacher" || user.role === "admin") {
        const { data: students } = await supabase
          .from("students")
          .select("id, username, full_name")
          .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
          .limit(5)

        if (students) {
          students.forEach((student) => {
            searchResults.push({
              id: `student-${student.id}`,
              title: student.full_name || student.username,
              description: `Student: ${student.username}`,
              type: "student",
              url: `/teacher/students/${student.id}`,
            })
          })
        }

        // Search assignments
        const { data: assignments } = await supabase
          .from("assignments")
          .select("id, title, description")
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(5)

        if (assignments) {
          assignments.forEach((assignment) => {
            searchResults.push({
              id: `assignment-${assignment.id}`,
              title: assignment.title,
              description: assignment.description,
              type: "assignment",
              url: `/teacher/assignments/${assignment.id}`,
            })
          })
        }
      }

      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery("")
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="h-4 w-4" />
      case "student":
        return <Users className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lessons, students, assignments..."
          className="pl-8 w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
        />
        {isLoading && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {isOpen && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Button
                  key={result.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getResultIcon(result.type)}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
