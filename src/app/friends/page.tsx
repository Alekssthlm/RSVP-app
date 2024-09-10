"use client"

import { Input } from "@/components/ui/input"
import AuthStateContext from "@/context/AuthStateContext"
import { useFriendshipsListener } from "@/hooks/useFriendshipsListener"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { FriendRequest, SearchResult } from "@/types/app"
import filterFriendshipData from "@/utils/filterFriendshipData"
import getProfileSearch from "@/utils/getProfileSearch"
import {
  updateFriendRequest,
  deleteFriendRequest,
} from "@/utils/handleFriendRequest"
import { Check, User, X } from "lucide-react"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

export default function page() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  const [inputValue, setInputValue] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [friends, setFriends] = useState<FriendRequest[]>([])
  const fetchFriendshipsData = useFriendshipsListener(userId)

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
    <section className="p-4 bg-[#011b2988] flex-grow md:rounded-xl">
      <div className="relative max-w-[20rem]">
        <Input
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search @username"
          className=""
        />
        <div
          className={`absolute top-[100%] bg-[#011b29] w-full left-0 max-h-[20rem] overflow-auto flex flex-col gap-2 p-2 ${
            !showSearch && "hidden"
          }`}
        >
          {searchResults.map((result) => (
            <a
              href={`/profile/${result?.username}`}
              key={result?.id}
              datatype="search-result"
            >
              <div className=" bg-[#00000086] border border-gray-500 rounded-md p-2">
                <h2 className="text-white text-[0.8rem]">
                  {result?.full_name}
                </h2>
                <p className="text-[0.8rem] text-[#009db9]">
                  @{result?.username}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-6 py-4 text-white">
        <div className="rounded-xl ">
          <h1 className=" text-[1.5rem] font-bold">Invites</h1>
          {friendRequests.length > 0 ? (
            friendRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#00000086] text-white border border-gray-500 rounded-md flex justify-between px-4 py-2"
              >
                <div className="flex flex-col">
                  <h2 className="font-bold">{req.full_name_1}</h2>
                  <p className="text-[0.8rem] text-[#28dfff]">
                    @{req.username_1}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateFriendRequest(req.id)}
                    className="rounded-full bg-gray-700 p-2 self-center"
                  >
                    <Check size={15} />
                  </button>
                  <button
                    onClick={() => deleteFriendRequest(req.id)}
                    className="text-red-600 rounded-full border-2 border-gray-600 p-2 self-center"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-between py-2">
              <div className="flex flex-col ">
                <h2 className="text-gray-300">No requests pending</h2>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl ">
          <h1 className=" text-[1.5rem] font-bold">Friends</h1>
          <div className="flex flex-col gap-2 py-2">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-[#00000086] text-white border border-gray-500 rounded-md flex justify-between px-4 py-2"
                >
                  <div className="flex flex-col">
                    {friend.initiated_by === userId ? (
                      <h2 className="font-bold">{friend.full_name_2}</h2>
                    ) : (
                      <h2 className="font-bold ">{friend.full_name_1}</h2>
                    )}

                    {friend.initiated_by === userId ? (
                      <p className="text-[0.8rem] text-[#009db9] ">
                        @{friend.username_2}
                      </p>
                    ) : (
                      <p className="text-[0.8rem] text-[#009db9]">
                        @{friend.username_1}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={
                        friend.initiated_by === userId
                          ? `/profile/${friend.username_2}`
                          : `/profile/${friend.username_1}`
                      }
                      className="rounded-full bg-gray-700 p-2 self-center"
                    >
                      <User size={18} />
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-600 rounded-full border-2 border-gray-600 p-2 self-center">
                          <X size={18} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove your friendship.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFriendRequest(friend.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#00000086] text-white border border-gray-500 rounded-md flex justify-between">
                <div className="flex flex-col px-4 py-4">
                  <h2 className="">Start adding friends!</h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  )
}
