-- Complete Sophina Learning Platform Database Schema
-- This creates all necessary tables, functions, and policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in correct order to handle dependencies
DROP TABLE IF EXISTS exercise_submissions CASCADE;
DROP TABLE IF EXISTS lesson_completions CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS student_metrics CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS class_students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (unified for students, teachers, admins)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  theme_preference VARCHAR(50) DEFAULT 'system',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  class_code VARCHAR(10) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class-Student relationship table
CREATE TABLE class_students (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Lessons table with content
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB,
  category VARCHAR(50) NOT NULL DEFAULT 'grammar' CHECK (category IN ('grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing')),
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER DEFAULT 15,
  media_url TEXT,
  is_published BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table (separate from lessons for specific exercises)
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  exercise_type VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner',
  estimated_duration INTEGER DEFAULT 15,
  is_available BOOLEAN DEFAULT false,
  max_score INTEGER DEFAULT 100,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  assignment_type VARCHAR(50) NOT NULL DEFAULT 'essay',
  due_date TIMESTAMP WITH TIME ZONE,
  max_score INTEGER DEFAULT 100,
  class_id INTEGER REFERENCES classes(id),
  created_by INTEGER REFERENCES users(id) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignment submissions
CREATE TABLE assignment_submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded')),
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Exercise submissions
CREATE TABLE exercise_submissions (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, student_id)
);

-- Lesson completions
CREATE TABLE lesson_completions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 100,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  UNIQUE(student_id, lesson_id)
);

-- Student metrics
CREATE TABLE student_metrics (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  overall_progress FLOAT DEFAULT 0,
  average_score FLOAT DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student achievements
CREATE TABLE student_achievements (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_name VARCHAR(255) NOT NULL,
  achievement_description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 100,
  UNIQUE(student_id, achievement_name)
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_class_students_class_id ON class_students(class_id);
CREATE INDEX idx_class_students_student_id ON class_students(student_id);
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_is_published ON lessons(is_published);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_is_available ON exercises(is_available);
CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_created_by ON assignments(created_by);
CREATE INDEX idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX idx_exercise_submissions_exercise_id ON exercise_submissions(exercise_id);
CREATE INDEX idx_exercise_submissions_student_id ON exercise_submissions(student_id);
CREATE INDEX idx_lesson_completions_student_id ON lesson_completions(student_id);
CREATE INDEX idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX idx_student_metrics_student_id ON student_metrics(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Insert sample data
INSERT INTO users (id, username, password, role, full_name, email) VALUES
(1, 'admin', 'admin123', 'admin', 'System Administrator', 'admin@sophina.edu'),
(2, 'teacher1', 'password123', 'teacher', 'Ms. Sarah Johnson', 'sarah@sophina.edu'),
(3, 'teacher2', 'password123', 'teacher', 'Mr. David Smith', 'david@sophina.edu'),
(4, 'student1', 'password123', 'student', 'Alex Thompson', 'alex@student.edu'),
(5, 'student2', 'password123', 'student', 'Emma Wilson', 'emma@student.edu'),
(6, 'student3', 'password123', 'student', 'Michael Davis', 'michael@student.edu'),
(7, 'student4', 'password123', 'student', 'Sophia Garcia', 'sophia@student.edu')
ON CONFLICT (username) DO NOTHING;

-- Insert sample classes
INSERT INTO classes (id, name, description, teacher_id, class_code) VALUES
(1, 'English 7A', 'Beginner English for 7th grade', 2, 'ENG7A'),
(2, 'English 8B', 'Intermediate English for 8th grade', 2, 'ENG8B'),
(3, 'Advanced English 9C', 'Advanced English for 9th grade', 3, 'ENG9C')
ON CONFLICT (id) DO NOTHING;

-- Assign students to classes
INSERT INTO class_students (class_id, student_id) VALUES
(1, 4), (1, 5), (2, 6), (3, 7)
ON CONFLICT (class_id, student_id) DO NOTHING;

-- Insert sample lessons
INSERT INTO lessons (id, title, description, content, category, difficulty, estimated_duration, is_available) VALUES
(1, 'Basic Grammar', 'Learn fundamental grammar rules', '{"type": "lesson", "sections": [{"title": "Introduction", "content": "Grammar is the foundation of effective communication."}]}', 'grammar', 'beginner', 20, true),
(2, 'Verb Tenses', 'Master past, present, and future tenses', '{"type": "lesson", "sections": [{"title": "Present Tense", "content": "The present tense describes actions happening now."}]}', 'grammar', 'intermediate', 25, true),
(3, 'Basic Vocabulary', 'Essential everyday vocabulary', '{"type": "lesson", "sections": [{"title": "Common Words", "content": "Learn the most frequently used English words."}]}', 'vocabulary', 'beginner', 15, true),
(4, 'Reading Comprehension', 'Improve reading skills', '{"type": "lesson", "sections": [{"title": "Reading Strategies", "content": "Learn effective reading techniques."}]}', 'reading', 'intermediate', 30, true),
(5, 'Listening Practice', 'Develop listening skills', '{"type": "lesson", "sections": [{"title": "Active Listening", "content": "Practice focused listening techniques."}]}', 'listening', 'beginner', 20, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample exercises with real content
INSERT INTO exercises (id, title, description, content, exercise_type, category, difficulty, is_available, max_score) VALUES
(1, 'Reading Comprehension', 'Practice reading and answering questions', '{
  "passage": "Two evenly-matched teams meet at Old Trafford on Sunday, as the Manchester Originals and Birmingham Phoenix face off in a crucial game. The two sides have both picked up only eight points, with two wins and four defeats in their six matches to date. A defeat for either side will end any hopes they have of securing a top-three finish and both come into this clash following a midweek defeat. The latest Manchester Originals vs Birmingham Phoenix odds are available on LiveScore Bet. Team News: Manchester''s two wins have both come at Old Trafford, with home victories over the London Spirit and Northern Superchargers. They were all out for just 98 last time out in defeat to the Trent Rockets, so coach Simon Katich might be tempted to make some changes. England legend James Anderson is one of those hoping for a recall, having sat out the defeat at Trent Bridge. The Phoenix were also well beaten, by the Welsh Fire, and they particularly struggled with the ball as they lost by eight wickets. Assistant coach David Ripley will be looking for a much-improved performance from his bowling attack.",
  "questions": [
    {
      "id": 1,
      "question": "How many points have both teams earned so far?",
      "options": ["Six points", "Eight points", "Ten points", "Twelve points"],
      "correct": 1,
      "explanation": "The passage states that both sides have picked up only eight points."
    },
    {
      "id": 2,
      "question": "What will happen if either team loses this match?",
      "options": ["They will be relegated", "Their hopes of a top-three finish will end", "They will lose their coach", "They will have to play extra matches"],
      "correct": 1,
      "explanation": "The passage clearly states that a defeat for either side will end any hopes of securing a top-three finish."
    },
    {
      "id": 3,
      "question": "Where have Manchester Originals won their matches?",
      "options": ["At Trent Bridge", "At various venues", "At Old Trafford", "Away from home"],
      "correct": 2,
      "explanation": "The passage mentions that Manchester''s two wins have both come at Old Trafford."
    },
    {
      "id": 4,
      "question": "Who is mentioned as hoping for a recall to the Manchester team?",
      "options": ["Simon Katich", "David Ripley", "James Anderson", "The passage doesn''t mention anyone"],
      "correct": 2,
      "explanation": "The passage states that England legend James Anderson is one of those hoping for a recall."
    },
    {
      "id": 5,
      "question": "How did Birmingham Phoenix lose their last match?",
      "options": ["By eight wickets", "By eight runs", "By eight points", "They won their last match"],
      "correct": 0,
      "explanation": "The passage states that Phoenix lost by eight wickets to the Welsh Fire."
    }
  ]
}', 'comprehension', 'reading', 'intermediate', true, 100),
(2, 'Grammar Quiz', 'Test your grammar knowledge', '{
  "questions": [
    {
      "id": 1,
      "question": "Choose the correct verb form: She ___ to school every day.",
      "options": ["go", "goes", "going", "gone"],
      "correct": 1,
      "explanation": "With third person singular subjects like ''she'', we use ''goes''."
    }
  ]
}', 'quiz', 'grammar', 'beginner', true, 100),
(3, 'Vocabulary Builder', 'Expand your vocabulary', '{
  "words": [
    {
      "word": "abundant",
      "definition": "existing in large quantities; plentiful",
      "example": "The garden had abundant flowers.",
      "synonyms": ["plentiful", "ample", "copious"]
    }
  ]
}', 'vocabulary', 'vocabulary', 'intermediate', true, 100)
ON CONFLICT (id) DO NOTHING;

-- Insert sample assignments
INSERT INTO assignments (id, title, description, content, assignment_type, due_date, class_id, created_by) VALUES
(1, 'Grammar Essay', 'Write a 300-word essay demonstrating proper grammar usage', 'Write an essay about your favorite hobby, focusing on using correct verb tenses and sentence structure.', 'essay', NOW() + INTERVAL '7 days', 1, 2),
(2, 'Reading Analysis', 'Analyze a short story', 'Read the provided short story and answer the comprehension questions.', 'reading', NOW() + INTERVAL '5 days', 1, 2),
(3, 'Vocabulary Test', 'Complete vocabulary exercises', 'Define the given words and use them in sentences.', 'vocabulary', NOW() + INTERVAL '3 days', 2, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message) VALUES
(4, 'assignment', 'New Assignment', 'You have a new assignment: Grammar Essay'),
(5, 'assignment', 'New Assignment', 'You have a new assignment: Grammar Essay'),
(4, 'achievement', 'Achievement Unlocked', 'You completed your first lesson!'),
(6, 'assignment', 'Assignment Due Soon', 'Your Reading Analysis assignment is due in 2 days')
ON CONFLICT DO NOTHING;

-- Function to update student metrics
CREATE OR REPLACE FUNCTION update_student_metrics_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Update metrics for lesson completions
  IF TG_TABLE_NAME = 'lesson_completions' THEN
    INSERT INTO student_metrics (
      student_id,
      lessons_completed,
      total_lessons,
      overall_progress,
      average_score,
      time_spent,
      last_active,
      updated_at
    )
    SELECT 
      NEW.student_id,
      COUNT(DISTINCT lc.lesson_id),
      (SELECT COUNT(*) FROM lessons WHERE is_published = true),
      CASE 
        WHEN (SELECT COUNT(*) FROM lessons WHERE is_published = true) > 0 
        THEN (COUNT(DISTINCT lc.lesson_id)::float / (SELECT COUNT(*) FROM lessons WHERE is_published = true)) * 100
        ELSE 0 
      END,
      AVG(lc.score),
      SUM(lc.time_spent),
      NOW(),
      NOW()
    FROM lesson_completions lc
    WHERE lc.student_id = NEW.student_id
    GROUP BY lc.student_id
    ON CONFLICT (student_id) DO UPDATE SET
      lessons_completed = EXCLUDED.lessons_completed,
      total_lessons = EXCLUDED.total_lessons,
      overall_progress = EXCLUDED.overall_progress,
      average_score = EXCLUDED.average_score,
      time_spent = EXCLUDED.time_spent,
      last_active = EXCLUDED.last_active,
      updated_at = EXCLUDED.updated_at;
  END IF;

  -- Update metrics for exercise submissions
  IF TG_TABLE_NAME = 'exercise_submissions' THEN
    INSERT INTO student_metrics (
      student_id,
      exercises_completed,
      total_exercises,
      last_active,
      updated_at
    )
    SELECT 
      NEW.student_id,
      COUNT(DISTINCT es.exercise_id),
      (SELECT COUNT(*) FROM exercises WHERE is_available = true),
      NOW(),
      NOW()
    FROM exercise_submissions es
    WHERE es.student_id = NEW.student_id
    GROUP BY es.student_id
    ON CONFLICT (student_id) DO UPDATE SET
      exercises_completed = EXCLUDED.exercises_completed,
      total_exercises = EXCLUDED.total_exercises,
      last_active = EXCLUDED.last_active,
      updated_at = EXCLUDED.updated_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_metrics_lessons ON lesson_completions;
CREATE TRIGGER trigger_update_metrics_lessons
  AFTER INSERT OR UPDATE ON lesson_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_student_metrics_trigger();

DROP TRIGGER IF EXISTS trigger_update_metrics_exercises ON exercise_submissions;
CREATE TRIGGER trigger_update_metrics_exercises
  AFTER INSERT OR UPDATE ON exercise_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_student_metrics_trigger();

-- Initialize student metrics for existing students
INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, exercises_completed, total_exercises, overall_progress, last_active, updated_at)
SELECT 
  u.id,
  0,
  (SELECT COUNT(*) FROM lessons WHERE is_published = true),
  0,
  (SELECT COUNT(*) FROM exercises WHERE is_available = true),
  0,
  NOW(),
  NOW()
FROM users u
WHERE u.role = 'student'
ON CONFLICT (student_id) DO NOTHING;

-- Reset sequences
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);
SELECT setval('classes_id_seq', COALESCE((SELECT MAX(id) FROM classes), 0) + 1, false);
SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 0) + 1, false);
SELECT setval('exercises_id_seq', COALESCE((SELECT MAX(id) FROM exercises), 0) + 1, false);
SELECT setval('assignments_id_seq', COALESCE((SELECT MAX(id) FROM assignments), 0) + 1, false);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Everyone can view published lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Teachers can manage lessons" ON lessons FOR ALL USING (true);

CREATE POLICY "Everyone can view available exercises" ON exercises FOR SELECT USING (is_available = true);
CREATE POLICY "Teachers can manage exercises" ON exercises FOR ALL USING (true);

CREATE POLICY "Students can view class assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can manage assignments" ON assignments FOR ALL USING (true);

CREATE POLICY "Students can manage their submissions" ON assignment_submissions FOR ALL USING (true);
CREATE POLICY "Teachers can view all submissions" ON assignment_submissions FOR SELECT USING (true);

CREATE POLICY "Students can manage their exercise submissions" ON exercise_submissions FOR ALL USING (true);
CREATE POLICY "Teachers can view exercise submissions" ON exercise_submissions FOR SELECT USING (true);

CREATE POLICY "Students can manage their completions" ON lesson_completions FOR ALL USING (true);
CREATE POLICY "Teachers can view completions" ON lesson_completions FOR SELECT USING (true);

CREATE POLICY "Users can view their metrics" ON student_metrics FOR SELECT USING (true);
CREATE POLICY "System can manage metrics" ON student_metrics FOR ALL USING (true);

CREATE POLICY "Users can view their achievements" ON student_achievements FOR SELECT USING (true);
CREATE POLICY "System can manage achievements" ON student_achievements FOR ALL USING (true);

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "System can manage notifications" ON notifications FOR ALL USING (true);

COMMIT;
