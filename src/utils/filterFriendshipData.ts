import { FriendRequest } from "@/types/app"
import { SetStateAction } from "react"

type Friendship = {
  id: string
  user_id_1: string
  user_id_2: string
  status: string
  created_at: string
  initiated_by: string
}

interface FriendshipData {
  fetchFriendshipData: Friendship[]
  userId: string
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>
  setFriends: React.Dispatch<React.SetStateAction<FriendRequest[]>>
}

export default async function filterFriendshipData(
  fetchFriendshipData: any[],
  userId: any,
  setFriendRequests: {
    (value: SetStateAction<FriendRequest[]>): void
    (arg0: never[]): void
  },
  setFriends: {
    (value: SetStateAction<FriendRequest[]>): void
    (arg0: never[]): void
  }
) {
  setFriendRequests([])
  setFriends([])

  const requests = fetchFriendshipData.filter(
    (friend: { status: string; initiated_by: any }) =>
      friend.status === "pending" && friend.initiated_by !== userId
  )

  // Create a new array with only unique requests based on their id
  const uniqueRequests = requests.filter(
    (request: { id: any }, index: any, self: any[]) =>
      index === self.findIndex((r: { id: any }) => r.id === request.id)
  )

  const friendList = fetchFriendshipData.filter(
    (friend: { status: string }) => friend.status === "accepted"
  )

  const uniqueFriends = friendList.filter(
    (friend: { id: any }, index: any, self: any[]) =>
      index === self.findIndex((f: { id: any }) => f.id === friend.id)
  )

  if (uniqueRequests.length > 0) {
    setFriendRequests((prev: any) => [...prev, ...uniqueRequests])
  }

  if (uniqueFriends.length > 0) {
    setFriends((prev: any) => [...prev, ...uniqueFriends])
  }
}
