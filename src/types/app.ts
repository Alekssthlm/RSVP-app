export interface User {
  id: string
  full_name: string
  username: string
  email: string
  profile_image: string
}

export type SearchResult = {
  id: string
  username: string
  full_name: string
  profile_image?: string
}

export interface FriendRequest {
  id: string
  full_name_1: string
  username_1: string
  full_name_2: string
  username_2: string
  initiated_by: string
}
