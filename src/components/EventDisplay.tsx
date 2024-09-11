"use client"
import { useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

import EventForm from "@/components/EventForm"
import AuthStateContext from "@/context/AuthStateContext"
import EventStatusSelect from "./EventStatusSelect"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteEvent } from "@/utils/handleEvent"

interface Params {
  event_id: string
}

export default function EventDisplay({
  params: { event_id },
  eventData,
  authUserId,
  authIsEventOrganiser,
  invitedFriends,
  organiserData,
}: {
  params: Params
  eventData: any
  authUserId: string
  authIsEventOrganiser: boolean
  invitedFriends: any
  organiserData: any
}) {
  const { userId } = useContext(AuthStateContext)
  const [supportsMasking, setSupportsMasking] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const bg = searchParams.get("bg")

  useEffect(() => {
    const testMaskSupport = () => {
      const testDiv = document.createElement("div")
      testDiv.style.cssText =
        "-webkit-mask-image: linear-gradient(black, transparent); mask-image: linear-gradient(black, transparent);"
      document.body.appendChild(testDiv)
      const isSupported = window.getComputedStyle(testDiv).maskImage !== "none"
      document.body.removeChild(testDiv)
      return isSupported
    }

    setSupportsMasking(testMaskSupport())
  }, [])

  async function handleDelete() {
    const response = await deleteEvent(event_id, authIsEventOrganiser)

    setIsDeleting(false)
    router.push("/dashboard")
  }

  const formattedStartTime = eventData?.start_time
    ? format(new Date(eventData.start_time), "dd MMM yy - HH:mm")
    : ""
  const formattedEndTime = eventData?.end_time
    ? format(new Date(eventData.end_time), "dd MMM yy - HH:mm")
    : ""

  if (isEditing) {
    return (
      <EventForm mode="edit" event_id={event_id} setIsEditing={setIsEditing} />
    )
  }
  return (
    <>
      <section className="flex flex-col gap-4 text-white bg-[#011b2988] md:rounded-xl flex-1  ">
        <div className="relative flex flex-col flex-1">
          <div className="flex justify-between absolute top-0 left-0 right-0 z-10 p-2">
            <Link href={"/dashboard"} className="text-white text-sm">
              ← BACK
            </Link>
            {authIsEventOrganiser ? (
              <div className="flex gap-2 items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="bg-black  text-white px-4 py-1 border border-red-900 rounded-md p-2"
                    >
                      DELETE
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[20rem]">
                    <DialogHeader>
                      <DialogTitle>Delete Event</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this event?
                      </DialogDescription>
                    </DialogHeader>
                    {/* any content */}
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-black  text-white px-4 py-1 border border-gray-700 rounded-md p-2"
                >
                  EDIT
                </button>
              </div>
            ) : (
              <EventStatusSelect event_id={event_id} userId={authUserId} />
            )}
          </div>

          <div
            className={`h-[15rem] relative z-0 md:rounded-xl ${
              supportsMasking ? "mask1" : ""
            } `}
          >
            <img
              src={bg || "/image-placeholder.webp"}
              alt="Random"
              className="w-full h-full object-cover relative z-0 select-none "
            />
            <div
              className={`absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end px-4 py-2 bg-gradient-to-b from-transparent from-10% via-[#000000b4] via-70% to-[#000000f2] `}
            ></div>
          </div>
          <div
            className={`${
              supportsMasking ? "mt-[-4rem]" : "mt-[0rem]"
            } bg-gradient-to-b from-transparent from-0% via-[#000000b4] via-5% to-[#000000f2] py-4 flex flex-col gap-4 px-4 flex-1 rounded-b-xl`}
          >
            <div className="z-10 flex justify-between ">
              <div>
                <h2 className="text-base lg:text-lg">{eventData.title}</h2>
                <p className="text-[0.8rem]">
                  By{" "}
                  {organiserData && (
                    <Link
                      href={`/profile/${organiserData[0].username}`}
                      className="underline "
                    >
                      {organiserData[0].username}
                    </Link>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <CalendarDays className="self-center" />
              <div className="bg-[#031d2a] py-1 px-4 rounded-md">
                <span className="text-[0.8rem] text-[#28dfff]">Start</span>
                <p className="text-sm md:text-lg">{formattedStartTime}</p>
              </div>
              <div className="bg-[#031d2a] py-1 px-4 rounded-md">
                <span className="text-[0.8rem] text-[#28dfff]">End</span>
                <p className="text-sm md:text-lg">{formattedEndTime}</p>
              </div>
            </div>
            <div>
              <span className="text-[0.8rem] text-[#28dfff]">Location</span>
              <p>{eventData.location}</p>
            </div>
            <div>
              <span className="text-[0.8rem] text-[#28dfff]">Description</span>
              <pre className="text-wrap">{eventData.description}</pre>
            </div>

            <div>
              <span className="text-[0.8rem] text-[#28dfff]">
                People invited
              </span>
              <div className="border border-gray-800 rounded-md p-2 flex flex-col gap-1">
                {invitedFriends.map((person: any) => (
                  <div
                    key={person.id}
                    className="flex justify-between border border-gray-500 rounded-md p-2"
                  >
                    <Link href={`/profile/${person.username}`}>
                      <h1 className="font-bold">{person.full_name}</h1>
                      <p className="text-[0.8rem] text-[#28dfff]">
                        @{person.username}
                      </p>
                    </Link>
                    <div className="flex items-center">
                      <p className="bg-[#454545] rounded-md px-4 py-1 text-[0.8rem]">
                        {person.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
