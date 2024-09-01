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
    return { success: false, message: `Error creating event: ${error.message}` }
  } else {
    console.log("Event created successfully")
    return { success: true, message: "Event created successfully" }
  }
}

export async function getEvent(eventId: string): Promise<any> {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const { data, error } = await supabaseBrowserClient
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single() // Ensure we get a single event

  if (error) {
    console.error("Error getting event", error.message)
    return { message: `Error getting event: ${error.message}` }
  } else {
    console.log("Event retrieved successfully")
    return data
  }
}

// export async function updateEvent(friendshipId: string) {

// }

// export async function deleteEvent(friendshipId: string) {

// }
