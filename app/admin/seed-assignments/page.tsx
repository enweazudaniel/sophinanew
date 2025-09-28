"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Database } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SeedAssignmentsPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isSimpleSeeding, setIsSimpleSeeding] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSeedAssignments = async (simple = false) => {
    const setLoading = simple ? setIsSimpleSeeding : setIsSeeding
    setLoading(true)
    setResult(null)

    try {
      const endpoint = simple ? "/api/simple-seed" : "/api/seed-assignments"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast({
          title: "Success!",
          description: simple ? "Simple seed completed" : "Full seed completed",
        })
      } else {
        throw new Error(data.error || "Failed to create assignments")
      }
    } catch (error) {
      console.error("Error seeding:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create assignments",
        variant: "destructive",
      })
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Seed Sample Assignments</h1>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Simple Seed (Recommended)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Creates basic sample data with minimal database operations.</p>

              <div className="space-y-2">
                <h3 className="font-semibold">What will be created:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>1 Teacher: teacher1 / password123</li>
                  <li>3 Students: student1-student3 / password123</li>
                  <li>2 Basic assignments</li>
                </ul>
              </div>

              <Button
                onClick={() => handleSeedAssignments(true)}
                disabled={isSimpleSeeding}
                className="w-full"
                variant="default"
              >
                {isSimpleSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Simple Data...
                  </>
                ) : (
                  "Create Simple Sample Data"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Full Seed (Advanced)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Creates comprehensive sample data with all features.</p>

              <Button
                onClick={() => handleSeedAssignments(false)}
                disabled={isSeeding}
                className="w-full"
                variant="outline"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Full Data...
                  </>
                ) : (
                  "Create Full Sample Data"
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardContent className="pt-6">
                {result.error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-semibold text-red-800">Error</h3>
                    </div>
                    <p className="text-sm text-red-700">{result.error}</p>
                    {result.details && <p className="text-xs text-red-600 mt-1">{result.details}</p>}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-800">Success!</h3>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>✅ {result.message}</p>
                      {result.data && (
                        <>
                          <p>✅ Teacher: {result.data.teacher || result.data.teacherInfo?.username}</p>
                          <p>✅ Students: {result.data.students}</p>
                          <p>✅ Assignments: {result.data.assignments}</p>
                        </>
                      )}
                      <p className="mt-2 font-medium">Login as teacher1 / password123 to test!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
