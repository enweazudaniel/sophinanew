"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/diagnostics")
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      console.error("Failed to run diagnostics:", error)
    } finally {
      setLoading(false)
    }
  }

  const runSQLFix = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db/run-fix", { method: "POST" })
      const data = await response.json()
      alert(data.success ? "Database fixed successfully!" : `Error: ${data.error}`)
      runDiagnostics() // Refresh diagnostics
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  if (!diagnostics) {
    return <div className="p-8">Loading diagnostics...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Diagnostics</h1>
        <div className="space-x-2">
          <Button onClick={runDiagnostics} disabled={loading}>
            Refresh Diagnostics
          </Button>
          <Button onClick={runSQLFix} disabled={loading} variant="destructive">
            Run Database Fix
          </Button>
        </div>
      </div>

      {diagnostics.issues && diagnostics.issues.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnostics.issues.map((issue, index) => (
                <li key={index} className="text-red-600">
                  • {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(diagnostics.tables || {}).map(([table, info]) => (
                <div key={table} className="flex justify-between items-center">
                  <span>{table}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={info.exists ? "default" : "destructive"}>{info.exists ? "✓" : "✗"}</Badge>
                    <span className="text-sm text-gray-500">({info.count} rows)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Functions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(diagnostics.functions || {}).map(([func, info]) => (
                <div key={func} className="flex justify-between items-center">
                  <span>{func}</span>
                  <Badge variant={info.exists ? "default" : "destructive"}>{info.exists ? "✓" : "✗"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Has Students:</span>
                <Badge variant={diagnostics.data?.hasStudents ? "default" : "destructive"}>
                  {diagnostics.data?.hasStudents ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Has Teachers:</span>
                <Badge variant={diagnostics.data?.hasTeachers ? "default" : "destructive"}>
                  {diagnostics.data?.hasTeachers ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Lessons Count:</span>
                <span>{diagnostics.data?.lessonsCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">Running diagnostics...</div>
        </div>
      )}
    </div>
  )
}
