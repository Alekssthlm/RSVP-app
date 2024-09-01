"use client"
import { Spinner } from "@/components/ui/spinner"
import AuthStateContext from "@/context/AuthStateContext"
import { useEventsListener } from "@/hooks/useEventsListener"
import { format } from "date-fns"
import Link from "next/link"
import { use, useContext, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function page() {
  const { userId } = useContext(AuthStateContext)
  const { myEvents, otherEvents, loading } = useEventsListener(userId)
  // const loading = false
  // const myEvents = [
  //   {
  //     id: "1",
  //     title: "Event One",
  //     description: "Description for Event One",
  //     start_time: "2023-10-01T10:00:00Z",
  //     end_time: "2023-10-01T12:00:00Z",
  //     location: "Main Street 123",
  //   },
  //   {
  //     id: "2",
  //     title: "Event Two",
  //     description: "Description for Event Two",
  //     start_time: "2023-10-02T14:00:00Z",
  //     end_time: "2023-10-02T16:00:00Z",
  //     location: "Stadshusgatan 2",
  //   },
  //   {
  //     id: "3",
  //     title: "Event Three",
  //     description: "Description for Event Three",
  //     start_time: "2023-10-03T09:00:00Z",
  //     end_time: "2023-10-03T11:00:00Z",
  //     location: "Kungsgatan 1",
  //   },
  // ]

  return (
    <div className="text-white">
      {loading ? (
        <Spinner show={true} />
      ) : (
        <div>
          <Tabs defaultValue="my_events" className="">
            <TabsList>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="my_events">My events</TabsTrigger>
            </TabsList>
            <TabsContent value="invitations">
              <div className="flex justify-between">
                <h1 className="text-[#ffffff] text-[1.5rem] font-bold">
                  Invitations
                </h1>
              </div>
            </TabsContent>
            <TabsContent value="my_events" className="flex flex-col gap-4">
              <div className="flex justify-between">
                <h1 className="text-[#ffffff] text-[1.5rem] font-bold">
                  My Events
                </h1>
              </div>
              <div className="grid sm:grid-cols-2 sm:gap-2">
                {myEvents.map((event) => {
                  const formattedStartTime = format(
                    new Date(event.start_time),
                    "dd/MMM/yy HH:mm"
                  )
                  const formattedEndTime = format(
                    new Date(event.end_time),
                    "dd/MMM/yy HH:mm"
                  )

                  return (
                    <Link
                      key={event.id}
                      href={`/dashboard/my-events/${event.id}`}
                      className="bg-[#00000086] rounded-[10px] relative overflow-hidden"
                    >
                      <div className="h-[180px] w-auto bg-[#535353]"></div>
                      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end px-4 py-2 bg-gradient-to-b from-transparent from-10% via-[#000000b4] via-90% to-[#000000f2]">
                        <h2>{event.title}</h2>
                        <p className="text-[0.8rem]">{event.location}</p>
                        <div className="flex justify-between gap-2 text-[0.8rem]">
                          <div>
                            <p>Start: {formattedStartTime}</p>
                          </div>
                          <p>End: {formattedEndTime}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
                <Link
                  href="/dashboard/create-event"
                  className="bg-[#00000086] py-2 px-4 rounded-[10px] flex justify-center items-center text-[0.9rem] h-[180px] w-auto"
                >
                  <Plus /> Create Event
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
