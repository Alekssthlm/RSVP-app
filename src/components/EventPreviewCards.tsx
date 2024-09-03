import { useInvitationData } from "@/hooks/useInvitationData"
import { format } from "date-fns"
import Link from "next/link"

interface Event {
  id: string
  title: string
  location: string
  start_time: string
  end_time: string
}

interface EventPreviewCardProps {
  eventType: Event[]
  isMyEvents: boolean
  userId?: string
}

export default function EventPreviewCards({
  eventType,
  isMyEvents,
  userId,
}: EventPreviewCardProps) {
  return (
    <>
      {eventType.map((event) => {
        const formattedStartTime = format(
          new Date(event.start_time),
          "dd/MMM/yy HH:mm"
        )
        const formattedEndTime = format(
          new Date(event.end_time),
          "dd/MMM/yy HH:mm"
        )

        const eventInvitationData =
          !isMyEvents && userId ? useInvitationData(event.id, userId!) : [] // Add a check for userId to avoid passing undefined to useInvitationData when logging out

        return (
          <Link
            key={event.id}
            href={
              isMyEvents
                ? `/dashboard/my-events/${event.id}`
                : `/dashboard/invitations/${event.id}`
            }
            className="bg-[#00000086] rounded-[10px] relative overflow-hidden"
          >
            <div className="h-[180px] w-auto bg-[#535353]"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end px-4 py-2 bg-gradient-to-b from-transparent from-10% via-[#000000b4] via-90% to-[#000000f2]">
              <h2>{event.title}</h2>
              <p className="text-[0.8rem]">{event.location}</p>
              <div className="flex justify-between gap-2 text-[0.8rem]">
                <div>
                  <p>{formattedStartTime}</p>
                </div>
                {!isMyEvents && (
                  <p className="border border-gray-500 rounded-md px-4 py-1 text-[0.8rem]">
                    {eventInvitationData[0]?.status || "Loading..."}
                  </p>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}
