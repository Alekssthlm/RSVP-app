"use server"

import { supabaseServerClient } from "@/utils/supabaseServer"

export default async function updateUserSkill(userId: string, skill: string) {
  const supabase = await supabaseServerClient()

  // Update the user's record with RPC to supabase

  const { data: formResponse, error: formError } = await supabase.rpc(
    "add_skill",
    {
      user_id: userId,
      new_skill: skill,
    }
  )

  return [formResponse, formError]
}
