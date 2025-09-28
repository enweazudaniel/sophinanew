// Map specific student names to their avatar IDs
export const studentAvatarMapping: Record<string, string> = {
  "FAITHFUL OSARIEMEN": "faithful",
  "ISREAL ABUCHI UBAH": "isreal",
  "BENEDICT BIELONWU UCHE": "benedict",
  "JOSHUA IWEDIKE": "joshua",
  "GOD'S SALVATION JUDE": "salvation",
  "GOD'SWILL OJOWOH": "godswill",
  "ONYEKACHUKWU SOMAWINA": "onyekachukwu",
  "DOMINION OBOITE": "dominion",
  "DEBORAH ONYINYE EZEBUIKE": "deborah",
  "EKE - CHINASA MIRACLE": "chinasa",
  "ESTHER ISIOMA IKECHUKWU": "esther",
}

// Map teacher names to their avatar IDs
export const teacherAvatarMapping: Record<string, string> = {
  "MRS. VERA ESONYE": "vera",
  Daniel: "daniel",
}

// Function to get avatar ID by name
export function getAvatarIdByName(name: string, isTeacher = false): string | undefined {
  const mapping = isTeacher ? teacherAvatarMapping : studentAvatarMapping
  return mapping[name.toUpperCase()]
}

// Function to determine if a student should use boy or girl avatar
export function getStudentGender(name: string): "boy" | "girl" {
  const girlNames = [
    "FAITHFUL OSARIEMEN",
    "GOD'S SALVATION JUDE",
    "DEBORAH ONYINYE EZEBUIKE",
    "EKE - CHINASA MIRACLE",
    "ESTHER ISIOMA IKECHUKWU",
  ]

  return girlNames.includes(name.toUpperCase()) ? "girl" : "boy"
}

// Function to determine if a teacher should use man or woman avatar
export function getTeacherGender(name: string): "man" | "woman" {
  const womanNames = ["MRS. VERA ESONYE"]
  return womanNames.includes(name.toUpperCase()) ? "woman" : "man"
}
