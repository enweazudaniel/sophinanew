-- Clean database schema for SophinaLearn
-- This script creates all necessary tables with proper relationships

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS lesson_completions CASCADE;
DROP TABLE IF EXISTS student_metrics CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignment_classes CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (base table for all user types)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teachers table (extends users)
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table (extends users)
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    grade_level VARCHAR(20),
    parent_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assignments table
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    due_date TIMESTAMP,
    max_score INTEGER DEFAULT 100,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assignment_classes junction table
CREATE TABLE assignment_classes (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, class_id)
);

-- Create submissions table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    content TEXT,
    score INTEGER,
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
    submitted_at TIMESTAMP,
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- Create lesson_completions table
CREATE TABLE lesson_completions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    lesson_type VARCHAR(50) NOT NULL,
    score INTEGER,
    time_spent INTEGER, -- in seconds
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, lesson_id)
);

-- Create student_metrics table
CREATE TABLE student_metrics (
    id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 50,
    overall_progress DECIMAL(5,2) DEFAULT 0.00,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    time_spent INTEGER DEFAULT 0, -- in seconds
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create achievements table
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_assignments_created_by ON assignments(created_by);
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_lesson_completions_student_id ON lesson_completions(student_id);
CREATE INDEX idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX idx_achievements_student_id ON achievements(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_metrics_updated_at BEFORE UPDATE ON student_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample admin user
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@sophina.edu', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'System Administrator', 'admin');

-- Sample teachers
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('teacher1', 'teacher1@sophina.edu', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Sarah Johnson', 'teacher'),
('teacher2', 'teacher2@sophina.edu', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Michael Brown', 'teacher');

-- Sample students
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('student1', 'student1@sophina.edu', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Alice Smith', 'student'),
('student2', 'student2@sophina.edu', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Bob Wilson', 'student'),
('student3', 'student3@sophina.edu', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Charlie Davis', 'student');

-- Create teacher records
INSERT INTO teachers (user_id, subject, bio) VALUES
((SELECT id FROM users WHERE username = 'teacher1'), 'English Language Arts', 'Experienced English teacher with 10 years of experience.'),
((SELECT id FROM users WHERE username = 'teacher2'), 'English Literature', 'Passionate about helping students improve their English skills.');

-- Create classes
INSERT INTO classes (name, description, teacher_id) VALUES
('English 101', 'Basic English for beginners', (SELECT id FROM users WHERE username = 'teacher1')),
('English 201', 'Intermediate English', (SELECT id FROM users WHERE username = 'teacher2'));

-- Create student records
INSERT INTO students (user_id, class_id, grade_level, parent_email) VALUES
((SELECT id FROM users WHERE username = 'student1'), 1, '9th Grade', 'parent1@example.com'),
((SELECT id FROM users WHERE username = 'student2'), 1, '9th Grade', 'parent2@example.com'),
((SELECT id FROM users WHERE username = 'student3'), 2, '10th Grade', 'parent3@example.com');

-- Create sample assignments
INSERT INTO assignments (title, description, content, due_date, max_score, created_by) VALUES
('Grammar Basics', 'Complete the grammar exercises', 'Practice identifying parts of speech and sentence structure.', CURRENT_TIMESTAMP + INTERVAL '7 days', 100, (SELECT id FROM users WHERE username = 'teacher1')),
('Reading Comprehension', 'Read the passage and answer questions', 'Read the provided text and demonstrate understanding through questions.', CURRENT_TIMESTAMP + INTERVAL '5 days', 100, (SELECT id FROM users WHERE username = 'teacher1')),
('Essay Writing', 'Write a 500-word essay', 'Write an essay on the topic of your choice following proper structure.', CURRENT_TIMESTAMP + INTERVAL '10 days', 100, (SELECT id FROM users WHERE username = 'teacher2'));

-- Assign assignments to classes
INSERT INTO assignment_classes (assignment_id, class_id) VALUES
(1, 1), -- Grammar Basics to English 101
(2, 1), -- Reading Comprehension to English 101
(3, 2); -- Essay Writing to English 201

-- Create sample lesson completions
INSERT INTO lesson_completions (student_id, lesson_id, lesson_type, score, time_spent) VALUES
(1, 'grammar-basic-1', 'grammar', 85, 1200),
(1, 'vocabulary-basic-1', 'vocabulary', 92, 900),
(2, 'grammar-basic-1', 'grammar', 78, 1500),
(3, 'grammar-basic-1', 'grammar', 95, 1000);

-- Create sample student metrics
INSERT INTO student_metrics (student_id, lessons_completed, overall_progress, average_score, time_spent, streak_days) VALUES
(1, 2, 4.00, 88.50, 2100, 3),
(2, 1, 2.00, 78.00, 1500, 1),
(3, 1, 2.00, 95.00, 1000, 2);

-- Create sample achievements
INSERT INTO achievements (student_id, achievement_type, title, description, icon) VALUES
(1, 'first_lesson', 'First Lesson Complete', 'Completed your first lesson', 'trophy'),
(1, 'high_score', 'High Achiever', 'Scored 90% or higher on a lesson', 'star'),
(3, 'perfect_score', 'Perfect Score', 'Achieved 100% on a lesson', 'crown');

-- Create sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE username = 'student1'), 'New Assignment', 'You have a new assignment: Grammar Basics', 'assignment'),
((SELECT id FROM users WHERE username = 'student2'), 'Achievement Unlocked', 'You earned the "First Lesson Complete" achievement!', 'achievement'),
((SELECT id FROM users WHERE username = 'teacher1'), 'Student Progress', 'Alice Smith completed a new lesson', 'progress');

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Display summary
SELECT 'Database schema created successfully!' as status;
SELECT 'Users created: ' || COUNT(*) as user_count FROM users;
SELECT 'Classes created: ' || COUNT(*) as class_count FROM classes;
SELECT 'Students created: ' || COUNT(*) as student_count FROM students;
SELECT 'Teachers created: ' || COUNT(*) as teacher_count FROM teachers;
SELECT 'Assignments created: ' || COUNT(*) as assignment_count FROM assignments;
