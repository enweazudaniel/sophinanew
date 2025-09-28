-- Function to get student dashboard stats
CREATE OR REPLACE FUNCTION get_student_dashboard_stats(student_id INTEGER)
RETURNS TABLE (
  total_assignments INTEGER,
  completed_assignments INTEGER,
  average_score DECIMAL(5,2),
  total_time_spent INTEGER,
  completion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(COUNT(s.id), 0)::INTEGER as total_assignments,
    COALESCE(COUNT(s.id) FILTER (WHERE s.submitted_at IS NOT NULL), 0)::INTEGER as completed_assignments,
    COALESCE(AVG(s.score), 0.0)::DECIMAL(5,2) as average_score,
    COALESCE(SUM(EXTRACT(EPOCH FROM (s.submitted_at - s.created_at))), 0)::INTEGER as total_time_spent,
    CASE 
      WHEN COUNT(s.id) > 0 THEN 
        (COUNT(s.id) FILTER (WHERE s.submitted_at IS NOT NULL)::DECIMAL / COUNT(s.id) * 100)
      ELSE 0.0 
    END::DECIMAL(5,2) as completion_rate
  FROM submissions s
  WHERE s.student_id = get_student_dashboard_stats.student_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get teacher class metrics
CREATE OR REPLACE FUNCTION get_teacher_class_metrics(teacher_id INTEGER)
RETURNS TABLE (
  class_id INTEGER,
  class_name VARCHAR(255),
  total_students INTEGER,
  active_students INTEGER,
  average_completion_rate DECIMAL(5,2),
  average_score DECIMAL(5,2),
  total_assignments INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as class_id,
    c.name as class_name,
    COALESCE(COUNT(DISTINCT st.id), 0)::INTEGER as total_students,
    COALESCE(COUNT(DISTINCT CASE WHEN sub.submitted_at > NOW() - INTERVAL '30 days' THEN st.id END), 0)::INTEGER as active_students,
    COALESCE(AVG(
      CASE 
        WHEN COUNT(sub.id) > 0 THEN 
          (COUNT(sub.id) FILTER (WHERE sub.submitted_at IS NOT NULL)::DECIMAL / COUNT(sub.id) * 100)
        ELSE 0.0 
      END
    ), 0.0)::DECIMAL(5,2) as average_completion_rate,
    COALESCE(AVG(sub.score), 0.0)::DECIMAL(5,2) as average_score,
    COALESCE(COUNT(DISTINCT a.id), 0)::INTEGER as total_assignments
  FROM classes c
  LEFT JOIN class_teachers ct ON c.id = ct.class_id
  LEFT JOIN students st ON c.id = st.class_id
  LEFT JOIN assignments a ON c.id = a.class_id
  LEFT JOIN submissions sub ON a.id = sub.assignment_id AND st.id = sub.student_id
  WHERE ct.teacher_id = get_teacher_class_metrics.teacher_id
  GROUP BY c.id, c.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get teacher student metrics
CREATE OR REPLACE FUNCTION get_teacher_student_metrics(teacher_id INTEGER)
RETURNS TABLE (
  student_id INTEGER,
  student_name VARCHAR(255),
  class_name VARCHAR(255),
  total_assignments INTEGER,
  completed_assignments INTEGER,
  average_score DECIMAL(5,2),
  total_time_spent INTEGER,
  last_activity TIMESTAMP,
  completion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.id as student_id,
    st.username as student_name,
    c.name as class_name,
    COALESCE(COUNT(sub.id), 0)::INTEGER as total_assignments,
    COALESCE(COUNT(sub.id) FILTER (WHERE sub.submitted_at IS NOT NULL), 0)::INTEGER as completed_assignments,
    COALESCE(AVG(sub.score), 0.0)::DECIMAL(5,2) as average_score,
    COALESCE(SUM(EXTRACT(EPOCH FROM (sub.submitted_at - sub.created_at))), 0)::INTEGER as total_time_spent,
    MAX(sub.submitted_at) as last_activity,
    CASE 
      WHEN COUNT(sub.id) > 0 THEN 
        (COUNT(sub.id) FILTER (WHERE sub.submitted_at IS NOT NULL)::DECIMAL / COUNT(sub.id) * 100)
      ELSE 0.0 
    END::DECIMAL(5,2) as completion_rate
  FROM students st
  JOIN classes c ON st.class_id = c.id
  JOIN class_teachers ct ON c.id = ct.class_id
  LEFT JOIN assignments a ON c.id = a.class_id
  LEFT JOIN submissions sub ON a.id = sub.assignment_id AND st.id = sub.student_id
  WHERE ct.teacher_id = get_teacher_student_metrics.teacher_id
  GROUP BY st.id, st.username, c.name
  ORDER BY average_score DESC;
END;
$$ LANGUAGE plpgsql;
