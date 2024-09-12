"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"

type Friendship = {
  id: string
  user_id_1: string
  user_id_2: string
  status: string
  created_at: string
  initiated_by: string
}

interface PostgresChangesPayload<T = any> {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new?: T
  old?: T
}

export function useFriendshipsListener(userId: string) {
  const [friendships, setFriendships] = useState<Friendship[]>([])
  const supabaseBrowserClient = getSupabaseBrowserClient()

  useEffect(() => {
    // Function to fetch the initial data
    if (!userId) return
    const fetchFriendships = async () => {
      const { data, error } = await supabaseBrowserClient
        .from("friendships")
        .select("*")
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)

      if (error) {
        console.error(error)
      } else {
        setFriendships(data as Friendship[])
      }
    }

    // Fetch the initial data
    fetchFriendships()

    // Set up the real-time subscription
    const channel = supabaseBrowserClient
      .channel("public:friendships")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friendships" },
        (payload: PostgresChangesPayload<Friendship>) => {
          if (payload.eventType === "INSERT") {
            setFriendships((prev) => [...prev, payload.new as Friendship])
          } else if (payload.eventType === "UPDATE") {
            setFriendships((prev) =>
              prev.map((friendship) =>
                friendship.id === payload.old!.id
                  ? (payload.new as Friendship)
                  : friendship
              )
            )
          } else if (payload.eventType === "DELETE") {
            setFriendships((prev) =>
              prev.filter((friendship) => friendship.id !== payload.old!.id)
            )
          }
        }
      )
      .subscribe()

    // Clean up the subscription on unmount
    return () => {
      supabaseBrowserClient.removeChannel(channel)
    }
  }, [userId])

  return friendships
}
