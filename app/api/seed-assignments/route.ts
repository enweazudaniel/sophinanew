import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Starting assignment seeding...")

    // First, let's check if the users table exists and create basic structure if needed
    console.log("Checking database structure...")

    // Try to create users table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    const createAssignmentsTable = `
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assignment_type VARCHAR(50),
        due_date TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        target_type VARCHAR(50) DEFAULT 'all',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    const createSubmissionsTable = `
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id),
        student_id INTEGER REFERENCES users(id),
        content TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        grade INTEGER,
        feedback TEXT,
        submitted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    const createNotificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50),
        title VARCHAR(255),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Execute table creation
    await supabase.rpc("exec_sql", { sql: createUsersTable })
    await supabase.rpc("exec_sql", { sql: createAssignmentsTable })
    await supabase.rpc("exec_sql", { sql: createSubmissionsTable })
    await supabase.rpc("exec_sql", { sql: createNotificationsTable })

    console.log("Database tables checked/created")

    // Now try to fetch teachers with better error handling
    let teachers = []
    try {
      const { data: teacherData, error: teachersError } = await supabase
        .from("users")
        .select("id, username, full_name")
        .eq("role", "teacher")

      if (teachersError) {
        console.log("Teachers query error:", teachersError)
        // If table doesn't exist or query fails, we'll create teachers below
      } else {
        teachers = teacherData || []
      }
    } catch (error) {
      console.log("Teachers fetch failed, will create new ones:", error)
    }

    console.log(`Found ${teachers.length} existing teachers`)

    // If no teachers, create one
    if (teachers.length === 0) {
      console.log("Creating teacher...")

      // First, let's try to insert directly
      const teacherData = {
        username: "teacher1",
        password: "password123",
        full_name: "Ms. Sarah Johnson",
        email: "teacher1@school.com",
        role: "teacher",
        created_at: new Date().toISOString(),
      }

      const { data: newTeacher, error: createTeacherError } = await supabase.from("users").insert(teacherData).select()

      if (createTeacherError) {
        console.error("Error creating teacher:", createTeacherError)

        // Try alternative approach - upsert
        const { data: upsertTeacher, error: upsertError } = await supabase
          .from("users")
          .upsert(teacherData, { onConflict: "username" })
          .select()

        if (upsertError) {
          console.error("Upsert teacher error:", upsertError)
          return NextResponse.json(
            {
              error: "Failed to create teacher",
              details: upsertError.message,
            },
            { status: 500 },
          )
        }

        if (upsertTeacher && upsertTeacher.length > 0) {
          teachers = upsertTeacher
        }
      } else if (newTeacher && newTeacher.length > 0) {
        teachers = newTeacher
      }

      console.log("Teacher created:", teachers[0])
    }

    // Get or create students
    let students = []
    try {
      const { data: studentData, error: studentsError } = await supabase
        .from("users")
        .select("id, username, full_name")
        .eq("role", "student")

      if (!studentsError && studentData) {
        students = studentData
      }
    } catch (error) {
      console.log("Students fetch failed, will create new ones:", error)
    }

    console.log(`Found ${students.length} existing students`)

    // If no students, create some
    if (students.length === 0) {
      console.log("Creating students...")

      const studentsToCreate = [
        { username: "student1", full_name: "Alice Johnson", email: "alice@school.com" },
        { username: "student2", full_name: "Bob Smith", email: "bob@school.com" },
        { username: "student3", full_name: "Carol Davis", email: "carol@school.com" },
        { username: "student4", full_name: "David Wilson", email: "david@school.com" },
        { username: "student5", full_name: "Emma Brown", email: "emma@school.com" },
      ]

      const studentsData = studentsToCreate.map((student) => ({
        ...student,
        password: "password123",
        role: "student",
        created_at: new Date().toISOString(),
      }))

      const { data: newStudents, error: createStudentsError } = await supabase
        .from("users")
        .insert(studentsData)
        .select()

      if (createStudentsError) {
        console.error("Error creating students:", createStudentsError)

        // Try creating one by one
        for (const studentData of studentsData) {
          const { data: singleStudent, error: singleError } = await supabase
            .from("users")
            .upsert(studentData, { onConflict: "username" })
            .select()

          if (!singleError && singleStudent) {
            students.push(...singleStudent)
          }
        }
      } else if (newStudents) {
        students = newStudents
      }

      console.log(`Created ${students.length} students`)
    }

    if (teachers.length === 0) {
      return NextResponse.json(
        {
          error: "No teachers available and failed to create one",
        },
        { status: 500 },
      )
    }

    // Clear existing assignments (optional)
    try {
      await supabase.from("assignments").delete().neq("id", 0)
      console.log("Cleared existing assignments")
    } catch (error) {
      console.log("Could not clear assignments (table might be empty):", error)
    }

    // Create sample assignments
    const teacherId = teachers[0].id
    const currentDate = new Date()

    const assignments = [
      {
        title: "Basic Grammar Exercise",
        description:
          "Complete the grammar exercises focusing on present tense, past tense, and future tense. Include examples for each tense and write 5 sentences for each.",
        assignment_type: "grammar",
        due_date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: teacherId,
        target_type: "all",
        status: "active",
        created_at: new Date().toISOString(),
      },
      {
        title: "Vocabulary Building - Animals",
        description:
          "Learn 20 new animal vocabulary words. Create sentences using each word and draw or find pictures to match each animal.",
        assignment_type: "vocabulary",
        due_date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: teacherId,
        target_type: "all",
        status: "active",
        created_at: new Date().toISOString(),
      },
      {
        title: "Reading Comprehension - Short Story",
        description:
          "Read the short story 'The Little Prince' chapter 1-3. Answer the comprehension questions and write a summary of what you learned.",
        assignment_type: "reading",
        due_date: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: teacherId,
        target_type: "all",
        status: "active",
        created_at: new Date().toISOString(),
      },
      {
        title: "Speaking Practice - Self Introduction",
        description:
          "Prepare a 2-minute self-introduction speech. Include your name, age, hobbies, and future dreams. Practice pronunciation and record yourself.",
        assignment_type: "speaking",
        due_date: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: teacherId,
        target_type: "all",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ]

    // Insert assignments
    console.log("Creating assignments...")
    const { data: createdAssignments, error: assignmentError } = await supabase
      .from("assignments")
      .insert(assignments)
      .select()

    if (assignmentError) {
      console.error("Error creating assignments:", assignmentError)
      return NextResponse.json(
        {
          error: "Failed to create assignments",
          details: assignmentError.message,
        },
        { status: 500 },
      )
    }

    console.log(`Created ${createdAssignments?.length || 0} assignments`)

    // Create some sample submissions if we have students
    if (createdAssignments && students.length > 0) {
      console.log("Creating sample submissions...")

      const submissions = []
      for (let i = 0; i < Math.min(2, createdAssignments.length); i++) {
        for (let j = 0; j < Math.min(2, students.length); j++) {
          submissions.push({
            assignment_id: createdAssignments[i].id,
            student_id: students[j].id,
            content: `This is a sample submission for ${createdAssignments[i].title} by ${students[j].username}. The student has completed the assignment according to the requirements.`,
            status: j === 0 ? "graded" : "submitted",
            grade: j === 0 ? 85 + i * 5 : null,
            feedback: j === 0 ? "Good work! Keep practicing your grammar and vocabulary." : null,
            submitted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          })
        }
      }

      if (submissions.length > 0) {
        const { error: submissionError } = await supabase.from("submissions").insert(submissions)

        if (submissionError) {
          console.error("Error creating submissions:", submissionError)
        } else {
          console.log(`Created ${submissions.length} sample submissions`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdAssignments?.length || 0} assignments with sample data`,
      data: {
        assignments: createdAssignments?.length || 0,
        students: students.length,
        teachers: teachers.length,
        teacherInfo: teachers[0] ? { id: teachers[0].id, username: teachers[0].username } : null,
      },
    })
  } catch (error) {
    console.error("Error in assignment seeding:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
