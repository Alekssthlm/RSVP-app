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

interface EventTileProps {
  event: Event
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
        return (
          <EventTile
            key={event.id}
            event={event}
            isMyEvents={isMyEvents}
            userId={userId}
          />
        )
      })}
    </>
  )
}

function EventTile({ event, isMyEvents, userId }: EventTileProps) {
  const formattedStartTime = format(
    new Date(event.start_time),
    "dd/MMM/yy HH:mm"
  )

  const backgroundImage = [
    "/confetti-1.jpg",
    "/confetti-2.jpg",
    "/confetti-3.jpg",
  ]
  const randomImage =
    backgroundImage[Math.floor(Math.random() * backgroundImage.length)]

  const invitationData = useInvitationData(event.id, userId!, isMyEvents)

  return (
    <Link
      key={event.id}
      href={
        isMyEvents
          ? `/dashboard/my-events/${event.id}?bg=${randomImage}`
          : `/dashboard/invitations/${event.id}?bg=${randomImage}`
      }
      className="bg-[#00000086] aspect-video rounded-[10px] relative overflow-hidden"
    >
      <img src={randomImage} alt="background image" />
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end px-4 py-2 bg-gradient-to-b from-transparent from-40% via-[#000000f9] via-100% to-[#000000]">
        {!isMyEvents && (
          <p className="border border-gray-500 bg-[#000000] rounded-md px-4 py-1 text-[0.8rem] text-[#28dfff] self-end absolute top-4 right-4">
            {invitationData[0]?.status || "Loading..."}
          </p>
        )}
        <h2>{event.title}</h2>
        <p className="text-[0.8rem]">{event.location}</p>
        <div className="flex justify-between gap-2 text-[0.8rem]">
          <div>
            <p>{formattedStartTime}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
