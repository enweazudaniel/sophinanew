-- Script to link existing students and teachers to classes
-- This preserves all existing login credentials and data

-- First, let's create the classes table if it doesn't exist
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  grade_level VARCHAR(20),
  subject VARCHAR(50),
  teacher_id INTEGER,
  max_students INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_students junction table to handle many-to-many relationship
-- (students can be in multiple classes for different subjects)
CREATE TABLE IF NOT EXISTS class_students (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(class_id, student_id)
);

-- Add foreign key constraint for teacher_id in classes table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_classes_teacher_id'
  ) THEN
    ALTER TABLE classes ADD CONSTRAINT fk_classes_teacher_id 
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Insert sample classes based on your existing teachers
INSERT INTO classes (name, description, grade_level, subject, teacher_id) VALUES
('Mathematics Class A', 'Primary Mathematics for beginners', 'JSS 1', 'Mathematics', 1),
('English Language Class', 'English Language and Literature', 'JSS 1', 'English', 2),
('General Studies Class', 'Integrated General Studies', 'JSS 1', 'General Studies', 3),
('Mathematics Class B', 'Advanced Mathematics', 'JSS 2', 'Mathematics', 1),
('Science Class', 'Basic Science and Nature Studies', 'JSS 1', 'Science', 2)
ON CONFLICT DO NOTHING;

-- Function to assign students to classes
CREATE OR REPLACE FUNCTION assign_students_to_classes()
RETURNS void AS $$
DECLARE
  student_record RECORD;
  class_record RECORD;
  math_class_a_id INTEGER;
  english_class_id INTEGER;
  general_studies_id INTEGER;
  math_class_b_id INTEGER;
  science_class_id INTEGER;
BEGIN
  -- Get class IDs
  SELECT id INTO math_class_a_id FROM classes WHERE name = 'Mathematics Class A';
  SELECT id INTO english_class_id FROM classes WHERE name = 'English Language Class';
  SELECT id INTO general_studies_id FROM classes WHERE name = 'General Studies Class';
  SELECT id INTO math_class_b_id FROM classes WHERE name = 'Mathematics Class B';
  SELECT id INTO science_class_id FROM classes WHERE name = 'Science Class';

  -- Assign students to classes based on their IDs (you can modify this logic)
  -- Students 1-5 go to Mathematics Class A and English Class
  FOR student_record IN 
    SELECT id FROM students WHERE id BETWEEN 1 AND 5 AND id != 99
  LOOP
    INSERT INTO class_students (class_id, student_id) 
    VALUES (math_class_a_id, student_record.id)
    ON CONFLICT (class_id, student_id) DO NOTHING;
    
    INSERT INTO class_students (class_id, student_id) 
    VALUES (english_class_id, student_record.id)
    ON CONFLICT (class_id, student_id) DO NOTHING;
  END LOOP;

  -- Students 6-10 go to Mathematics Class B and General Studies
  FOR student_record IN 
    SELECT id FROM students WHERE id BETWEEN 6 AND 10
  LOOP
    INSERT INTO class_students (class_id, student_id) 
    VALUES (math_class_b_id, student_record.id)
    ON CONFLICT (class_id, student_id) DO NOTHING;
    
    INSERT INTO class_students (class_id, student_id) 
    VALUES (general_studies_id, student_record.id)
    ON CONFLICT (class_id, student_id) DO NOTHING;
  END LOOP;

  -- Students 11+ go to Science Class and English Class
  FOR student_record IN 
    SELECT id FROM students WHERE id >= 11 AND id != 99
  LOOP
    INSERT INTO class_students (class_id, student_id) 
    VALUES (science_class_id, student_record.id)
    ON CONFLICT (class_id, student_id) DO NOTHING;
    
    INSERT INTO class_students (class_id, student_id) 
    VALUES (english_class_id, student_record.id)
    ON CONFLICT (class_id, student_id) DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Students have been assigned to classes successfully!';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to assign students
SELECT assign_students_to_classes();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_students_class_id ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student_id ON class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);

-- Create a view to easily see student-class assignments
CREATE OR REPLACE VIEW student_class_assignments AS
SELECT 
  s.id as student_id,
  s.username as student_username,
  s.full_name as student_name,
  c.id as class_id,
  c.name as class_name,
  c.subject,
  c.grade_level,
  t.full_name as teacher_name,
  cs.enrolled_at,
  cs.is_active
FROM students s
JOIN class_students cs ON s.id = cs.student_id
JOIN classes c ON cs.class_id = c.id
LEFT JOIN teachers t ON c.teacher_id = t.id
WHERE cs.is_active = true
ORDER BY s.full_name, c.name;

-- Create a view to see teacher-class assignments
CREATE OR REPLACE VIEW teacher_class_assignments AS
SELECT 
  t.id as teacher_id,
  t.username as teacher_username,
  t.full_name as teacher_name,
  c.id as class_id,
  c.name as class_name,
  c.subject,
  c.grade_level,
  COUNT(cs.student_id) as student_count
FROM teachers t
JOIN classes c ON t.id = c.teacher_id
LEFT JOIN class_students cs ON c.id = cs.class_id AND cs.is_active = true
GROUP BY t.id, t.username, t.full_name, c.id, c.name, c.subject, c.grade_level
ORDER BY t.full_name, c.name;

-- Function to add a student to a class
CREATE OR REPLACE FUNCTION add_student_to_class(
  p_student_id INTEGER,
  p_class_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO class_students (class_id, student_id)
  VALUES (p_class_id, p_student_id)
  ON CONFLICT (class_id, student_id) DO UPDATE SET
    is_active = true,
    enrolled_at = NOW();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to remove a student from a class
CREATE OR REPLACE FUNCTION remove_student_from_class(
  p_student_id INTEGER,
  p_class_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE class_students 
  SET is_active = false
  WHERE class_id = p_class_id AND student_id = p_student_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get students in a class
CREATE OR REPLACE FUNCTION get_students_in_class(p_class_id INTEGER)
RETURNS TABLE(
  student_id INTEGER,
  username VARCHAR(50),
  full_name VARCHAR(100),
  enrolled_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.username,
    s.full_name,
    cs.enrolled_at
  FROM students s
  JOIN class_students cs ON s.id = cs.student_id
  WHERE cs.class_id = p_class_id AND cs.is_active = true
  ORDER BY s.full_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get classes for a student
CREATE OR REPLACE FUNCTION get_classes_for_student(p_student_id INTEGER)
RETURNS TABLE(
  class_id INTEGER,
  class_name VARCHAR(100),
  subject VARCHAR(50),
  teacher_name VARCHAR(100),
  enrolled_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.subject,
    t.full_name,
    cs.enrolled_at
  FROM classes c
  JOIN class_students cs ON c.id = cs.class_id
  LEFT JOIN teachers t ON c.teacher_id = t.id
  WHERE cs.student_id = p_student_id AND cs.is_active = true
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get classes for a teacher
CREATE OR REPLACE FUNCTION get_classes_for_teacher(p_teacher_id INTEGER)
RETURNS TABLE(
  class_id INTEGER,
  class_name VARCHAR(100),
  subject VARCHAR(50),
  student_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.subject,
    COUNT(cs.student_id)
  FROM classes c
  LEFT JOIN class_students cs ON c.id = cs.class_id AND cs.is_active = true
  WHERE c.teacher_id = p_teacher_id AND c.is_active = true
  GROUP BY c.id, c.name, c.subject
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data to demonstrate the relationships
-- This shows how the system works with your existing data

-- Display current assignments
SELECT 'Student-Class Assignments:' as info;
SELECT * FROM student_class_assignments LIMIT 10;

SELECT 'Teacher-Class Assignments:' as info;
SELECT * FROM teacher_class_assignments;

-- Show some example queries
SELECT 'Students in Mathematics Class A:' as info;
SELECT * FROM get_students_in_class(1);

SELECT 'Classes for student ID 1 (DEBORAH ONYINYE EZEBUIKE):' as info;
SELECT * FROM get_classes_for_student(1);

SELECT 'Classes taught by teacher ID 1 (Mr. Daniel Enweazu):' as info;
SELECT * FROM get_classes_for_teacher(1);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to classes table
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Summary of what was created
SELECT 'Summary of created objects:' as info;
SELECT 
  'Tables created: classes, class_students' as tables,
  'Views created: student_class_assignments, teacher_class_assignments' as views,
  'Functions created: assign_students_to_classes, add_student_to_class, remove_student_from_class, get_students_in_class, get_classes_for_student, get_classes_for_teacher' as functions;

COMMIT;
