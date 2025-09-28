-- Add missing columns to lessons table
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES teachers(id),
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS content TEXT;

-- Update existing lessons to have a default creator (first teacher)
UPDATE lessons 
SET created_by = (SELECT id FROM teachers LIMIT 1)
WHERE created_by IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_lessons_created_by ON lessons(created_by);
