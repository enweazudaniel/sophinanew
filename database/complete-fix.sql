-- Fix and enhance the database schema for the educational platform

-- 1. Ensure all sequences exist
CREATE SEQUENCE IF NOT EXISTS assignments_id_seq;
CREATE SEQUENCE IF NOT EXISTS exercise_scores_id_seq;
CREATE SEQUENCE IF NOT EXISTS lesson_completions_id_seq;
CREATE SEQUENCE IF NOT EXISTS lessons_id_seq;
CREATE SEQUENCE IF NOT EXISTS notifications_id_seq;
CREATE SEQUENCE IF NOT EXISTS student_achievements_id_seq;
CREATE SEQUENCE IF NOT EXISTS student_metrics_id_seq;
CREATE SEQUENCE IF NOT EXISTS students_id_seq;
CREATE SEQUENCE IF NOT EXISTS submissions_id_seq;
CREATE SEQUENCE IF NOT EXISTS teachers_id_seq;
CREATE SEQUENCE IF NOT EXISTS user_activity_log_id_seq;

-- 2. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Insert default lessons if they don't exist
INSERT INTO lessons (id, title, description, category, difficulty, estimated_duration, is_published, created_at) VALUES
(1, 'Basic Grammar', 'Learn fundamental grammar rules', 'Grammar', 'Beginner', 15, TRUE, NOW()),
(2, 'Verb Tenses', 'Master past, present, and future tenses', 'Grammar', 'Beginner', 20, TRUE, NOW()),
(3, 'Articles and Prepositions', 'Learn when to use a, an, the, and prepositions', 'Grammar', 'Intermediate', 25, TRUE, NOW()),
(4, 'Basic Vocabulary', 'Essential everyday vocabulary', 'Vocabulary', 'Beginner', 15, TRUE, NOW()),
(5, 'Vocabulary Builder', 'Expand your vocabulary with advanced words', 'Vocabulary', 'Intermediate', 20, TRUE, NOW()),
(6, 'Listening Practice', 'Improve listening comprehension', 'Listening', 'Beginner', 15, TRUE, NOW()),
(7, 'Listening Conversations', 'Practice with real conversations', 'Listening', 'Intermediate', 20, TRUE, NOW()),
(8, 'Listening Lectures', 'Academic listening skills', 'Listening', 'Advanced', 30, TRUE, NOW()),
(9, 'Speaking Practice', 'Basic speaking exercises', 'Speaking', 'Beginner', 15, TRUE, NOW()),
(10, 'Speaking Basic', 'Fundamental speaking skills', 'Speaking', 'Beginner', 15, TRUE, NOW()),
(11, 'Speaking Drills', 'Pronunciation and fluency drills', 'Speaking', 'Intermediate', 20, TRUE, NOW()),
(12, 'Conversation Practice', 'Interactive conversation practice', 'Speaking', 'Intermediate', 25, TRUE, NOW()),
(13, 'Tongue Twisters', 'Improve pronunciation with tongue twisters', 'Speaking', 'Intermediate', 15, TRUE, NOW()),
(14, 'Intonation Practice', 'Master English intonation patterns', 'Speaking', 'Advanced', 20, TRUE, NOW()),
(15, 'Reading Comprehension', 'Improve reading skills', 'Reading', 'Beginner', 20, TRUE, NOW()),
(16, 'Short Stories', 'Read and analyze short stories', 'Reading', 'Intermediate', 30, TRUE, NOW()),
(17, 'Essay Writing', 'Learn to write effective essays', 'Writing', 'Intermediate', 45, TRUE, NOW()),
(18, 'Summary Writing', 'Practice writing summaries', 'Writing', 'Beginner', 30, TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Update sequences to match existing data
SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 1));
SELECT setval('students_id_seq', COALESCE((SELECT MAX(id) FROM students), 1));
SELECT setval('teachers_id_seq', COALESCE((SELECT MAX(id) FROM teachers), 1));
SELECT setval('assignments_id_seq', COALESCE((SELECT MAX(id) FROM assignments), 1));
SELECT setval('lesson_completions_id_seq', COALESCE((SELECT MAX(id) FROM lesson_completions), 1));
SELECT setval('student_metrics_id_seq', COALESCE((SELECT MAX(id) FROM student_metrics), 1));
SELECT setval('notifications_id_seq', COALESCE((SELECT MAX(id) FROM notifications), 1));
SELECT setval('submissions_id_seq', COALESCE((SELECT MAX(id) FROM submissions), 1));

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_completions_student_lesson ON lesson_completions(student_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_metrics_student_id ON student_metrics(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(user_type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_assignments_created_by ON assignments(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_student_id ON lesson_completions(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignment_classes_class_id ON assignment_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_assignment_classes_assignment_id ON assignment_classes(assignment_id);

-- 6. Create or replace function to update student metrics
CREATE OR REPLACE FUNCTION update_student_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert student metrics
    INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, overall_progress, last_active)
    VALUES (
        NEW.student_id,
        (SELECT COUNT(*) FROM lesson_completions WHERE student_id = NEW.student_id),
        (SELECT COUNT(*) FROM lessons),
        (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons) FROM lesson_completions WHERE student_id = NEW.student_id),
        NOW()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        lessons_completed = (SELECT COUNT(*) FROM lesson_completions WHERE student_id = NEW.student_id),
        total_lessons = (SELECT COUNT(*) FROM lessons),
        overall_progress = (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons) FROM lesson_completions WHERE student_id = NEW.student_id),
        last_active = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for automatic metrics updates
DROP TRIGGER IF EXISTS trigger_update_student_metrics ON lesson_completions;
CREATE TRIGGER trigger_update_student_metrics
    AFTER INSERT OR UPDATE ON lesson_completions
    FOR EACH ROW
    EXECUTE FUNCTION update_student_metrics();

-- 8. Create function to get student dashboard data
CREATE OR REPLACE FUNCTION get_student_dashboard(p_student_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'student', json_build_object(
            'id', s.id,
            'username', s.username,
            'full_name', s.full_name,
            'avatar_url', s.avatar_url
        ),
        'metrics', json_build_object(
            'overall_progress', COALESCE(sm.overall_progress, 0),
            'lessons_completed', COALESCE(sm.lessons_completed, 0),
            'total_lessons', COALESCE(sm.total_lessons, 0),
            'time_spent', COALESCE(sm.time_spent, 0)
        ),
        'recent_completions', (
            SELECT json_agg(json_build_object(
                'lesson_title', l.title,
                'score', lc.score,
                'completed_at', lc.completed_at
            ))
            FROM lesson_completions lc
            JOIN lessons l ON l.id = lc.lesson_id
            WHERE lc.student_id = p_student_id
            ORDER BY lc.completed_at DESC
            LIMIT 5
        ),
        'pending_assignments', (
            SELECT json_agg(json_build_object(
                'id', a.id,
                'title', a.title,
                'due_date', a.due_date,
                'assignment_type', a.assignment_type
            ))
            FROM assignments a
            WHERE a.id NOT IN (
                SELECT assignment_id FROM submissions WHERE student_id = p_student_id
            )
            ORDER BY a.due_date ASC
            LIMIT 5
        ),
        'achievements', (
            SELECT json_agg(json_build_object(
                'achievement_name', sa.achievement_name,
                'achievement_description', sa.achievement_description,
                'earned_at', sa.earned_at,
                'category', sa.category,
                'icon', sa.icon
            ))
            FROM student_achievements sa
            WHERE sa.student_id = p_student_id
            ORDER BY sa.earned_at DESC
            LIMIT 5
        )
    ) INTO result
    FROM students s
    LEFT JOIN student_metrics sm ON sm.student_id = s.id
    WHERE s.id = p_student_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 9. Create function to get teacher dashboard data
CREATE OR REPLACE FUNCTION get_teacher_dashboard(p_teacher_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'teacher', json_build_object(
            'id', t.id,
            'username', t.username,
            'full_name', t.full_name,
            'email', t.email
        ),
        'classes', (
            SELECT json_agg(json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description,
                'student_count', (SELECT COUNT(*) FROM students WHERE class_id = c.id)
            ))
            FROM classes c
            WHERE c.teacher_id = p_teacher_id
        ),
        'recent_assignments', (
            SELECT json_agg(json_build_object(
                'id', a.id,
                'title', a.title,
                'assignment_type', a.assignment_type,
                'due_date', a.due_date,
                'submission_count', (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id)
            ))
            FROM assignments a
            WHERE a.created_by = p_teacher_id
            ORDER BY a.created_at DESC
            LIMIT 5
        ),
        'pending_grading', (
            SELECT json_agg(json_build_object(
                'id', s.id,
                'assignment_title', a.title,
                'student_name', st.full_name,
                'submitted_at', s.submitted_at
            ))
            FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
            JOIN students st ON st.id = s.student_id
            WHERE a.created_by = p_teacher_id AND s.status = 'submitted'
            ORDER BY s.submitted_at ASC
            LIMIT 10
        ),
        'class_progress', (
            SELECT json_agg(json_build_object(
                'class_name', c.name,
                'avg_progress', COALESCE(AVG(sm.overall_progress), 0),
                'active_students', COUNT(DISTINCT s.id)
            ))
            FROM classes c
            LEFT JOIN students s ON s.class_id = c.id
            LEFT JOIN student_metrics sm ON sm.student_id = s.id
            WHERE c.teacher_id = p_teacher_id
            GROUP BY c.id, c.name
        )
    ) INTO result
    FROM teachers t
    WHERE t.id = p_teacher_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 10. Initialize student metrics for existing students
INSERT INTO student_metrics (student_id, lessons_completed, total_lessons, overall_progress, last_active, streak_days)
SELECT 
    s.id,
    COALESCE((SELECT COUNT(*) FROM lesson_completions WHERE student_id = s.id), 0),
    (SELECT COUNT(*) FROM lessons),
    COALESCE((SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons) FROM lesson_completions WHERE student_id = s.id), 0),
    NOW(),
    0
FROM students s
WHERE s.id NOT IN (SELECT student_id FROM student_metrics)
ON CONFLICT (student_id) DO NOTHING;

-- Fix notifications table
ALTER TABLE notifications ALTER COLUMN user_type DROP NOT NULL;
ALTER TABLE notifications ALTER COLUMN user_type SET DEFAULT 'student';
UPDATE notifications SET user_type = 'student' WHERE user_type IS NULL;

-- Fix lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Ensure all required tables exist
CREATE TABLE IF NOT EXISTS assignment_classes (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(assignment_id, class_id)
);

-- Add missing columns to student_metrics
ALTER TABLE student_metrics ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;

-- Insert sample data if tables are empty
INSERT INTO classes (name, description, created_at) VALUES 
('English Beginners', 'Basic English learning class', NOW()),
('English Intermediate', 'Intermediate English learning class', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO lessons (title, description, category, difficulty, content, is_published, created_at) VALUES
('Basic Grammar', 'Introduction to English grammar', 'grammar', 'beginner', 'Learn the basics of English grammar', true, NOW()),
('Vocabulary Building', 'Essential English vocabulary', 'vocabulary', 'beginner', 'Build your English vocabulary', true, NOW()),
('Reading Comprehension', 'Improve your reading skills', 'reading', 'intermediate', 'Practice reading and understanding', true, NOW())
ON CONFLICT DO NOTHING;
</merged_code>
