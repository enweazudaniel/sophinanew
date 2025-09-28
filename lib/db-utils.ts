import { supabase } from "./supabase"

export async function getStudentByUsername(username: string) {
  try {
    const { data, error } = await supabase.from("students").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching student:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function getTeacherByUsername(username: string) {
  try {
    const { data, error } = await supabase.from("teachers").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching teacher:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function getAllStudents() {
  try {
    const { data, error } = await supabase.from("students").select("*").order("full_name")

    if (error) {
      console.error("Error fetching students:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export async function createStudent(studentData: {
  username: string
  password: string
  full_name: string
  avatar_url?: string
}) {
  try {
    const { data, error } = await supabase.from("students").insert([studentData]).select().single()

    if (error) {
      console.error("Error creating student:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function updateStudent(
  id: number,
  updates: Partial<{
    username: string
    password: string
    full_name: string
    avatar_url: string
  }>,
) {
  try {
    const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating student:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function deleteStudent(id: number) {
  try {
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) {
      console.error("Error deleting student:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Database error:", error)
    return false
  }
}
