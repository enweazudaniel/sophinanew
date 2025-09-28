"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Users, BookOpen, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function LinkClassesPage() {
  const [isLinking, setIsLinking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const linkClasses = async () => {
    setIsLinking(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/link-classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Refresh assignments after successful linking
        fetchAssignments()
      }
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to link classes",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLinking(false)
    }
  }

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db/link-classes")
      const data = await response.json()

      if (data.success) {
        setAssignments(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Link Students and Teachers to Classes</h1>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This will create the class system and link your existing students and teachers to classes. All existing login
          credentials will be preserved.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Class Linking System</CardTitle>
          <CardDescription>
            This will create:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Classes table with sample classes for different subjects</li>
              <li>Class-student relationships (many-to-many)</li>
              <li>Teacher-class assignments</li>
              <li>Helper functions for managing class assignments</li>
              <li>Views for easy data retrieval</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={linkClasses} disabled={isLinking} className="w-full">
            {isLinking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Linking Classes...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Link Students and Teachers to Classes
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-4">
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message || result.error}
                </AlertDescription>
              </Alert>

              {result.summary && (
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-green-600">
                    Success: {result.summary.successCount}
                  </Badge>
                  <Badge variant="outline" className="text-red-600">
                    Errors: {result.summary.errorCount}
                  </Badge>
                  <Badge variant="outline">Total: {result.summary.totalStatements}</Badge>
                </div>
              )}

              {result.verification && result.verification.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Verification Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.verification.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.query.replace("SELECT COUNT(*) as ", "").replace(" FROM ", " from ")}</span>
                          <Badge variant="secondary">
                            {typeof item.result === "object" ? Object.values(item.result)[0] : item.result}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>

              {showDetails && result.results && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Execution Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {result.results.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-xs ${
                            item.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <div className="font-mono">{item.statement}</div>
                          {item.error && <div className="text-red-600 mt-1">{item.error}</div>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
          <TabsTrigger value="students">Students by Class</TabsTrigger>
          <TabsTrigger value="teachers">Teachers by Class</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Student-Class Assignments</CardTitle>
              <CardDescription>Current student enrollments in classes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : assignments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Enrolled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.slice(0, 20).map((assignment: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{assignment.student_name}</TableCell>
                          <TableCell>{assignment.student_username}</TableCell>
                          <TableCell>{assignment.class_name}</TableCell>
                          <TableCell>{assignment.subject}</TableCell>
                          <TableCell>{assignment.teacher_name || "Not assigned"}</TableCell>
                          <TableCell>{new Date(assignment.enrolled_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No assignments found. Run the linking process first.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Students Overview</CardTitle>
              <CardDescription>Your existing students from the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">DEBORAH ONYINYE EZEBUIKE</h3>
                  <p className="text-sm text-muted-foreground">Username: 001</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">GOD'S SALVATION JUDE</h3>
                  <p className="text-sm text-muted-foreground">Username: 002</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">JASPER OBOITE</h3>
                  <p className="text-sm text-muted-foreground">Username: 003</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">ISREAL ABUCHI UBAH</h3>
                  <p className="text-sm text-muted-foreground">Username: 004</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">BENEDICT BIELONWU UCHE</h3>
                  <p className="text-sm text-muted-foreground">Username: 005</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">+ 8 more students</h3>
                  <p className="text-sm text-muted-foreground">Total: 13 students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Teachers Overview</CardTitle>
              <CardDescription>Your existing teachers from the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Mr. Daniel Enweazu</h3>
                  <p className="text-sm text-muted-foreground">Username: dan</p>
                  <p className="text-sm text-muted-foreground">Email: sarah.johnson@school.edu</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Miss. Gift</h3>
                  <p className="text-sm text-muted-foreground">Username: Gift</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Mrs. Emily Brown</h3>
                  <p className="text-sm text-muted-foreground">Username: teacher3</p>
                  <p className="text-sm text-muted-foreground">Email: emily.brown@school.edu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sample Class Structure</CardTitle>
          <CardDescription>Classes that will be created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Mathematics Class A (JSS 1)</span>
              <span>Teacher: Mr. Daniel Enweazu</span>
            </div>
            <div className="flex justify-between">
              <span>English Language Class (JSS 1)</span>
              <span>Teacher: Miss. Gift</span>
            </div>
            <div className="flex justify-between">
              <span>General Studies Class (JSS 1)</span>
              <span>Teacher: Mrs. Emily Brown</span>
            </div>
            <div className="flex justify-between">
              <span>Mathematics Class B (JSS 2)</span>
              <span>Teacher: Mr. Daniel Enweazu</span>
            </div>
            <div className="flex justify-between">
              <span>Science Class (JSS 1)</span>
              <span>Teacher: Miss. Gift</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
