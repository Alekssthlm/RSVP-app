import { SearchResult } from "@/types/app"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"

interface ProfileSearch {
  id: string
  username: string
  full_name: string
  profile_image: string
  email: string
}

const getProfileSearch = async (
  searchQuery: string
): Promise<ProfileSearch[]> => {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  if (!searchQuery.trim()) {
    // Return an empty array if searchQuery is empty
    return []
  }

  const { data, error } = await supabaseBrowserClient
    .from("profiles")
    .select("*")
    .ilike("username", `%${searchQuery}%`)
    .limit(5)

  if (error) {
    console.error("Error fetching profiles:", error.message)
    return []
  }

  return (data as unknown as ProfileSearch[]) || []
}

export default getProfileSearch
