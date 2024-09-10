"use client"

import { useFriendshipsListener } from "@/hooks/useFriendshipsListener"
import useGetFriends from "@/utils/getFriends"
import sendFriendRequest from "@/utils/sendFriendRequest"
import React from "react"

type SendFriendRequestButtonProps = {
  currentUserId: string | undefined
  currentProfile: string | undefined
  currentUsername: string | undefined
  currentProfileUsername: string | undefined
  currentUserFullname: string | undefined
  currentProfileFullname: string | undefined
}

const SendFriendRequestButton: React.FC<SendFriendRequestButtonProps> = ({
  currentUserId,
  currentUsername,
  currentProfile,
  currentProfileUsername,
  currentUserFullname,
  currentProfileFullname,
}) => {
  const fetchFriendshipsData = useFriendshipsListener(currentUserId!)
  const friendList = useGetFriends(currentUserId!, fetchFriendshipsData, "all")

  const friendDetails = friendList?.find(
    (friend: any) => friend.friend === currentProfile
  )

  function handleAddFriend() {
    if (!currentProfile) {
      return
    }
    sendFriendRequest(
      currentUserId!,
      currentUsername!,
      currentUserFullname!,
      currentProfile!,
      currentProfileUsername!,
      currentProfileFullname!
    )
  }

  let buttonContent
  switch (friendDetails?.status) {
    case "pending":
      buttonContent = (
        <button disabled className="bg-gray-400 text-white py-2 px-4 rounded">
          Pending
        </button>
      )
      break
    case "accepted":
      buttonContent = (
        <button
          onClick={() => console.log("message")}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Message
        </button>
      )
      break
    default:
      buttonContent = (
        <button
          onClick={handleAddFriend}
          className="bg-[#38067a] hover:bg-[#5605c0] text-white py-2 px-4 rounded"
        >
          Add Friend
        </button>
      )
      break
  }

  return buttonContent
}

export default SendFriendRequestButton
