"use client"

import { Input } from "@/components/ui/input"
import AuthStateContext from "@/context/AuthStateContext"
import { useFriendships } from "@/hooks/useFriendships"
import { FriendRequest, SearchResult } from "@/types/app"
import filterFriendshipData from "@/utils/filterFriendshipData"
import getProfileSearch from "@/utils/getProfileSearch"
import {
  updateFriendRequest,
  deleteFriendRequest,
} from "@/utils/handleFriendRequest"
import { useContext, useEffect, useState } from "react"

export default function page() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  const [inputValue, setInputValue] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [friends, setFriends] = useState<FriendRequest[]>([])
  const fetchFriendshipsData = useFriendships(userId)

  // FETCH FRIENDS AND FRIEND REQUESTS
  useEffect(() => {
    filterFriendshipData(
      fetchFriendshipsData,
      userId,
      setFriendRequests,
      setFriends
    )
  }, [fetchFriendshipsData])

  // FETCH SEARCH RESULTS FROM SEARCH INPUT
  useEffect(() => {
    async function fetchData() {
      const response = await getProfileSearch(inputValue)
      setSearchResults(response)
    }
    const timeout = setTimeout(() => {
      fetchData()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [inputValue])

  // CLOSE SEARCH RESULTS WHEN CLICKED OUTSIDE SEARCH INPUT AND RESULTS
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const element = e.target as HTMLElement
      if (element.id !== "search" || element.dataset.type === "search-result") {
        setShowSearch(false)
      } else {
        setShowSearch(true)
      }
    }

    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <section>
      <div className="relative">
        <Input
          type="text"
          name="search"
          id="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search profile"
        />
        <div
          className={`absolute top-[100%] w-full left-0 bg-blue-400 ${
            !showSearch && "hidden"
          }`}
        >
          {searchResults.map((result) => (
            <a
              href={`/profile/${result?.username}`}
              key={result?.id}
              datatype="search-result"
            >
              <div className="bg-gray-50 hover:bg-gray-200">
                <h3>{result?.full_name}</h3>
                <p>{result?.username}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-6 py-4">
        <div className="rounded-xl">
          <h1 className="text-[#ffffff] text-[1.2rem] font-bold">Invites</h1>
          {friendRequests.length > 0 ? (
            friendRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#00000086] rounded-md flex justify-between px-4 py-2"
              >
                <div className="flex flex-col">
                  <h2 className="font-bold">{req.full_name_1}</h2>
                  <p className="text-[0.8rem]">@{req.username_1}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => updateFriendRequest(req.id)}>
                    Accept
                  </button>
                  <button onClick={() => deleteFriendRequest(req.id)}>
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#00000086] rounded-md flex justify-between px-4 py-2">
              <div className="flex flex-col ">
                <h2 className="font-bold text-white">No requests pending</h2>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl">
          <h1 className="text-[#ffffff] text-[1.5rem] font-bold">Friends</h1>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-[#00000086] rounded-md flex justify-between px-4 py-2"
              >
                <div className="flex flex-col  text-white">
                  {friend.initiated_by === userId ? (
                    <h2 className="font-bold">{friend.full_name_2}</h2>
                  ) : (
                    <h2 className="font-bold ">{friend.full_name_1}</h2>
                  )}

                  {friend.initiated_by === userId ? (
                    <p className="text-[0.8rem] text-[#717171]">
                      @{friend.username_2}
                    </p>
                  ) : (
                    <p className="text-[0.8rem] text-[#9f9f9f]">
                      @{friend.username_1}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 text-white">
                  <button>Message</button>
                  <button onClick={() => deleteFriendRequest(friend.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#00000086] rounded-md flex justify-between px-4 py-2">
              <div className="flex flex-col text-white">
                <h2 className="font-bold">Start adding friends!</h2>
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
