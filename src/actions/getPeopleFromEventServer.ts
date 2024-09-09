import { supabaseServerClient } from "@/utils/supabaseServer"

export default async function getPeopleFromEventServer(
  eventId: string,
  userIds: string[]
) {
  const supabase = supabaseServerClient()

  const { data, error } = await supabase
    .from("invitations")
    .select("id, user_id, full_name, username, status, profile_image")
    .in("user_id", userIds)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error fetching profiles:", error.message)
    return []
  }

  return data
}
