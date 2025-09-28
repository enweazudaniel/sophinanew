-- Fix missing columns in student_metrics table
ALTER TABLE student_metrics 
ADD COLUMN IF NOT EXISTS grammar_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vocabulary_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS listening_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS speaking_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS writing_progress INTEGER DEFAULT 0;

-- Create student_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS student_achievements (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  achievement_id INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(100),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default achievements
INSERT INTO achievements (id, name, description, icon, category, points) VALUES
(1, 'First Steps', 'Complete your first lesson', '🎯', 'progress', 10),
(2, 'Dedicated Learner', 'Complete 10 lessons', '📚', 'progress', 50),
(3, 'Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak', 30),
(4, 'Grammar Master', 'Reach 50% grammar progress', '📝', 'grammar', 40),
(5, 'Word Wizard', 'Reach 50% vocabulary progress', '🔤', 'vocabulary', 40)
ON CONFLICT (id) DO NOTHING;

-- Create lesson_completions table if it doesn't exist
CREATE TABLE IF NOT EXISTS lesson_completions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER,
  time_spent INTEGER,
  UNIQUE(student_id, lesson_id)
);

-- Fix notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
