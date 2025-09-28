-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update users table to include class_id and theme_preference
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(50) DEFAULT 'system';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Assignments table
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS target_type VARCHAR(20) DEFAULT 'all';
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id);

-- Assignment-Student relationship table
CREATE TABLE IF NOT EXISTS assignment_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'assigned',
  submitted_at TIMESTAMP WITH TIME ZONE,
  grade NUMERIC,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Student metrics table
CREATE TABLE IF NOT EXISTS student_metrics (
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
CREATE TABLE IF NOT EXISTS student_achievements (
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
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can create assignments" ON assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Everyone can view assignments" ON assignments
  FOR SELECT USING (true);

CREATE POLICY "Students can view their assignments" ON assignment_students
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Teachers can manage assignment_students" ON assignment_students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Students can view their metrics" ON student_metrics
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all metrics" ON student_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );

CREATE POLICY "Students can view their achievements" ON student_achievements
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all achievements" ON student_achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
    )
  );
