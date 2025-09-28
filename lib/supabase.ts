import { createClient } from "@supabase/supabase-js"

// Make sure the URL has the correct format with https:// prefix
const supabaseUrl = "https://mqnpvczlwaicijsvbqfg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnB2Y3psd2FpY2lqc3ZicWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njk4ODQsImV4cCI6MjA1OTU0NTg4NH0.8ZX-LL3DYIzJfQrGdJsk3ko5wVXvqs0h4biZubENh54"

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Types for database tables
export type Student = {
  id: number
  username: string
  password?: string
  full_name: string
  created_at: string
  avatar_url?: string
  class_id?: string
}

export type Teacher = {
  id: number
  username: string
  password?: string
  full_name: string
  email: string
  created_at: string
  avatar_url?: string
}

export type Assignment = {
  id: number
  title: string
  description: string
  due_date?: string
  created_by: number
  created_at: string
  updated_at: string
  max_score: number
  subject: string
}

export type Exercise = {
  id: number
  title: string
  description: string
  subject: string
  difficulty: string
  questions: MCQQuestion[]
  created_by: number
  created_at: string
  is_available: boolean
}

export type MCQQuestion = {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export type Submission = {
  id: number
  assignment_id: number
  student_id: number
  content?: string
  answers?: { [key: number]: number }
  score?: number
  submitted_at: string
  status: "draft" | "submitted" | "graded"
}
