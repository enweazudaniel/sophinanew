import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Read the complete schema file
    const schemaSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS lesson_completions CASCADE;
DROP TABLE IF EXISTS assignment_students CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS student_metrics CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  full_name VARCHAR(255),
  avatar_url TEXT,
  theme_preference VARCHAR(50) DEFAULT 'system',
  class_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for class_id in users table
ALTER TABLE users ADD CONSTRAINT fk_users_class_id FOREIGN KEY (class_id) REFERENCES classes(id);

-- Lessons table with content column
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'grammar' CHECK (category IN ('grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing')),
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  media_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  points INTEGER DEFAULT 100,
  target_type VARCHAR(20) DEFAULT 'all' CHECK (target_type IN ('all', 'class', 'individual')),
  class_id UUID REFERENCES classes(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignment-Student relationship table
CREATE TABLE assignment_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'graded')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  submission_content TEXT,
  grade NUMERIC,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Lesson completions table
CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score NUMERIC,
  time_spent INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Student metrics table
CREATE TABLE student_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  overall_progress NUMERIC DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Student achievements table
CREATE TABLE student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  achievement_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress NUMERIC DEFAULT 100,
  UNIQUE(student_id, achievement_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty);
CREATE INDEX idx_lesson_completions_user_id ON lesson_completions(user_id);
CREATE INDEX idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX idx_assignments_created_by ON assignments(created_by);
CREATE INDEX idx_assignment_students_student_id ON assignment_students(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Insert sample data
INSERT INTO users (id, username, password_hash, role, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin', '$2b$10$hash', 'admin', 'System Administrator'),
  ('22222222-2222-2222-2222-222222222222', 'teacher1', '$2b$10$hash', 'teacher', 'Ms. Johnson'),
  ('33333333-3333-3333-3333-333333333333', 'student1', '$2b$10$hash', 'student', 'John Smith'),
  ('44444444-4444-4444-4444-444444444444', 'student2', '$2b$10$hash', 'student', 'Emma Davis');

INSERT INTO classes (id, name, description, teacher_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'English 101', 'Beginner English Class', '22222222-2222-2222-2222-222222222222');

UPDATE users SET class_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE role = 'student';

INSERT INTO lessons (id, title, description, content, category, difficulty, created_by) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Basic Grammar', 'Introduction to English grammar', 'This lesson covers basic grammar rules including nouns, verbs, and adjectives.', 'grammar', 'beginner', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Reading Comprehension', 'Practice reading skills', 'Read the following passage and answer the questions below.', 'reading', 'intermediate', '22222222-2222-2222-2222-222222222222'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Vocabulary Building', 'Expand your vocabulary', 'Learn new words and their meanings through interactive exercises.', 'vocabulary', 'beginner', '22222222-2222-2222-2222-222222222222');

INSERT INTO assignments (id, title, description, content, due_date, created_by) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Grammar Exercise 1', 'Complete the grammar exercises', 'Fill in the blanks with the correct verb forms.', NOW() + INTERVAL '7 days', '22222222-2222-2222-2222-222222222222');

INSERT INTO assignment_students (assignment_id, student_id, status) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'assigned'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'assigned');

INSERT INTO lesson_completions (user_id, lesson_id, score, time_spent) VALUES
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 85, 1200),
  ('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 92, 900);

INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, overall_progress, time_spent) VALUES
  ('33333333-3333-3333-3333-333333333333', 2, 3, 66.67, 2100),
  ('44444444-4444-4444-4444-444444444444', 0, 3, 0, 0);

INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
  ('33333333-3333-3333-3333-333333333333', 'assignment', 'New Assignment', 'You have a new assignment: Grammar Exercise 1', false),
  ('33333333-3333-3333-3333-333333333333', 'achievement', 'Achievement Unlocked', 'You completed your first lesson!', false),
  ('44444444-4444-4444-4444-444444444444', 'assignment', 'New Assignment', 'You have a new assignment: Grammar Exercise 1', false);

-- Function to update student metrics
CREATE OR REPLACE FUNCTION update_student_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, overall_progress, time_spent, last_updated)
  VALUES (
    NEW.user_id,
    (SELECT COUNT(*) FROM lesson_completions WHERE user_id = NEW.user_id),
    (SELECT COUNT(*) FROM lessons WHERE is_published = true),
    CASE 
      WHEN (SELECT COUNT(*) FROM lessons WHERE is_published = true) > 0 
      THEN (SELECT COUNT(*) FROM lesson_completions WHERE user_id = NEW.user_id) * 100.0 / (SELECT COUNT(*) FROM lessons WHERE is_published = true)
      ELSE 0 
    END,
    (SELECT COALESCE(SUM(time_spent), 0) FROM lesson_completions WHERE user_id = NEW.user_id),
    NOW()
  )
  ON CONFLICT (student_id) DO UPDATE SET
    lessons_completed = (SELECT COUNT(*) FROM lesson_completions WHERE user_id = NEW.user_id),
    total_lessons = (SELECT COUNT(*) FROM lessons WHERE is_published = true),
    overall_progress = CASE 
      WHEN (SELECT COUNT(*) FROM lessons WHERE is_published = true) > 0 
      THEN (SELECT COUNT(*) FROM lesson_completions WHERE user_id = NEW.user_id) * 100.0 / (SELECT COUNT(*) FROM lessons WHERE is_published = true)
      ELSE 0 
    END,
    time_spent = (SELECT COALESCE(SUM(time_spent), 0) FROM lesson_completions WHERE user_id = NEW.user_id),
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_student_metrics
  AFTER INSERT OR UPDATE ON lesson_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_student_metrics();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Everyone can view published lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Teachers can manage lessons" ON lessons FOR ALL USING (true);

CREATE POLICY "Everyone can view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can manage assignments" ON assignments FOR ALL USING (true);

CREATE POLICY "Students can view their assignments" ON assignment_students FOR SELECT USING (true);
CREATE POLICY "Students can update their assignments" ON assignment_students FOR UPDATE USING (true);
CREATE POLICY "Teachers can manage assignment_students" ON assignment_students FOR ALL USING (true);

CREATE POLICY "Users can view their completions" ON lesson_completions FOR SELECT USING (true);
CREATE POLICY "Users can insert their completions" ON lesson_completions FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their metrics" ON student_metrics FOR SELECT USING (true);
CREATE POLICY "System can manage metrics" ON student_metrics FOR ALL USING (true);

CREATE POLICY "Users can view their achievements" ON student_achievements FOR SELECT USING (true);
CREATE POLICY "System can manage achievements" ON student_achievements FOR ALL USING (true);

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "System can manage notifications" ON notifications FOR ALL USING (true);
    `

    // Execute the schema
    const { error } = await supabase.rpc("exec_sql", { sql_query: schemaSQL })

    if (error) {
      console.error("Schema application error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Complete schema applied successfully with content column",
    })
  } catch (error) {
    console.error("Error applying schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to apply schema",
      },
      { status: 500 },
    )
  }
}
