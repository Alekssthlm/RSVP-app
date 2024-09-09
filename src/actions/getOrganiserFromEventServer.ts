import { supabaseServerClient } from "@/utils/supabaseServer"

export async function getOrganiserFromEventServer(userId: string) {
  const supabase = supabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, profile_image")
    .eq("id", userId)

  if (error) {
    console.error("Error fetching profiles:", error.message)
    return []
  }

  return data
}
