-- Enhanced exercises schema with class-based exercises and improved assignments

-- Create exercise_types table for different question types
CREATE TABLE IF NOT EXISTS exercise_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default exercise types
INSERT INTO exercise_types (name, description) VALUES
('mcq', 'Multiple Choice Questions'),
('true_false', 'True/False Questions'),
('fill_blank', 'Fill in the Blanks'),
('matching', 'Matching Questions'),
('essay', 'Essay Questions'),
('file_upload', 'File Upload Assignments')
ON CONFLICT (name) DO NOTHING;

-- Enhanced exercises table with class support
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS exercise_type VARCHAR(50) DEFAULT 'mcq';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS auto_grade BOOLEAN DEFAULT true;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS show_results_immediately BOOLEAN DEFAULT true;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS attempts_allowed INTEGER DEFAULT 1;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS passing_score INTEGER DEFAULT 60;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create exercise_attempts table to track student attempts
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  attempt_number INTEGER DEFAULT 1,
  answers JSONB,
  score INTEGER,
  max_score INTEGER,
  time_spent INTEGER, -- in seconds
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, student_id, attempt_number)
);

-- Enhanced assignments table with file support
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(50) DEFAULT 'text';
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS max_file_size INTEGER DEFAULT 10485760; -- 10MB
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx', 'txt'];
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS rubric JSONB;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS auto_grade BOOLEAN DEFAULT false;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS resources JSONB; -- Links, files, etc.

-- Enhanced submissions table with file support
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS submission_type VARCHAR(50) DEFAULT 'text';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS files JSONB; -- Array of file objects
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS metadata JSONB; -- Additional submission data
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS auto_score INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS manual_score INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS rubric_scores JSONB;

-- Create assignment_files table for file attachments
CREATE TABLE IF NOT EXISTS assignment_files (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submission_files table for student file submissions
CREATE TABLE IF NOT EXISTS submission_files (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_exercises junction table for class-specific exercises
CREATE TABLE IF NOT EXISTS class_exercises (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(class_id, exercise_id)
);

-- Create exercise_analytics table for tracking performance
CREATE TABLE IF NOT EXISTS exercise_analytics (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  total_attempts INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  completion_rate DECIMAL(5,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_class_id ON exercises(class_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_student_exercise ON exercise_attempts(student_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_class_exercises_class_id ON class_exercises(class_id);
CREATE INDEX IF NOT EXISTS idx_assignment_files_assignment_id ON assignment_files(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id ON submission_files(submission_id);

-- Update RLS policies
CREATE POLICY "Students can view exercises assigned to their class" ON exercises
  FOR SELECT USING (
    class_id IN (
      SELECT class_id FROM users WHERE id = auth.uid()
    ) OR class_id IS NULL
  );

CREATE POLICY "Teachers can manage exercises for their classes" ON exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Students can view their exercise attempts" ON exercise_attempts
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their exercise attempts" ON exercise_attempts
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view all exercise attempts" ON exercise_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );
