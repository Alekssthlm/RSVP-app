import { getSupabaseBrowserClient } from "./supabaseClient"

export async function updateFriendRequest(friendshipId: string) {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const { data, error } = await supabaseBrowserClient
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId)

  if (error) {
    console.error("Error updating status.", error.message)
  } else {
    console.log("Friend status updated successfully")
  }
}

export async function deleteFriendRequest(friendshipId: string) {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const { data, error } = await supabaseBrowserClient
    .from("friendships")
    .delete()
    .eq("id", friendshipId)

  if (error) {
    console.error("Error deleting friend request.", error.message)
  } else {
    console.log("Friend request deleted successfully")
  }
}
