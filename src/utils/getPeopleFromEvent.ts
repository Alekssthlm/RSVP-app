import { getSupabaseBrowserClient } from "@/utils/supabaseClient"

export async function getPeopleFromEvent(userIds: string[]) {
  const supabaseBrowserClient = getSupabaseBrowserClient()

  const { data, error } = await supabaseBrowserClient
    .from("invitations")
    .select("id, user_id, full_name, username, status, profile_image")
    .in("user_id", userIds)

  if (error) {
    console.error("Error fetching profiles:", error.message)
    return []
  }

  return data
}

export async function getOrganiserFromEvent(userId: string) {
  const supabaseBrowserClient = getSupabaseBrowserClient()

  const { data, error } = await supabaseBrowserClient
    .from("profiles")
    .select("id, full_name, username, profile_image")
    .eq("id", userId)

  if (error) {
    console.error("Error fetching profiles:", error.message)
    return []
  }

  return data
}
