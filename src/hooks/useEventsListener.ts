"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"

type Events = {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  invited_friends: string[]
  organiser_id: string
  image: string
  created_at: string
}

export function useEventsPreviewListener(userId: string) {
  const [myEvents, setMyEvents] = useState<Events[]>([])
  const [otherEvents, setOtherEvents] = useState<Events[]>([])
  const [loading, setLoading] = useState(true) // Loading state
  const supabaseBrowserClient = getSupabaseBrowserClient()

  useEffect(() => {
    if (!userId) return

    const fetchEvents = async () => {
      setLoading(true) // Start loading
      const { data, error } = await supabaseBrowserClient
        .from("events")
        .select("*")
        .or(`organiser_id.eq.${userId},invited_friends.cs.{${userId}}`)

      if (error) {
        console.error(error)
      } else {
        const eventsData = data as Events[]
        const myEventsData = eventsData.filter(
          (event) => event.organiser_id === userId
        )
        const otherEventsData = eventsData.filter((event) =>
          event.invited_friends.includes(userId)
        )
        setMyEvents(myEventsData)
        setOtherEvents(otherEventsData)
      }
      setLoading(false) // End loading
    }

    fetchEvents()

    const channel = supabaseBrowserClient
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload: any) => {
          const event = payload.new as Events

          if (payload.eventType === "INSERT") {
            if (event.organiser_id === userId) {
              setMyEvents((prev) => [...prev, event])
            } else if (event.invited_friends.includes(userId)) {
              setOtherEvents((prev) => [...prev, event])
            }
          } else if (payload.eventType === "UPDATE") {
            if (event.organiser_id === userId) {
              setMyEvents((prev) =>
                prev.map((e) => (e.id === event.id ? event : e))
              )
            } else if (event.invited_friends.includes(userId)) {
              setOtherEvents((prev) =>
                prev.map((e) => (e.id === event.id ? event : e))
              )
            }
          } else if (payload.eventType === "DELETE") {
            setMyEvents((prev) => prev.filter((e) => e.id !== payload.old!.id))
            setOtherEvents((prev) =>
              prev.filter((e) => e.id !== payload.old!.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabaseBrowserClient.removeChannel(channel)
    }
  }, [userId])

  return { myEvents, otherEvents, loading }
}
