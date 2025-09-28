-- Drop existing foreign key constraints and recreate with proper relationships
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_fkey;

-- Fix lessons table structure
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Create class_teachers junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS class_teachers (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'teacher', -- 'teacher', 'lead_teacher', 'assistant'
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, teacher_id)
);

-- Add grading scales table
CREATE TABLE IF NOT EXISTS grading_scales (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default grading scales
INSERT INTO grading_scales (name, min_score, max_score, description, is_default) VALUES
('Scale 0-5', 0, 5, 'Traditional 5-point scale', FALSE),
('Scale 0-10', 0, 10, 'Standard 10-point scale', TRUE),
('Scale 0-20', 0, 20, 'Extended 20-point scale', FALSE),
('Scale 0-60', 0, 60, 'Comprehensive 60-point scale', FALSE),
('Scale 0-100', 0, 100, 'Percentage-based 100-point scale', FALSE)
ON CONFLICT DO NOTHING;

-- Add grading_scale_id to classes
ALTER TABLE classes ADD COLUMN IF NOT EXISTS grading_scale_id INTEGER REFERENCES grading_scales(id) DEFAULT 2;

-- Enhanced assignments table with file support
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS grading_scale_id INTEGER REFERENCES grading_scales(id);
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS max_score INTEGER DEFAULT 100;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS instructions TEXT;

-- Enhanced exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'essay', 'file_upload', 'audio_response'
  content JSONB NOT NULL, -- Questions, options, etc.
  attachments JSONB DEFAULT '[]', -- File attachments
  skill_area VARCHAR(50), -- 'grammar', 'vocabulary', 'reading', 'writing', 'speaking', 'listening'
  difficulty VARCHAR(20) DEFAULT 'beginner',
  max_score INTEGER DEFAULT 100,
  time_limit INTEGER, -- in minutes
  created_by INTEGER REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE
);

-- Exercise assignments (linking exercises to classes)
CREATE TABLE IF NOT EXISTS exercise_assignments (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  assigned_by INTEGER REFERENCES teachers(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Student exercise attempts
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  time_spent INTEGER DEFAULT 0, -- in seconds
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by INTEGER NOT NULL, -- Can be teacher or student ID
  uploaded_by_type VARCHAR(20) NOT NULL, -- 'teacher' or 'student'
  upload_context VARCHAR(50), -- 'assignment', 'exercise', 'submission'
  context_id INTEGER, -- ID of the related assignment/exercise/submission
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced student metrics
CREATE TABLE IF NOT EXISTS student_performance_metrics (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  skill_area VARCHAR(50) NOT NULL,
  total_exercises INTEGER DEFAULT 0,
  completed_exercises INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  last_activity TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, class_id, skill_area)
);

-- Class performance summary
CREATE TABLE IF NOT EXISTS class_performance_summary (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  skill_area VARCHAR(50) NOT NULL,
  total_students INTEGER DEFAULT 0,
  active_students INTEGER DEFAULT 0,
  average_completion_rate DECIMAL(5,2) DEFAULT 0.00,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  total_exercises INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, skill_area)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_teachers_class_id ON class_teachers(class_id);
CREATE INDEX IF NOT EXISTS idx_class_teachers_teacher_id ON class_teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_exercise_assignments_class_id ON exercise_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_student_id ON exercise_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_exercise_id ON exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_student_performance_metrics_student_id ON student_performance_metrics(student_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_context ON file_uploads(upload_context, context_id);
