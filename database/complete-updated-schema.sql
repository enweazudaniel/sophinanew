-- Complete Updated Database Schema for Sophina Learning Platform
-- This schema includes all new features while preserving existing authentication

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS submission_files CASCADE;
DROP TABLE IF EXISTS assignment_files CASCADE;
DROP TABLE IF EXISTS exercise_attempts CASCADE;
DROP TABLE IF EXISTS class_exercises CASCADE;
DROP TABLE IF EXISTS exercise_analytics CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS student_metrics CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS assignment_students CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS class_teachers CASCADE;
DROP TABLE IF EXISTS grading_scales CASCADE;
DROP TABLE IF EXISTS exercise_types CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (unified for students, teachers, and admins)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  class_id INTEGER,
  avatar_url TEXT,
  theme_preference VARCHAR(50) DEFAULT 'system',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  grade_level VARCHAR(20),
  subject VARCHAR(50),
  teacher_id INTEGER,
  max_students INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for class_id in users table
ALTER TABLE users ADD CONSTRAINT fk_users_class_id 
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;

-- Add foreign key constraint for teacher_id in classes table
ALTER TABLE classes ADD CONSTRAINT fk_classes_teacher_id 
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create grading scales table
CREATE TABLE grading_scales (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default grading scales
INSERT INTO grading_scales (name, min_score, max_score, description, is_default) VALUES
('Scale 0-5', 0, 5, 'Traditional 5-point scale', false),
('Scale 0-10', 0, 10, 'Standard 10-point scale', true),
('Scale 0-20', 0, 20, 'Extended 20-point scale', false),
('Scale 0-100', 0, 100, 'Percentage-based 100-point scale', false);

-- Create exercise types table
CREATE TABLE exercise_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  supports_auto_grading BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert exercise types
INSERT INTO exercise_types (name, description, supports_auto_grading) VALUES
('mcq', 'Multiple Choice Questions', true),
('true_false', 'True/False Questions', true),
('fill_blank', 'Fill in the Blanks', true),
('matching', 'Matching Questions', true),
('essay', 'Essay Questions', false),
('file_upload', 'File Upload Assignments', false),
('audio_response', 'Audio Response Questions', false);

-- Create exercises table (enhanced with class support)
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  subject VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  exercise_type VARCHAR(50) DEFAULT 'mcq',
  content JSONB NOT NULL, -- Questions, options, correct answers, etc.
  max_score INTEGER DEFAULT 100,
  time_limit INTEGER, -- in minutes
  attempts_allowed INTEGER DEFAULT 1,
  passing_score INTEGER DEFAULT 60,
  auto_grade BOOLEAN DEFAULT true,
  show_results_immediately BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT false,
  tags TEXT[],
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_exercises junction table (for assigning exercises to classes)
CREATE TABLE class_exercises (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(class_id, exercise_id)
);

-- Create exercise_attempts table (track student attempts)
CREATE TABLE exercise_attempts (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  attempt_number INTEGER DEFAULT 1,
  answers JSONB, -- Student's answers
  score INTEGER,
  max_score INTEGER,
  time_spent INTEGER, -- in seconds
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  feedback TEXT,
  auto_graded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, student_id, attempt_number)
);

-- Create assignments table (enhanced with file support)
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  subject VARCHAR(50) NOT NULL,
  assignment_type VARCHAR(50) DEFAULT 'text' CHECK (assignment_type IN ('text', 'file', 'mixed')),
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  max_score INTEGER DEFAULT 100,
  max_file_size INTEGER DEFAULT 10485760, -- 10MB in bytes
  allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'],
  rubric JSONB, -- Grading rubric
  resources JSONB, -- Links, files, additional materials
  auto_grade BOOLEAN DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment_files table (teacher attachments)
CREATE TABLE assignment_files (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table (enhanced with file support)
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT, -- Text submission
  submission_type VARCHAR(50) DEFAULT 'text',
  files JSONB, -- Array of file objects
  metadata JSONB, -- Additional submission data
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
  score INTEGER,
  auto_score INTEGER,
  manual_score INTEGER,
  rubric_scores JSONB,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Create submission_files table (student file uploads)
CREATE TABLE submission_files (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB, -- Additional notification data
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create student_metrics table (performance tracking)
CREATE TABLE student_metrics (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  subject VARCHAR(50),
  exercises_completed INTEGER DEFAULT 0,
  exercises_assigned INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  assignments_assigned INTEGER DEFAULT 0,
  average_exercise_score DECIMAL(5,2) DEFAULT 0.00,
  average_assignment_score DECIMAL(5,2) DEFAULT 0.00,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id, subject)
);

-- Create student_achievements table
CREATE TABLE student_achievements (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  achievement_description TEXT,
  progress DECIMAL(5,2) DEFAULT 100.00,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

-- Create exercise_analytics table (class performance tracking)
CREATE TABLE exercise_analytics (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  total_attempts INTEGER DEFAULT 0,
  completed_attempts INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  average_time_spent INTEGER DEFAULT 0, -- in seconds
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_performance_summary table
CREATE TABLE class_performance_summary (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  total_students INTEGER DEFAULT 0,
  active_students INTEGER DEFAULT 0,
  exercises_assigned INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  assignments_assigned INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  average_completion_rate DECIMAL(5,2) DEFAULT 0.00,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, subject)
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_class_id ON users(class_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_exercises_subject ON exercises(subject);
CREATE INDEX idx_exercises_created_by ON exercises(created_by);
CREATE INDEX idx_class_exercises_class_id ON class_exercises(class_id);
CREATE INDEX idx_class_exercises_exercise_id ON class_exercises(exercise_id);
CREATE INDEX idx_exercise_attempts_student_id ON exercise_attempts(student_id);
CREATE INDEX idx_exercise_attempts_exercise_id ON exercise_attempts(exercise_id);
CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_created_by ON assignments(created_by);
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_student_metrics_student_id ON student_metrics(student_id);
CREATE INDEX idx_assignment_files_assignment_id ON assignment_files(assignment_id);
CREATE INDEX idx_submission_files_submission_id ON submission_files(submission_id);

-- Insert sample data for testing

-- Insert sample admin user
INSERT INTO users (username, password, full_name, email, role) VALUES
('admin', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'System Administrator', 'admin@sophina.edu', 'admin');

-- Insert sample teachers
INSERT INTO users (username, password, full_name, email, role) VALUES
('teacher1', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Sarah Johnson', 'sarah.johnson@sophina.edu', 'teacher'),
('teacher2', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Michael Chen', 'michael.chen@sophina.edu', 'teacher'),
('teacher3', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Emily Rodriguez', 'emily.rodriguez@sophina.edu', 'teacher');

-- Insert sample classes
INSERT INTO classes (name, description, grade_level, subject, teacher_id) VALUES
('Mathematics 101', 'Basic mathematics for beginners', 'Grade 9', 'Mathematics', 2),
('Science Fundamentals', 'Introduction to basic science concepts', 'Grade 9', 'Science', 3),
('History & Social Studies', 'World history and social studies', 'Grade 10', 'History', 4),
('Literature & Writing', 'Reading comprehension and creative writing', 'Grade 10', 'English', 2);

-- Insert sample students
INSERT INTO users (username, password, full_name, role, class_id) VALUES
('student1', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Alex Thompson', 'student', 1),
('student2', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Maria Garcia', 'student', 1),
('student3', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'James Wilson', 'student', 2),
('student4', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'Lisa Chang', 'student', 2),
('student5', '$2b$10$rQZ9QmjlhZZZ9QmjlhZZZOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'David Brown', 'student', 3);

-- Insert sample exercises
INSERT INTO exercises (title, description, subject, difficulty, exercise_type, content, max_score, created_by, is_available) VALUES
('Basic Algebra Quiz', 'Test your understanding of basic algebraic concepts', 'Mathematics', 'beginner', 'mcq', 
'{"questions": [
  {
    "id": 1,
    "question": "What is 2x + 3 = 11? Solve for x.",
    "options": ["x = 4", "x = 5", "x = 6", "x = 7"],
    "correctAnswer": 0,
    "explanation": "2x + 3 = 11, so 2x = 8, therefore x = 4"
  },
  {
    "id": 2,
    "question": "Simplify: 3(x + 2) - 2x",
    "options": ["x + 6", "x + 2", "3x + 4", "5x + 6"],
    "correctAnswer": 0,
    "explanation": "3(x + 2) - 2x = 3x + 6 - 2x = x + 6"
  }
]}', 100, 2, true),

('Science Basics', 'Fundamental science concepts', 'Science', 'beginner', 'mcq',
'{"questions": [
  {
    "id": 1,
    "question": "What is the chemical symbol for water?",
    "options": ["H2O", "CO2", "NaCl", "O2"],
    "correctAnswer": 0,
    "explanation": "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O"
  },
  {
    "id": 2,
    "question": "Which planet is closest to the Sun?",
    "options": ["Venus", "Mercury", "Earth", "Mars"],
    "correctAnswer": 1,
    "explanation": "Mercury is the closest planet to the Sun in our solar system"
  }
]}', 100, 3, true);

-- Assign exercises to classes
INSERT INTO class_exercises (class_id, exercise_id, assigned_by, due_date) VALUES
(1, 1, 2, NOW() + INTERVAL '7 days'),
(2, 2, 3, NOW() + INTERVAL '5 days');

-- Insert sample assignments
INSERT INTO assignments (title, description, subject, assignment_type, class_id, max_score, due_date, created_by) VALUES
('Math Problem Set 1', 'Complete the attached problem set on basic algebra', 'Mathematics', 'mixed', 1, 100, NOW() + INTERVAL '10 days', 2),
('Science Lab Report', 'Write a report on your recent lab experiment', 'Science', 'file', 2, 100, NOW() + INTERVAL '14 days', 3),
('History Essay', 'Write a 500-word essay on the Industrial Revolution', 'History', 'text', 3, 100, NOW() + INTERVAL '21 days', 4);

-- Initialize student metrics
INSERT INTO student_metrics (student_id, class_id, subject) VALUES
(5, 1, 'Mathematics'),
(6, 1, 'Mathematics'),
(7, 2, 'Science'),
(8, 2, 'Science'),
(9, 3, 'History');

-- Create functions for updating metrics
CREATE OR REPLACE FUNCTION update_student_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update metrics when exercise attempt is completed
  IF TG_TABLE_NAME = 'exercise_attempts' AND NEW.is_completed = true THEN
    INSERT INTO student_metrics (student_id, class_id, subject, exercises_completed, average_exercise_score)
    SELECT 
      NEW.student_id,
      c.id,
      e.subject,
      1,
      NEW.score
    FROM exercises e
    JOIN class_exercises ce ON e.id = ce.exercise_id
    JOIN classes c ON ce.class_id = c.id
    WHERE e.id = NEW.exercise_id
    ON CONFLICT (student_id, class_id, subject)
    DO UPDATE SET
      exercises_completed = student_metrics.exercises_completed + 1,
      average_exercise_score = (student_metrics.average_exercise_score * (student_metrics.exercises_completed - 1) + NEW.score) / student_metrics.exercises_completed,
      updated_at = NOW();
  END IF;
  
  -- Update metrics when assignment is submitted
  IF TG_TABLE_NAME = 'submissions' AND NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
    INSERT INTO student_metrics (student_id, class_id, subject, assignments_completed)
    SELECT 
      NEW.student_id,
      a.class_id,
      a.subject,
      1
    FROM assignments a
    WHERE a.id = NEW.assignment_id
    ON CONFLICT (student_id, class_id, subject)
    DO UPDATE SET
      assignments_completed = student_metrics.assignments_completed + 1,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_student_metrics_exercises
  AFTER INSERT OR UPDATE ON exercise_attempts
  FOR EACH ROW EXECUTE FUNCTION update_student_metrics();

CREATE TRIGGER trigger_update_student_metrics_assignments
  AFTER INSERT OR UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_student_metrics();

-- Create function to update exercise analytics
CREATE OR REPLACE FUNCTION update_exercise_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO exercise_analytics (exercise_id, class_id, total_attempts, completed_attempts, average_score, completion_rate)
  SELECT 
    NEW.exercise_id,
    ce.class_id,
    COUNT(*),
    COUNT(*) FILTER (WHERE is_completed = true),
    AVG(score) FILTER (WHERE is_completed = true),
    (COUNT(*) FILTER (WHERE is_completed = true)::DECIMAL / COUNT(*)) * 100
  FROM exercise_attempts ea
  JOIN class_exercises ce ON ea.exercise_id = ce.exercise_id
  WHERE ea.exercise_id = NEW.exercise_id
  GROUP BY NEW.exercise_id, ce.class_id
  ON CONFLICT (exercise_id, class_id)
  DO UPDATE SET
    total_attempts = EXCLUDED.total_attempts,
    completed_attempts = EXCLUDED.completed_attempts,
    average_score = EXCLUDED.average_score,
    completion_rate = EXCLUDED.completion_rate,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for exercise analytics
CREATE TRIGGER trigger_update_exercise_analytics
  AFTER INSERT OR UPDATE ON exercise_attempts
  FOR EACH ROW EXECUTE FUNCTION update_exercise_analytics();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Final verification queries (uncomment to run checks)
-- SELECT 'Users created: ' || COUNT(*) FROM users;
-- SELECT 'Classes created: ' || COUNT(*) FROM classes;
-- SELECT 'Exercises created: ' || COUNT(*) FROM exercises;
-- SELECT 'Assignments created: ' || COUNT(*) FROM assignments;

COMMIT;
