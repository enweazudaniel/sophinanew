-- Fix the lessons table sequence issue
-- This resets the sequence to the correct value

-- Get the current maximum ID and reset the sequence
SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 0) + 1, false);

-- Alternative approach if the above doesn't work:
-- DROP SEQUENCE IF EXISTS lessons_id_seq CASCADE;
-- CREATE SEQUENCE lessons_id_seq START 1;
-- ALTER TABLE lessons ALTER COLUMN id SET DEFAULT nextval('lessons_id_seq');
-- SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 0) + 1, false);
