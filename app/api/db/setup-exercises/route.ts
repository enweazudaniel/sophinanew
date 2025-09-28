import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST() {
  try {
    // Read and execute the exercises schema
    const exercisesSchema = `
-- Create exercises table if it doesn't exist
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR(100) DEFAULT 'general',
  difficulty VARCHAR(50) DEFAULT 'beginner',
  estimated_time INTEGER DEFAULT 30,
  is_available BOOLEAN DEFAULT false,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert reading comprehension exercise if it doesn't exist
INSERT INTO lessons (title, description, content, category, difficulty, estimated_time, is_available, slug)
VALUES (
  'Reading Comprehension',
  'Practice understanding written texts through questions and analysis',
  '{"title":"The Impact of Technology on Education","content":"Technology has transformed education in numerous ways over the past few decades. From the introduction of computers in classrooms to the widespread use of online learning platforms, the educational landscape has changed dramatically.\\n\\nOne of the most significant impacts of technology on education is increased accessibility. Online courses and digital resources have made education available to people who might otherwise have limited access due to geographical, financial, or physical constraints. Students in remote areas can now access quality educational content, and individuals with busy schedules can pursue learning at their own pace.\\n\\nFurthermore, technology has enabled personalized learning experiences. Adaptive learning software can assess a student''s strengths and weaknesses and tailor content accordingly. This individualized approach helps students learn more effectively by focusing on areas where they need improvement while moving quickly through material they already understand.\\n\\nCollaboration has also been enhanced through technology. Students can work together on projects regardless of their physical location, sharing ideas and resources through various digital platforms. This prepares them for the collaborative nature of many modern workplaces.\\n\\nHowever, the integration of technology in education is not without challenges. The digital divide—the gap between those who have access to technology and those who don''t—can exacerbate educational inequalities. Additionally, some critics argue that excessive screen time can negatively impact students'' attention spans and social skills.\\n\\nDespite these concerns, the trend toward technology-enhanced education continues to grow. As new technologies emerge, educators and institutions must thoughtfully consider how to leverage these tools to improve learning outcomes while addressing potential drawbacks.","questions":[{"id":1,"question":"According to the passage, what is one of the most significant impacts of technology on education?","options":[{"id":"a","text":"Reduced cost of education"},{"id":"b","text":"Increased accessibility"},{"id":"c","text":"Improved teacher training"},{"id":"d","text":"Shorter school days"}],"correctAnswer":"b","explanation":"The passage states that ''One of the most significant impacts of technology on education is increased accessibility.''"},{"id":2,"question":"How does technology enable personalized learning according to the passage?","options":[{"id":"a","text":"By allowing students to choose their own teachers"},{"id":"b","text":"By eliminating the need for textbooks"},{"id":"c","text":"By using adaptive software that tailors content to individual needs"},{"id":"d","text":"By reducing class sizes"}],"correctAnswer":"c","explanation":"The passage explains that ''Adaptive learning software can assess a student''s strengths and weaknesses and tailor content accordingly.''"},{"id":3,"question":"What challenge related to technology in education is mentioned in the passage?","options":[{"id":"a","text":"The digital divide"},{"id":"b","text":"High cost of maintenance"},{"id":"c","text":"Lack of qualified teachers"},{"id":"d","text":"Rapid obsolescence of equipment"}],"correctAnswer":"a","explanation":"The passage mentions ''the digital divide—the gap between those who have access to technology and those who don''t—can exacerbate educational inequalities.''"},{"id":4,"question":"According to the passage, how has technology affected collaboration among students?","options":[{"id":"a","text":"It has made collaboration unnecessary"},{"id":"b","text":"It has limited collaboration to local students only"},{"id":"c","text":"It has enhanced collaboration regardless of physical location"},{"id":"d","text":"It has made collaboration more difficult"}],"correctAnswer":"c","explanation":"The passage states that ''Collaboration has also been enhanced through technology. Students can work together on projects regardless of their physical location.''"},{"id":5,"question":"What is the author''s overall stance on technology in education?","options":[{"id":"a","text":"Strongly against it"},{"id":"b","text":"Neutral but cautious"},{"id":"c","text":"Enthusiastic without reservations"},{"id":"d","text":"Recognizing benefits while acknowledging challenges"}],"correctAnswer":"d","explanation":"The author acknowledges both the benefits (accessibility, personalized learning, collaboration) and challenges (digital divide, concerns about screen time) of technology in education, suggesting a balanced view."}]}',
  'reading',
  'intermediate',
  30,
  true,
  'reading-comprehension'
) ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  is_available = EXCLUDED.is_available;

-- Insert other exercises
INSERT INTO lessons (title, description, category, difficulty, estimated_time, is_available, slug)
VALUES 
  ('Basic Grammar', 'Learn fundamental grammar rules including sentence structure and basic parts of speech', 'grammar', 'beginner', 15, true, 'grammar-basic'),
  ('Verb Tenses', 'Master past, present, and future tenses with practical examples', 'grammar', 'beginner', 20, true, 'verb-tenses'),
  ('Articles and Prepositions', 'Learn when to use a, an, the, and common prepositions', 'grammar', 'intermediate', 25, true, 'articles-prepositions'),
  ('Basic Vocabulary', 'Essential everyday vocabulary for beginners', 'vocabulary', 'beginner', 15, true, 'vocabulary-basic'),
  ('Vocabulary Builder', 'Expand your vocabulary with intermediate level words', 'vocabulary', 'intermediate', 20, true, 'vocabulary-builder'),
  ('Listening Practice', 'Enhance listening skills with audio exercises', 'listening', 'intermediate', 25, true, 'listening-practice'),
  ('Speaking Practice', 'Practice pronunciation and speaking skills', 'speaking', 'intermediate', 20, true, 'speaking-practice'),
  ('Essay Writing', 'Learn to write structured essays and compositions', 'writing', 'advanced', 45, false, 'essay-writing')
ON CONFLICT (slug) DO NOTHING;
    `

    const { error } = await supabase.rpc("exec_sql", { sql_query: exercisesSchema })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to setup exercises" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Exercises schema and data setup completed successfully",
    })
  } catch (error) {
    console.error("Error setting up exercises:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
