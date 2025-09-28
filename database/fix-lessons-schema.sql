-- Add missing columns to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Update existing lessons to have proper values
UPDATE lessons SET 
  is_published = TRUE,
  created_at = COALESCE(created_at, NOW()),
  updated_at = NOW()
WHERE is_published IS NULL OR created_at IS NULL;

-- Ensure all lessons have proper structure
INSERT INTO lessons (id, title, description, category, difficulty, estimated_duration, is_published, created_at, updated_at) VALUES
(1, 'Basic Grammar', 'Learn fundamental grammar rules', 'grammar', 'beginner', 15, TRUE, NOW(), NOW()),
(2, 'Verb Tenses', 'Master past, present, and future tenses', 'grammar', 'beginner', 20, TRUE, NOW(), NOW()),
(3, 'Articles and Prepositions', 'Learn when to use a, an, the, and prepositions', 'grammar', 'intermediate', 25, TRUE, NOW(), NOW()),
(4, 'Basic Vocabulary', 'Essential everyday vocabulary', 'vocabulary', 'beginner', 15, TRUE, NOW(), NOW()),
(5, 'Vocabulary Builder', 'Expand your vocabulary with advanced words', 'vocabulary', 'intermediate', 20, TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  estimated_duration = EXCLUDED.estimated_duration,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();
