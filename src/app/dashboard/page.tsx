"use client"
import { Spinner } from "@/components/ui/spinner"
import AuthStateContext from "@/context/AuthStateContext"
import { useEventsPreviewListener } from "@/hooks/useEventsListener"
import { format } from "date-fns"
import Link from "next/link"
import { use, useContext, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import EventPreviewCards from "@/components/EventPreviewCards"

export default function page() {
  const { userId } = useContext(AuthStateContext)
  const { myEvents, otherEvents, loading } = useEventsPreviewListener(userId)

  return (
    <div className="text-white flex flex-grow">
      {!loading && (
        <div className="p-4 rounded-xl bg-[#00293f6c] flex-grow">
          <Tabs defaultValue="invitations" className="flex-grow flex flex-col">
            <TabsList className="self-center bg-black m-0 mb-8">
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="my_events" className="">
                My events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="invitations" className="flex flex-col gap-4">
              <div className="flex justify-between">
                <h1 className="text-[#ffffff] text-[1.8rem] font-bold">
                  Invitations
                </h1>
              </div>
              <div className="grid sm:grid-cols-2 sm:gap-2">
                <EventPreviewCards
                  eventType={otherEvents}
                  isMyEvents={false}
                  userId={userId}
                />
              </div>
            </TabsContent>
            <TabsContent value="my_events" className="flex flex-col gap-4">
              <div className="flex justify-between">
                <h1 className="text-[#ffffff] text-[1.8rem] font-bold">
                  My Events
                </h1>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <EventPreviewCards eventType={myEvents} isMyEvents={true} />
                <Link
                  href="/dashboard/create-event"
                  className="bg-[#00000086] py-2 px-4 rounded-[10px] flex justify-center items-center text-[0.9rem] aspect-video"
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
