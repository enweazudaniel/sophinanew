"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap } from "lucide-react"

export default function QuickLoginPage() {
  const loginAsStudent = (studentId: number, username: string, fullName: string) => {
    const userData = {
      id: studentId,
      username: username,
      fullName: fullName,
      role: "student",
    }
    localStorage.setItem("user", JSON.stringify(userData))
    window.location.href = "/dashboard"
  }

  const loginAsTeacher = (teacherId: number, username: string, fullName: string) => {
    const userData = {
      id: teacherId,
      username: username,
      fullName: fullName,
      role: "teacher",
    }
    localStorage.setItem("user", JSON.stringify(userData))
    window.location.href = "/teacher/dashboard"
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center">Quick Login for Testing</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Login as Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => loginAsStudent(1, "student1", "Alex Thompson")}
              className="w-full justify-start"
              variant="outline"
            >
              Alex Thompson (Basic 7A) - Has completed lessons
            </Button>
            <Button
              onClick={() => loginAsStudent(2, "student2", "Emma Wilson")}
              className="w-full justify-start"
              variant="outline"
            >
              Emma Wilson (Basic 7A) - Top performer
            </Button>
            <Button
              onClick={() => loginAsStudent(3, "student3", "Michael Davis")}
              className="w-full justify-start"
              variant="outline"
            >
              Michael Davis (Basic 7A) - New student
            </Button>
            <Button
              onClick={() => loginAsStudent(4, "student4", "Sophia Garcia")}
              className="w-full justify-start"
              variant="outline"
            >
              Sophia Garcia (Basic 7A) - Active learner
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Login as Teacher
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => loginAsTeacher(1, "teacher1", "Ms. Sarah Johnson")}
              className="w-full justify-start"
              variant="outline"
            >
              Ms. Sarah Johnson - Basic 7A & 8B Teacher
            </Button>
            <Button
              onClick={() => loginAsTeacher(2, "teacher2", "Mr. David Smith")}
              className="w-full justify-start"
              variant="outline"
            >
              Mr. David Smith - Advanced 9C Teacher
            </Button>
            <Button
              onClick={() => loginAsTeacher(3, "teacher3", "Mrs. Emily Brown")}
              className="w-full justify-start"
              variant="outline"
            >
              Mrs. Emily Brown - General Teacher
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>What You Can Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">As a Student:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• View dashboard with progress</li>
                <li>• Complete lesson exercises</li>
                <li>• Submit assignments</li>
                <li>• View grades and feedback</li>
                <li>• Check notifications</li>
                <li>• See achievements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">As a Teacher:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• View teacher dashboard</li>
                <li>• Manage classes and students</li>
                <li>• Create assignments</li>
                <li>• Grade submissions</li>
                <li>• View student progress</li>
                <li>• Manage content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
