-- Fix assignments table schema
DO $$
BEGIN
    -- Add missing columns to assignments table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'max_file_size') THEN
        ALTER TABLE assignments ADD COLUMN max_file_size INTEGER DEFAULT 10485760; -- 10MB default
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'allowed_file_types') THEN
        ALTER TABLE assignments ADD COLUMN allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'assignment_type') THEN
        ALTER TABLE assignments ADD COLUMN assignment_type VARCHAR(50) DEFAULT 'text';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'instructions') THEN
        ALTER TABLE assignments ADD COLUMN instructions TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'rubric') THEN
        ALTER TABLE assignments ADD COLUMN rubric JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'resources') THEN
        ALTER TABLE assignments ADD COLUMN resources JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = 'created_by') THEN
        ALTER TABLE assignments ADD COLUMN created_by INTEGER REFERENCES users(id);
    END IF;
    
    -- Update existing assignments with default values
    UPDATE assignments SET 
        max_file_size = 10485760,
        allowed_file_types = ARRAY['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'],
        assignment_type = 'text'
    WHERE max_file_size IS NULL OR allowed_file_types IS NULL OR assignment_type IS NULL;
    
    RAISE NOTICE 'Assignments table updated successfully';
END $$;

-- Fix submissions table schema
DO $$
BEGIN
    -- Add missing columns to submissions table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'submission_type') THEN
        ALTER TABLE submissions ADD COLUMN submission_type VARCHAR(50) DEFAULT 'text';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'files') THEN
        ALTER TABLE submissions ADD COLUMN files JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'auto_score') THEN
        ALTER TABLE submissions ADD COLUMN auto_score INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'manual_score') THEN
        ALTER TABLE submissions ADD COLUMN manual_score INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'rubric_scores') THEN
        ALTER TABLE submissions ADD COLUMN rubric_scores JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'graded_at') THEN
        ALTER TABLE submissions ADD COLUMN graded_at TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'updated_at') THEN
        ALTER TABLE submissions ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Update existing submissions with default values
    UPDATE submissions SET 
        submission_type = 'text'
    WHERE submission_type IS NULL;
    
    RAISE NOTICE 'Submissions table updated successfully';
END $$;

-- Create assignment_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS assignment_files (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, file_name)
);

-- Create submission_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS submission_files (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id, file_name)
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assignment_files_assignment_id ON assignment_files(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id ON submission_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_student ON submissions(assignment_id, student_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to submissions table
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data if tables are empty
DO $$
BEGIN
    -- Check if we need to add sample assignments
    IF NOT EXISTS (SELECT 1 FROM assignments LIMIT 1) THEN
        INSERT INTO assignments (title, description, instructions, assignment_type, due_date, max_file_size, allowed_file_types, created_by)
        VALUES 
            ('Math Homework 1', 'Complete exercises 1-10 from chapter 3', 'Show all your work and explain your reasoning', 'text', CURRENT_DATE + INTERVAL '7 days', 5242880, ARRAY['pdf', 'doc', 'docx'], 1),
            ('Science Project', 'Research and write about renewable energy', 'Include at least 3 sources and create a presentation', 'mixed', CURRENT_DATE + INTERVAL '14 days', 20971520, ARRAY['pdf', 'ppt', 'pptx', 'doc', 'docx'], 1),
            ('Essay Assignment', 'Write a 500-word essay on your favorite book', 'Use proper grammar and cite your sources', 'file', CURRENT_DATE + INTERVAL '10 days', 10485760, ARRAY['pdf', 'doc', 'docx'], 1);
        
        RAISE NOTICE 'Sample assignments created';
    END IF;
END $$;

RAISE NOTICE 'Assignment schema fix completed successfully!';
