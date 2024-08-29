export default function useGetFriends(userId: string, friendshipData: any) {
  const confirmedFriends = friendshipData.filter((friendship: any) => {
    return friendship.status === "accepted"
  })
  const friendsList = confirmedFriends.map((friend: any) => {
    if (friend.user_id_1 === userId) {
      return {
        friendshipId: friend.id,
        friend: friend.user_id_2,
        friendName: friend.full_name_2,
        friendUsername: friend.username_2,
        status: friend.status,
      }
    } else {
      return {
        friendshipId: friend.id,
        friend: friend.user_id_1,
        friendName: friend.full_name_1,
        friendUsername: friend.username_1,
        status: friend.status,
      }
    }
  })
  return friendsList
}
