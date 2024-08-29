"use client"

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
  return (
    <button
      onClick={handleAddFriend}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    >
      Add Friend
    </button>
  )
}

export default SendFriendRequestButton
