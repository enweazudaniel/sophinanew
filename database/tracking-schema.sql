-- Create table for student metrics
CREATE TABLE IF NOT EXISTS student_metrics (
 id SERIAL PRIMARY KEY,
 student_id INTEGER NOT NULL REFERENCES students(id),
 overall_progress FLOAT DEFAULT 0,
 lessons_completed INTEGER DEFAULT 0,
 total_lessons INTEGER DEFAULT 0,
 time_spent INTEGER DEFAULT 0, -- in seconds
 last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 UNIQUE(student_id)
);

-- Create table for lesson completions
CREATE TABLE IF NOT EXISTS lesson_completions (
 id SERIAL PRIMARY KEY,
 student_id INTEGER NOT NULL REFERENCES students(id),
 lesson_id INTEGER NOT NULL,
 score FLOAT NOT NULL,
 completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 attempts INTEGER DEFAULT 1,
 UNIQUE(student_id, lesson_id)
);

-- Create table for student achievements
CREATE TABLE IF NOT EXISTS student_achievements (
 id SERIAL PRIMARY KEY,
 student_id INTEGER NOT NULL REFERENCES students(id),
 achievement_name VARCHAR(100) NOT NULL,
 achievement_description TEXT,
 earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 category VARCHAR(50),
 icon VARCHAR(50),
 UNIQUE(student_id, achievement_name)
);

-- Create table for lessons
CREATE TABLE IF NOT EXISTS lessons (
 id SERIAL PRIMARY KEY,
 title VARCHAR(100) NOT NULL,
 description TEXT,
 category VARCHAR(50) NOT NULL,
 difficulty VARCHAR(20) DEFAULT 'Beginner',
 estimated_duration INTEGER DEFAULT 15, -- in minutes
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample lessons
INSERT INTO lessons (title, category, difficulty, estimated_duration)
VALUES 
 ('Basic Grammar', 'grammar', 'Beginner', 15),
 ('Verb Tenses', 'grammar', 'Intermediate', 20),
 ('Articles & Prepositions', 'grammar', 'Intermediate', 15),
 ('Vocabulary Builder', 'vocabulary', 'Beginner', 10),
 ('Synonyms & Antonyms', 'vocabulary', 'Intermediate', 15),
 ('Reading Comprehension', 'reading', 'Intermediate', 20),
 ('Short Stories', 'reading', 'Beginner', 15),
 ('Listening Practice', 'listening', 'Intermediate', 15),
 ('Conversations', 'listening', 'Beginner', 10),
 ('Essay Writing', 'writing', 'Advanced', 30),
 ('Summary Writing', 'writing', 'Intermediate', 20),
 ('Speaking Practice', 'speaking', 'Beginner', 15),
 ('Pronunciation Drills', 'speaking', 'Intermediate', 15),
 ('Tongue Twisters', 'speaking', 'Beginner', 10),
 ('Conversation Practice', 'speaking', 'Intermediate', 20);
