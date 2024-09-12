"use client"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { useState, useEffect } from "react"

type Invitation = {
  id: string
  event_id: string
  user_id: string
  full_name: string
  username: string
  status: string
  profile_image: string
}

interface PostgresChangesPayload<T = any> {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new?: T
  old?: T
}

export function useInvitationData(
  event_id: string,
  userId: string,
  isMyEvents?: boolean
) {
  const [invitationData, setInvitationData] = useState<Invitation[]>([])
  const supabaseBrowserClient = getSupabaseBrowserClient()

  useEffect(() => {
    if (!userId) {
      return
    }
    let channel: ReturnType<(typeof supabaseBrowserClient)["channel"]>

    async function fetchInvitationData() {
      // Fetch the initial data
      const { data, error } = await supabaseBrowserClient
        .from("invitations")
        .select("*")
        .eq("event_id", event_id)
        .eq("user_id", userId)
        .single() // Assume there's only one invitation per user per event

      if (error) {
        console.error("Error fetching invitation", error.message)
      } else if (data) {
        const invitation = data as Invitation
        setInvitationData([invitation]) // Set the initial data

        // Set up the real-time subscription for this specific invitation ID
        channel = supabaseBrowserClient
          .channel(`public:invitations:id=${invitation.id}`)
          .on(
            "postgres_changes",
            {
              event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
              schema: "public",
              table: "invitations",
              filter: `id=eq.${invitation.id}`, // Filter by the specific invitation ID
            },
            (payload: PostgresChangesPayload<Invitation>) => {
              console.log("Change received for invitation")
              if (
                payload.eventType === "UPDATE" &&
                payload.new!.status !== payload.old!.status
              ) {
                setInvitationData([payload.new as Invitation])
              } else if (payload.eventType === "DELETE") {
                setInvitationData((prevData) =>
                  prevData.filter((item) => item.id !== payload.old!.id)
                )
              } else if (payload.eventType === "INSERT") {
                setInvitationData([payload.new as Invitation])
              }
            }
          )
          .subscribe()
      }
    }

    fetchInvitationData()

    // Clean up the channel on unmount
    return () => {
      if (channel) {
        supabaseBrowserClient.removeChannel(channel)
      }
    }
  }, [event_id, userId, supabaseBrowserClient])

  return invitationData
}
