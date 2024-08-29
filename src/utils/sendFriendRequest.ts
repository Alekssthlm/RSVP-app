import { getSupabaseBrowserClient } from "./supabaseClient"

export default async function sendFriendRequest(
  senderId: string,
  senderUsername: string,
  senderFullname: string,
  receiverId: string,
  receiverUsername: string,
  receiverFullname: string
) {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const { data, error } = await supabaseBrowserClient
    .from("friendships")
    .insert([
      {
        user_id_1: senderId,
        username_1: senderUsername,
        full_name_1: senderFullname,
        user_id_2: receiverId,
        username_2: receiverUsername,
        full_name_2: receiverFullname,
        status: "pending",
        initiated_by: senderId,
      },
    ])

  if (error) {
    console.error("Error sending friend request:", error.message)
  } else {
    console.log("Friend request sent successfully")
  }
}
