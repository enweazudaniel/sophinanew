"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, Users, BookOpen, FileText, Award } from "lucide-react"

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const seedData = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/seed-data", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Failed to seed data")
      }
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Seed Sample Data</h1>
        <p className="text-lg text-muted-foreground">
          This will create comprehensive sample data for all features in the educational platform
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sample Data Creation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>3 Teachers</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>7 Students (Basic 7A class)</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>3 Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>10 Lessons</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>4 Assignments</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Sample Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Student Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Achievements & Notifications</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                <div className="font-semibold mb-2">✅ Sample data created successfully!</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Teachers: {result.data.teachers}</div>
                  <div>Students: {result.data.students}</div>
                  <div>Classes: {result.data.classes}</div>
                  <div>Lessons: {result.data.lessons}</div>
                  <div>Assignments: {result.data.assignments}</div>
                  <div>Submissions: {result.data.submissions}</div>
                  <div>Completions: {result.data.completions}</div>
                  <div>Achievements: {result.data.achievements}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={seedData} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Sample Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Create Sample Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test the Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" asChild>
                <a href="/login" target="_blank" rel="noreferrer">
                  Login as Student (student1 / password123)
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/login/admin" target="_blank" rel="noreferrer">
                  Login as Teacher (teacher1 / password123)
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard" target="_blank" rel="noreferrer">
                  View Student Dashboard
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/teacher/dashboard" target="_blank" rel="noreferrer">
                  View Teacher Dashboard
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/assignments" target="_blank" rel="noreferrer">
                  View Assignments
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
