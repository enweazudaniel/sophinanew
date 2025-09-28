-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert example teacher
INSERT INTO teachers (username, password, full_name, email)
VALUES ('teacher1', 'password123', 'John Smith', 'john.smith@sophina.edu');

-- Students table (already exists, but adding avatar_url)
ALTER TABLE students ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update example student with avatar
UPDATE students SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faith' WHERE username = '001';

-- Exercise scores table
CREATE TABLE IF NOT EXISTS exercise_scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL, -- 'grammar', 'vocabulary', 'reading', etc.
  exercise_id TEXT NOT NULL, -- identifier for the specific exercise
  score INTEGER NOT NULL, -- score as a percentage
  max_score INTEGER NOT NULL, -- maximum possible score
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignment_type TEXT NOT NULL, -- 'essay', 'summary', etc.
  due_date TIMESTAMPTZ,
  created_by INTEGER REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted', -- 'submitted', 'graded'
  score INTEGER, -- NULL until graded
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  graded_by INTEGER REFERENCES teachers(id)
);

-- Insert some sample data
INSERT INTO assignments (title, description, assignment_type, created_by)
VALUES 
  ('Personal Essay', 'Write a 500-word essay about your favorite book', 'essay', 1),
  ('News Summary', 'Summarize the provided news article in 200 words', 'summary', 1);

-- Insert sample exercise scores
INSERT INTO exercise_scores (student_id, exercise_type, exercise_id, score, max_score)
VALUES 
  (1, 'grammar', 'basic-grammar', 85, 100),
  (1, 'vocabulary', 'basic-vocabulary', 90, 100),
  (1, 'reading', 'short-stories', 75, 100);
