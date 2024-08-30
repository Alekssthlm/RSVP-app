import { getSupabaseBrowserClient } from "./supabaseClient"

interface createEvent {
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  invited_friends: string[]
  organiser: string
}

export async function createEvent({
  organiser,
  title,
  description,
  start_time,
  end_time,
  location,
  invited_friends,
}: createEvent) {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const { data, error } = await supabaseBrowserClient.from("events").insert({
    organiser_id: organiser,
    title,
    description,
    start_time,
    end_time,
    location,
    invited_friends,
  })

  if (error) {
    console.error("Error creating event", error.message)
  } else {
    console.log("Event created successfully")
  }
}

// export async function updateEvent(friendshipId: string) {
//   const supabaseBrowserClient = getSupabaseBrowserClient()
//   const { data, error } = await supabaseBrowserClient
//     .from("friendships")
//     .update({ status: "accepted" })
//     .eq("id", friendshipId)

//   if (error) {
//     console.error("Error updating status.", error.message)
//   } else {
//     console.log("Friend status updated successfully")
//   }
// }

// export async function deleteEvent(friendshipId: string) {
//   const supabaseBrowserClient = getSupabaseBrowserClient()
//   const { data, error } = await supabaseBrowserClient
//     .from("friendships")
//     .delete()
//     .eq("id", friendshipId)

//   if (error) {
//     console.error("Error deleting friend request.", error.message)
//   } else {
//     console.log("Friend request deleted successfully")
//   }
// }
