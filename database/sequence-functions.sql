-- Create functions to fix the sequence issues

-- Function to fix lessons sequence
CREATE OR REPLACE FUNCTION fix_lessons_sequence()
RETURNS void AS $$
BEGIN
  PERFORM setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 0) + 1, false);
END;
$$ LANGUAGE plpgsql;

-- Function to reset lessons sequence to a specific value
CREATE OR REPLACE FUNCTION reset_lessons_sequence(next_val integer)
RETURNS void AS $$
BEGIN
  PERFORM setval('lessons_id_seq', next_val, false);
END;
$$ LANGUAGE plpgsql;
