-- Simple, working assignments schema for Supabase
-- This will fix all the broken functionality

-- First, let's clean up and create the basic tables we need

-- Drop existing problematic tables
DROP TABLE IF EXISTS submission_files CASCADE;
DROP TABLE IF EXISTS assignment_files CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;

-- Create a simple assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  assignment_type VARCHAR(50) DEFAULT 'text',
  due_date TIMESTAMP WITH TIME ZONE,
  max_score INTEGER DEFAULT 100,
  class_id INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a simple submissions table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'submitted',
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Create notifications table (simple version)
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample assignments for testing
INSERT INTO assignments (title, description, assignment_type, due_date, created_by) VALUES
('Math Problem Set 1', 'Complete the basic algebra problems', 'text', NOW() + INTERVAL '7 days', 2),
('Science Essay', 'Write a 500-word essay on photosynthesis', 'text', NOW() + INTERVAL '10 days', 3),
('History Report', 'Research and write about World War II', 'text', NOW() + INTERVAL '14 days', 2);

-- Create indexes for better performance
CREATE INDEX idx_assignments_created_by ON assignments(created_by);
CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Grant necessary permissions
-- Note: Adjust these based on your Supabase setup
-- GRANT ALL ON assignments TO authenticated;
-- GRANT ALL ON submissions TO authenticated;
-- GRANT ALL ON notifications TO authenticated;

COMMIT;
