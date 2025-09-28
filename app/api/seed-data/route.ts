import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Starting data seeding...")

    // 1. Create sample teachers
    const { data: teachers, error: teachersError } = await supabase
      .from("teachers")
      .upsert([
        {
          id: 1,
          username: "teacher1",
          password: "password123",
          full_name: "Ms. Sarah Johnson",
          email: "sarah.johnson@school.edu",
        },
        {
          id: 2,
          username: "teacher2",
          password: "password123",
          full_name: "Mr. David Smith",
          email: "david.smith@school.edu",
        },
        {
          id: 3,
          username: "teacher3",
          password: "password123",
          full_name: "Mrs. Emily Brown",
          email: "emily.brown@school.edu",
        },
      ])
      .select()

    if (teachersError) {
      console.error("Teachers error:", teachersError)
    } else {
      console.log("Teachers created:", teachers?.length)
    }

    // 2. Create sample classes
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .upsert([
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Basic English 7A",
          description: "Beginner English class for 7th graders",
          teacher_id: 1,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Intermediate English 8B",
          description: "Intermediate English class for 8th graders",
          teacher_id: 1,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Advanced English 9C",
          description: "Advanced English class for 9th graders",
          teacher_id: 2,
        },
      ])
      .select()

    if (classesError) {
      console.error("Classes error:", classesError)
    } else {
      console.log("Classes created:", classes?.length)
    }

    // 3. Create sample students
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .upsert([
        {
          id: 1,
          username: "student1",
          password: "password123",
          full_name: "Alex Thompson",
          avatar_url: "/avatars/young-boy-1.png",
          class_id: "550e8400-e29b-41d4-a716-446655440001",
        },
        {
          id: 2,
          username: "student2",
          password: "password123",
          full_name: "Emma Wilson",
          avatar_url: "/avatars/young-girl-1.png",
          class_id: "550e8400-e29b-41d4-a716-446655440001",
        },
        {
          id: 3,
          username: "student3",
          password: "password123",
          full_name: "Michael Davis",
          avatar_url: "/avatars/young-boy-2.png",
          class_id: "550e8400-e29b-41d4-a716-446655440001",
        },
        {
          id: 4,
          username: "student4",
          password: "password123",
          full_name: "Sophia Garcia",
          avatar_url: "/avatars/young-girl-2.png",
          class_id: "550e8400-e29b-41d4-a716-446655440001",
        },
        {
          id: 5,
          username: "student5",
          password: "password123",
          full_name: "James Rodriguez",
          avatar_url: "/avatars/young-boy-3.png",
          class_id: "550e8400-e29b-41d4-a716-446655440002",
        },
        {
          id: 6,
          username: "student6",
          password: "password123",
          full_name: "Isabella Martinez",
          avatar_url: "/avatars/young-girl-3.png",
          class_id: "550e8400-e29b-41d4-a716-446655440002",
        },
        {
          id: 7,
          username: "student7",
          password: "password123",
          full_name: "William Anderson",
          avatar_url: "/avatars/young-boy-4.png",
          class_id: "550e8400-e29b-41d4-a716-446655440003",
        },
      ])
      .select()

    if (studentsError) {
      console.error("Students error:", studentsError)
    } else {
      console.log("Students created:", students?.length)
    }

    // 4. Ensure lessons exist
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .upsert([
        {
          id: 1,
          title: "Basic Grammar",
          description: "Learn fundamental grammar rules",
          category: "Grammar",
          difficulty: "Beginner",
          estimated_duration: 15,
        },
        {
          id: 2,
          title: "Verb Tenses",
          description: "Master past, present, and future tenses",
          category: "Grammar",
          difficulty: "Beginner",
          estimated_duration: 20,
        },
        {
          id: 3,
          title: "Articles and Prepositions",
          description: "Learn when to use a, an, the, and prepositions",
          category: "Grammar",
          difficulty: "Intermediate",
          estimated_duration: 25,
        },
        {
          id: 4,
          title: "Basic Vocabulary",
          description: "Essential everyday vocabulary",
          category: "Vocabulary",
          difficulty: "Beginner",
          estimated_duration: 15,
        },
        {
          id: 5,
          title: "Vocabulary Builder",
          description: "Expand your vocabulary with advanced words",
          category: "Vocabulary",
          difficulty: "Intermediate",
          estimated_duration: 20,
        },
        {
          id: 6,
          title: "Listening Practice",
          description: "Improve listening comprehension",
          category: "Listening",
          difficulty: "Beginner",
          estimated_duration: 15,
        },
        {
          id: 7,
          title: "Listening Conversations",
          description: "Practice with real conversations",
          category: "Listening",
          difficulty: "Intermediate",
          estimated_duration: 20,
        },
        {
          id: 8,
          title: "Speaking Practice",
          description: "Basic speaking exercises",
          category: "Speaking",
          difficulty: "Beginner",
          estimated_duration: 15,
        },
        {
          id: 9,
          title: "Reading Comprehension",
          description: "Improve reading skills",
          category: "Reading",
          difficulty: "Beginner",
          estimated_duration: 20,
        },
        {
          id: 10,
          title: "Essay Writing",
          description: "Learn to write effective essays",
          category: "Writing",
          difficulty: "Intermediate",
          estimated_duration: 45,
        },
      ])
      .select()

    if (lessonsError) {
      console.error("Lessons error:", lessonsError)
    } else {
      console.log("Lessons created:", lessons?.length)
    }

    // 5. Create sample assignments for Basic 7A class
    const { data: assignments, error: assignmentsError } = await supabase
      .from("assignments")
      .upsert([
        {
          id: 1,
          title: "Grammar Basics Essay",
          description:
            "Write a 200-word essay demonstrating your understanding of basic grammar rules. Include examples of different verb tenses and proper use of articles.",
          assignment_type: "essay",
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          created_by: 1,
        },
        {
          id: 2,
          title: "Vocabulary Practice",
          description:
            "Complete the vocabulary exercises from Chapter 3. Define 20 new words and use each in a sentence.",
          assignment_type: "vocabulary",
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          created_by: 1,
        },
        {
          id: 3,
          title: "Reading Comprehension Test",
          description: "Read the short story 'The Gift of the Magi' and answer the comprehension questions.",
          assignment_type: "reading",
          due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          created_by: 1,
        },
        {
          id: 4,
          title: "Speaking Presentation",
          description:
            "Prepare a 3-minute presentation about your favorite hobby. Focus on clear pronunciation and proper grammar.",
          assignment_type: "speaking",
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          created_by: 1,
        },
      ])
      .select()

    if (assignmentsError) {
      console.error("Assignments error:", assignmentsError)
    } else {
      console.log("Assignments created:", assignments?.length)
    }

    // 6. Create sample lesson completions
    const { data: completions, error: completionsError } = await supabase
      .from("lesson_completions")
      .upsert([
        // Student 1 completions
        {
          id: 1,
          student_id: 1,
          lesson_id: 1,
          score: 85,
          completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          student_id: 1,
          lesson_id: 4,
          score: 92,
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },

        // Student 2 completions
        {
          id: 3,
          student_id: 2,
          lesson_id: 1,
          score: 78,
          completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          student_id: 2,
          lesson_id: 2,
          score: 88,
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { id: 5, student_id: 2, lesson_id: 4, score: 95, completed_at: new Date().toISOString() },

        // Student 3 completions
        {
          id: 6,
          student_id: 3,
          lesson_id: 1,
          score: 72,
          completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },

        // Student 4 completions
        {
          id: 7,
          student_id: 4,
          lesson_id: 1,
          score: 90,
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { id: 8, student_id: 4, lesson_id: 2, score: 87, completed_at: new Date().toISOString() },
      ])
      .select()

    if (completionsError) {
      console.error("Completions error:", completionsError)
    } else {
      console.log("Lesson completions created:", completions?.length)
    }

    // 7. Create sample submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .upsert([
        {
          id: 1,
          assignment_id: 1,
          student_id: 1,
          content:
            "Grammar is the foundation of effective communication. In this essay, I will demonstrate my understanding of basic grammar rules through examples and explanations.\n\nFirst, let's discuss verb tenses. The past tense is used to describe actions that happened before now, like 'I walked to school yesterday.' The present tense describes current actions: 'I walk to school every day.' The future tense indicates actions that will happen: 'I will walk to school tomorrow.'\n\nArticles are also important. We use 'a' before consonant sounds ('a book'), 'an' before vowel sounds ('an apple'), and 'the' for specific items ('the book on my desk').\n\nProper grammar helps us communicate clearly and professionally. By mastering these basics, we can express our ideas more effectively.",
          status: "graded",
          score: 88,
          feedback:
            "Excellent work! You demonstrated a clear understanding of verb tenses and articles. Your examples were well-chosen and your writing was clear. To improve further, try varying your sentence structure more.",
          submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          graded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          graded_by: 1,
        },
        {
          id: 2,
          assignment_id: 2,
          student_id: 2,
          content:
            "Vocabulary Assignment - Chapter 3\n\n1. Abundant - plentiful; existing in large quantities\nSentence: The garden had an abundant harvest this year.\n\n2. Benevolent - well-meaning and kindly\nSentence: The benevolent teacher always helped struggling students.\n\n3. Cautious - careful to avoid potential problems\nSentence: She was cautious when crossing the busy street.\n\n4. Diligent - having or showing care in one's work\nSentence: The diligent student completed all assignments on time.\n\n5. Eloquent - fluent and persuasive in speaking\nSentence: The eloquent speaker captivated the audience.\n\n[continues with 15 more vocabulary words...]",
          status: "submitted",
          submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          assignment_id: 1,
          student_id: 3,
          content:
            "Grammar is important for writing. I learned about verbs and how they change. Past tense verbs end in -ed usually. Present tense verbs are normal. Future tense uses will.\n\nArticles are a, an, and the. You use a before consonants and an before vowels. The is for specific things.\n\nI think grammar helps people understand what you mean. It makes writing better and more clear.",
          status: "graded",
          score: 72,
          feedback:
            "Good start! You understand the basic concepts. To improve your grade, try to expand your explanations with more examples and write longer, more detailed sentences. Also, work on paragraph structure.",
          submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          graded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          graded_by: 1,
        },
        {
          id: 4,
          assignment_id: 2,
          student_id: 4,
          content:
            "Chapter 3 Vocabulary Assignment\n\n1. Abundant - having plenty of something\nExample: The library has an abundant collection of books.\n\n2. Benevolent - kind and generous\nExample: The benevolent donor gave money to the school.\n\n3. Cautious - being careful\nExample: I am cautious when riding my bike in traffic.\n\n[Assignment continues with detailed definitions and creative sentences for all 20 words]",
          status: "submitted",
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()

    if (submissionsError) {
      console.error("Submissions error:", submissionsError)
    } else {
      console.log("Submissions created:", submissions?.length)
    }

    // 8. Create student metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("student_metrics")
      .upsert([
        {
          student_id: 1,
          overall_progress: 20.0,
          lessons_completed: 2,
          total_lessons: 10,
          time_spent: 45,
          last_active: new Date().toISOString(),
        },
        {
          student_id: 2,
          overall_progress: 30.0,
          lessons_completed: 3,
          total_lessons: 10,
          time_spent: 67,
          last_active: new Date().toISOString(),
        },
        {
          student_id: 3,
          overall_progress: 10.0,
          lessons_completed: 1,
          total_lessons: 10,
          time_spent: 23,
          last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          student_id: 4,
          overall_progress: 20.0,
          lessons_completed: 2,
          total_lessons: 10,
          time_spent: 38,
          last_active: new Date().toISOString(),
        },
      ])
      .select()

    if (metricsError) {
      console.error("Metrics error:", metricsError)
    } else {
      console.log("Student metrics created:", metrics?.length)
    }

    // 9. Create notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from("notifications")
      .upsert([
        {
          id: 1,
          user_id: 1,
          title: "Assignment Graded",
          message: "Your Grammar Basics Essay has been graded. Score: 88%",
          type: "feedback",
          is_read: false,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          user_id: 2,
          title: "New Assignment",
          message: "A new assignment 'Reading Comprehension Test' has been posted",
          type: "assignment",
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          user_id: 1,
          title: "Achievement Unlocked!",
          message: "You earned the 'High Scorer' achievement for scoring 90%+",
          type: "achievement",
          is_read: false,
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          user_id: 4,
          title: "Assignment Due Soon",
          message: "Your Vocabulary Practice assignment is due in 2 days",
          type: "reminder",
          is_read: true,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()

    if (notificationsError) {
      console.error("Notifications error:", notificationsError)
    } else {
      console.log("Notifications created:", notifications?.length)
    }

    // 10. Create student achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from("student_achievements")
      .upsert([
        {
          id: 1,
          student_id: 1,
          achievement_name: "First Lesson Complete",
          achievement_description: "Completed your first lesson",
          category: "milestone",
          icon: "🎯",
          earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          student_id: 1,
          achievement_name: "High Scorer",
          achievement_description: "Scored 90% or higher on a lesson",
          category: "performance",
          icon: "⭐",
          earned_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          student_id: 2,
          achievement_name: "Perfect Score",
          achievement_description: "Achieved 100% on a vocabulary lesson",
          category: "performance",
          icon: "🏆",
          earned_at: new Date().toISOString(),
        },
        {
          id: 4,
          student_id: 2,
          achievement_name: "Grammar Master",
          achievement_description: "Completed all basic grammar lessons",
          category: "subject",
          icon: "📚",
          earned_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()

    if (achievementsError) {
      console.error("Achievements error:", achievementsError)
    } else {
      console.log("Achievements created:", achievements?.length)
    }

    // 11. Create exercise scores
    const { data: exerciseScores, error: exerciseScoresError } = await supabase
      .from("exercise_scores")
      .upsert([
        {
          id: 1,
          student_id: 1,
          exercise_type: "grammar",
          exercise_id: "basic-grammar",
          score: 85,
          max_score: 100,
          completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          student_id: 1,
          exercise_type: "vocabulary",
          exercise_id: "basic-vocabulary",
          score: 92,
          max_score: 100,
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          student_id: 2,
          exercise_type: "grammar",
          exercise_id: "basic-grammar",
          score: 78,
          max_score: 100,
          completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          student_id: 2,
          exercise_type: "vocabulary",
          exercise_id: "basic-vocabulary",
          score: 95,
          max_score: 100,
          completed_at: new Date().toISOString(),
        },
      ])
      .select()

    if (exerciseScoresError) {
      console.error("Exercise scores error:", exerciseScoresError)
    } else {
      console.log("Exercise scores created:", exerciseScores?.length)
    }

    return NextResponse.json({
      success: true,
      message: "Sample data created successfully!",
      data: {
        teachers: teachers?.length || 0,
        students: students?.length || 0,
        classes: classes?.length || 0,
        lessons: lessons?.length || 0,
        assignments: assignments?.length || 0,
        submissions: submissions?.length || 0,
        completions: completions?.length || 0,
        metrics: metrics?.length || 0,
        notifications: notifications?.length || 0,
        achievements: achievements?.length || 0,
        exerciseScores: exerciseScores?.length || 0,
      },
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
