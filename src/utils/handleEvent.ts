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

export async function editEvent(event_id: string, eventData: createEvent) {
  const {
    organiser,
    title,
    description,
    start_time,
    end_time,
    location,
    invited_friends,
  } = eventData

  const supabaseBrowserClient = getSupabaseBrowserClient()

  const { data, error } = await supabaseBrowserClient
    .from("events")
    .update({
      organiser_id: organiser,
      title,
      description,
      start_time,
      end_time,
      location,
      invited_friends,
    })
    .eq("id", event_id) // Update only the specific event

  if (error) {
    console.error("Error updating event", error.message)
    return { success: false, message: `Error updating event: ${error.message}` }
  } else {
    return { success: true, message: "Event updated successfully" }
  }
}

export async function deleteEvent(
  eventId: string,
  authIsEventOrganiser: boolean
) {
  const supabaseBrowserClient = getSupabaseBrowserClient()

  if (authIsEventOrganiser) {
    const { error: deleteError } = await supabaseBrowserClient
      .from("events")
      .delete()
      .eq("id", eventId)

    if (deleteError) {
      console.error("Error deleting event", deleteError.message)
      return {
        success: false,
        message: `Error deleting event: ${deleteError.message}`,
      }
    } else {
      return { success: true, message: "Event deleted successfully" }
    }
  } else {
    return { success: false, message: "You are not the event organiser" }
  }
}

export async function updateSelectStatus(invitationId: string, status: string) {
  const supabaseBrowserClient = getSupabaseBrowserClient()

  const { error: updateError } = await supabaseBrowserClient
    .from("invitations")
    .update({ status })
    .eq("id", invitationId)

  if (updateError) {
    console.error("Error updating status", updateError.message)
    return {
      success: false,
      message: `Error updating status: ${updateError.message}`,
    }
  } else {
    return { success: true, message: "Status updated successfully" }
  }
}
