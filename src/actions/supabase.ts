"use server"

import { supabaseServerClient } from "@/utils/supabaseServer"

// FUNCTION TO REGISTER A USER WITH EMAIL AND PASSWORD
export async function registerWithEmailAndPassword({
  email,
  password,
  fullname,
  username,
  terms,
}: {
  email: string
  password: string
  fullname: string
  username: string
  terms: boolean
}) {
  const supabase = await supabaseServerClient()

  const { data, error } = await supabase
    .from("control_user_availability")
    .select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return JSON.stringify({ error: "Error fetching data" })
  }

  // Check if email or username already exist
  const emailExists = data?.some((user: any) => user.email === email)
  const usernameExists = data?.some((user: any) => user.username === username)

  if (emailExists || usernameExists) {
    const errors: { email?: string; username?: string } = {}

    if (emailExists) {
      errors.email = "Email already exists"
    }

    if (usernameExists) {
      errors.username = "Username already exists"
    }

    return JSON.stringify({ error: errors })
  }

  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname,
        username,
        terms,
      },
    },
  })

  return JSON.stringify(response)
}

// FUNCTION TO LOGIN A USER WITH EMAIL AND PASSWORD
export async function loginWithEmailAndPassword({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = supabaseServerClient()
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return JSON.stringify(response)
}
