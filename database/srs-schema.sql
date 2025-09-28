-- SRS Items Table
CREATE TABLE IF NOT EXISTS srs_items (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'vocabulary' or 'grammar'
  content_id INTEGER NOT NULL, -- reference to the specific word or grammar rule
  front_content TEXT NOT NULL, -- what's shown on the front of the card (e.g., word or grammar rule)
  back_content TEXT NOT NULL, -- what's shown on the back (e.g., definition or example)
  example TEXT, -- example usage
  image_url TEXT, -- optional image URL
  audio_url TEXT, -- optional audio URL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SRS Review History Table
CREATE TABLE IF NOT EXISTS srs_review_history (
  id SERIAL PRIMARY KEY,
  srs_item_id INTEGER REFERENCES srs_items(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  review_date TIMESTAMPTZ DEFAULT NOW(),
  ease_factor FLOAT NOT NULL DEFAULT 2.5, -- SM-2 algorithm parameter
  interval INTEGER NOT NULL DEFAULT 0, -- days until next review
  repetition INTEGER NOT NULL DEFAULT 0, -- number of successful reviews
  next_review_date TIMESTAMPTZ NOT NULL, -- when this item should be reviewed next
  response_quality INTEGER NOT NULL, -- 0-5 rating of how well the student remembered
  time_taken INTEGER -- time taken to answer in milliseconds
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_srs_next_review ON srs_review_history(student_id, next_review_date);

-- Create a view for due items
CREATE OR REPLACE VIEW srs_due_items AS
SELECT 
  i.id AS item_id,
  i.student_id,
  i.content_type,
  i.content_id,
  i.front_content,
  i.back_content,
  i.example,
  i.image_url,
  i.audio_url,
  h.next_review_date,
  h.ease_factor,
  h.interval,
  h.repetition
FROM srs_items i
JOIN (
  SELECT DISTINCT ON (srs_item_id) 
    srs_item_id, 
    next_review_date, 
    ease_factor, 
    interval, 
    repetition
  FROM srs_review_history
  ORDER BY srs_item_id, review_date DESC
) h ON i.id = h.srs_item_id
WHERE h.next_review_date <= NOW();
