"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DatabaseSchemaPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Redirect if not admin
        if (parsedUser.role !== "admin") {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Database Schema</h1>
        </div>

        <Tabs defaultValue="core" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="core">Core Tables</TabsTrigger>
            <TabsTrigger value="tracking">Tracking Tables</TabsTrigger>
            <TabsTrigger value="srs">SRS Tables</TabsTrigger>
            <TabsTrigger value="new">New Components</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="space-y-4">
            <SchemaSection
              title="Users & Authentication"
              description="Tables related to user accounts and authentication"
              tables={[
                {
                  name: "users",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "username", type: "varchar(255)", constraints: "NOT NULL UNIQUE" },
                    { name: "email", type: "varchar(255)", constraints: "NOT NULL UNIQUE" },
                    { name: "password_hash", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "full_name", type: "varchar(255)" },
                    { name: "role", type: "varchar(20)", constraints: "NOT NULL" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "last_login", type: "timestamp" },
                  ],
                },
              ]}
            />

            <SchemaSection
              title="Lessons & Exercises"
              description="Core learning content structure"
              tables={[
                {
                  name: "lessons",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "title", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "description", type: "text" },
                    { name: "category", type: "varchar(50)", constraints: "NOT NULL" },
                    { name: "difficulty", type: "varchar(20)" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "updated_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
                {
                  name: "exercises",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "lesson_id", type: "integer", constraints: "REFERENCES lessons(id)" },
                    { name: "title", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "description", type: "text" },
                    { name: "type", type: "varchar(50)", constraints: "NOT NULL" },
                    { name: "content", type: "jsonb", constraints: "NOT NULL" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "updated_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
              ]}
            />

            <SchemaSection
              title="Assignments & Submissions"
              description="Assignment management and student submissions"
              tables={[
                {
                  name: "assignments",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "title", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "description", type: "text" },
                    { name: "teacher_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "due_date", type: "timestamp" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "updated_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
                {
                  name: "submissions",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "assignment_id", type: "integer", constraints: "REFERENCES assignments(id)" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "content", type: "text", constraints: "NOT NULL" },
                    { name: "score", type: "integer" },
                    { name: "feedback", type: "text" },
                    { name: "submitted_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "graded_at", type: "timestamp" },
                  ],
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <SchemaSection
              title="Progress Tracking"
              description="Tables for tracking student progress"
              tables={[
                {
                  name: "lesson_completions",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "lesson_id", type: "integer", constraints: "REFERENCES lessons(id)" },
                    { name: "score", type: "integer", constraints: "NOT NULL" },
                    { name: "completed_at", type: "timestamp", constraints: "NOT NULL" },
                    { name: "attempts", type: "integer", constraints: "DEFAULT 1" },
                    { name: "last_attempt_at", type: "timestamp" },
                  ],
                },
                {
                  name: "exercise_scores",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "exercise_id", type: "integer", constraints: "REFERENCES exercises(id)" },
                    { name: "score", type: "integer", constraints: "NOT NULL" },
                    { name: "completed_at", type: "timestamp", constraints: "NOT NULL" },
                    { name: "attempts", type: "integer", constraints: "DEFAULT 1" },
                  ],
                },
                {
                  name: "student_metrics",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id) UNIQUE" },
                    { name: "overall_progress", type: "float", constraints: "DEFAULT 0" },
                    { name: "lessons_completed", type: "integer", constraints: "DEFAULT 0" },
                    { name: "total_lessons", type: "integer", constraints: "DEFAULT 0" },
                    { name: "time_spent", type: "integer", constraints: "DEFAULT 0" },
                    { name: "last_active", type: "timestamp" },
                  ],
                },
              ]}
            />

            <SchemaSection
              title="Achievements"
              description="Student achievements and badges"
              tables={[
                {
                  name: "achievements",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "name", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "description", type: "text" },
                    { name: "icon", type: "varchar(255)" },
                    { name: "points", type: "integer", constraints: "DEFAULT 0" },
                  ],
                },
                {
                  name: "student_achievements",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "achievement_id", type: "integer", constraints: "REFERENCES achievements(id)" },
                    { name: "earned_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="srs" className="space-y-4">
            <SchemaSection
              title="Spaced Repetition System"
              description="Tables for vocabulary and grammar flashcards"
              tables={[
                {
                  name: "srs_items",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "front", type: "text", constraints: "NOT NULL" },
                    { name: "back", type: "text", constraints: "NOT NULL" },
                    { name: "item_type", type: "varchar(50)", constraints: "NOT NULL" },
                    { name: "level", type: "integer", constraints: "DEFAULT 0" },
                    { name: "next_review", type: "timestamp" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
                {
                  name: "srs_review_history",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "item_id", type: "integer", constraints: "REFERENCES srs_items(id)" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "quality", type: "integer", constraints: "NOT NULL" },
                    { name: "reviewed_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "previous_level", type: "integer", constraints: "NOT NULL" },
                    { name: "new_level", type: "integer", constraints: "NOT NULL" },
                  ],
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <SchemaSection
              title="New Components"
              description="Recently added database components"
              tables={[
                {
                  name: "classes",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "name", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "teacher_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "description", type: "text" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
                {
                  name: "class_students",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "class_id", type: "integer", constraints: "REFERENCES classes(id)" },
                    { name: "student_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "joined_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                  ],
                },
                {
                  name: "notifications",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "user_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "title", type: "varchar(255)", constraints: "NOT NULL" },
                    { name: "message", type: "text", constraints: "NOT NULL" },
                    { name: "type", type: "varchar(50)", constraints: "NOT NULL" },
                    { name: "read", type: "boolean", constraints: "DEFAULT FALSE" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "related_id", type: "integer" },
                    { name: "related_type", type: "varchar(50)" },
                  ],
                },
                {
                  name: "user_activity_log",
                  columns: [
                    { name: "id", type: "serial", constraints: "PRIMARY KEY" },
                    { name: "user_id", type: "integer", constraints: "REFERENCES users(id)" },
                    { name: "activity_type", type: "varchar(50)", constraints: "NOT NULL" },
                    { name: "description", type: "text" },
                    { name: "created_at", type: "timestamp", constraints: "DEFAULT NOW()" },
                    { name: "related_id", type: "integer" },
                    { name: "related_type", type: "varchar(50)" },
                    { name: "metadata", type: "jsonb" },
                  ],
                },
              ]}
            />

            <Card>
              <CardHeader>
                <CardTitle>Database Triggers</CardTitle>
                <CardDescription>Automatic database operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">update_student_metrics</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Updates student metrics when lesson completions change
                  </p>
                  <div className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                    <pre>{`CREATE OR REPLACE FUNCTION update_student_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Count unique completed lessons for this student
  WITH unique_lessons AS (
    SELECT DISTINCT lesson_id
    FROM lesson_completions
    WHERE student_id = NEW.student_id
  )
  UPDATE student_metrics
  SET 
    lessons_completed = (SELECT COUNT(*) FROM unique_lessons),
    last_active = NOW()
  WHERE student_id = NEW.student_id;
  
  -- If no metrics record exists, create one
  IF NOT FOUND THEN
    INSERT INTO student_metrics (
      student_id, 
      lessons_completed, 
      total_lessons,
      overall_progress,
      time_spent,
      last_active
    )
    VALUES (
      NEW.student_id,
      1,
      (SELECT COUNT(*) FROM lessons),
      (1.0 / (SELECT COUNT(*) FROM lessons)) * 100,
      0,
      NOW()
    );
  ELSE
    -- Update overall progress
    UPDATE student_metrics
    SET overall_progress = (
      CASE 
        WHEN total_lessons > 0 THEN 
          (lessons_completed::float / total_lessons) * 100
        ELSE 0
      END
    )
    WHERE student_id = NEW.student_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}</pre>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">create_assignment_notification</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Creates notifications when new assignments are created
                  </p>
                  <div className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                    <pre>{`CREATE OR REPLACE FUNCTION create_assignment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Get students in classes taught by this teacher
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_id,
    related_type
  )
  SELECT 
    cs.student_id,
    'New Assignment',
    'You have a new assignment: ' || NEW.title,
    'assignment',
    NEW.id,
    'assignments'
  FROM class_students cs
  JOIN classes c ON cs.class_id = c.id
  WHERE c.teacher_id = NEW.teacher_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Views</CardTitle>
                <CardDescription>SQL views for reporting and analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">student_progress_summary</h3>
                  <p className="text-sm text-muted-foreground mb-2">Comprehensive view of each student's progress</p>
                  <div className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                    <pre>{`CREATE OR REPLACE VIEW student_progress_summary AS
SELECT 
  u.id AS student_id,
  u.username,
  u.full_name,
  sm.overall_progress,
  sm.lessons_completed,
  sm.total_lessons,
  sm.time_spent,
  sm.last_active,
  COUNT(DISTINCT sa.achievement_id) AS achievements_earned,
  COUNT(DISTINCT s.id) AS assignments_submitted,
  AVG(s.score) AS average_assignment_score
FROM 
  users u
LEFT JOIN 
  student_metrics sm ON u.id = sm.student_id
LEFT JOIN 
  student_achievements sa ON u.id = sa.student_id
LEFT JOIN 
  submissions s ON u.id = s.student_id
WHERE 
  u.role = 'student'
GROUP BY 
  u.id, u.username, u.full_name, sm.overall_progress, 
  sm.lessons_completed, sm.total_lessons, sm.time_spent, sm.last_active;`}</pre>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">lesson_popularity</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Shows which lessons are most completed and their average scores
                  </p>
                  <div className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                    <pre>{`CREATE OR REPLACE VIEW lesson_popularity AS
SELECT 
  l.id AS lesson_id,
  l.title,
  l.category,
  l.difficulty,
  COUNT(lc.id) AS completion_count,
  AVG(lc.score) AS average_score,
  COUNT(DISTINCT lc.student_id) AS unique_students
FROM 
  lessons l
LEFT JOIN 
  lesson_completions lc ON l.id = lc.lesson_id
GROUP BY 
  l.id, l.title, l.category, l.difficulty
ORDER BY 
  completion_count DESC;`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  )
}

interface SchemaColumnProps {
  name: string
  type: string
  constraints?: string
}

interface SchemaTableProps {
  name: string
  columns: SchemaColumnProps[]
}

interface SchemaSectionProps {
  title: string
  description: string
  tables: SchemaTableProps[]
}

function SchemaSection({ title, description, tables }: SchemaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tables.map((table) => (
          <div key={table.name} className="space-y-2">
            <h3 className="font-medium text-lg">{table.name}</h3>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b">
                    <th className="text-left p-2 font-medium">Column</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-left p-2 font-medium">Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {table.columns.map((column) => (
                    <tr key={column.name} className="hover:bg-muted/50">
                      <td className="p-2 font-mono text-xs">{column.name}</td>
                      <td className="p-2 text-xs text-muted-foreground">{column.type}</td>
                      <td className="p-2 text-xs text-muted-foreground">{column.constraints || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
