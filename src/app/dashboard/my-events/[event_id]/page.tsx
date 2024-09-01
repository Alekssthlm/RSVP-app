"use client"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import { getEvent } from "@/utils/handleEvent"
import {
  getOrganiserFromEvent,
  getPeopleFromEvent,
} from "@/utils/getPeopleFromEvent"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Params {
  event_id: string
}

export default function Page({ params: { event_id } }: { params: Params }) {
  const [supportsMasking, setSupportsMasking] = useState(true)
  const [eventData, setEventData] = useState<any>({})
  const [peopleInvited, setPeopleInvited] = useState<any>([])
  const [organiser, setOrganiser] = useState<any>()
  const router = useRouter()

  useEffect(() => {
    const fetchEventData = async () => {
      const data = await getEvent(event_id)
      setEventData(data)
    }
    fetchEventData()
  }, [])

  useEffect(() => {
    if (!eventData.invited_friends || !eventData.organiser_id) return
    async function getPeople() {
      const allPeopleInvited = await getPeopleFromEvent(
        eventData.invited_friends
      )

      const organiser = await getOrganiserFromEvent(eventData.organiser_id)
      setOrganiser(organiser)

      setPeopleInvited(allPeopleInvited)
    }

    getPeople()
  }, [eventData])
  console.log(organiser, "organiser")

  // useEffect(() => {
  //   const testMaskSupport = () => {
  //     const testDiv = document.createElement("div")
  //     testDiv.style.cssText =
  //       "-webkit-mask-image: linear-gradient(black, transparent); mask-image: linear-gradient(black, transparent);"
  //     document.body.appendChild(testDiv)
  //     const isSupported = window.getComputedStyle(testDiv).maskImage !== "none"
  //     document.body.removeChild(testDiv)
  //     return isSupported
  //   }

  //   setSupportsMasking(testMaskSupport())
  // }, [])

  const formattedStartTime = eventData?.start_time
    ? format(new Date(eventData.start_time), "dd MMM yy - HH:mm")
    : ""
  const formattedEndTime = eventData?.end_time
    ? format(new Date(eventData.end_time), "dd MMM yy - HH:mm")
    : ""

  return (
    <section className="flex flex-col gap-4 text-white bg-[#00000086] rounded-md p-2">
      <button
        className="self-start text-[0.7rem]"
        onClick={() => router.push("/dashboard")}
      >
        ← BACK
      </button>
      <div>
        <h1>Event</h1>
        <div>
          <div className="">
            <div
              className={`h-[15rem] relative z-0 ${
                supportsMasking ? "mask1" : ""
              } `}
            >
              <img
                src="/image-placeholder.webp"
                alt="Random"
                className="w-full h-full object-cover relative z-0 select-none"
              />
            </div>
            <div
              className={`${
                supportsMasking ? "mt-[-4rem]" : "mt-[0rem]"
              } bg-gradient-to-b from-transparent from-0% via-[#000000b4] via-20% to-[#000000f2] py-4 flex flex-col gap-4 px-4 `}
            >
              <div className="z-10">
                <h2>{eventData.title}</h2>
                <p className="text-[0.8rem]">
                  By{" "}
                  {organiser && (
                    <Link
                      href={`/profile/${organiser[0].username}`}
                      className="underline "
                    >
                      {organiser[0].username}
                    </Link>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <CalendarDays className="self-center" />
                <div>
                  <span className="text-[0.8rem] text-[#28dfff]">Start</span>
                  <p>{formattedStartTime}</p>
                </div>
                <div>
                  <span className="text-[0.8rem] text-[#28dfff]">End</span>
                  <p>{formattedEndTime}</p>
                </div>
              </div>
              <div>
                <span className="text-[0.8rem] text-[#28dfff]">Location</span>
                <p>{eventData.location}</p>
              </div>
              <div>
                <span className="text-[0.8rem] text-[#28dfff]">
                  Description
                </span>
                <pre className="text-wrap">{eventData.description}</pre>
              </div>

              <div>
                <span className="text-[0.8rem] text-[#28dfff]">
                  People invited
                </span>
                {peopleInvited.map((person) => (
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
                      <p className="border border-gray-500 rounded-md px-4 py-1 text-[0.8rem]">
                        {person.status}
                      </p>
                      {/* <Select defaultValue="pending">
                        <SelectTrigger className="w-[180px] bg-black text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">pending</SelectItem>
                          <SelectItem value="going">going</SelectItem>
                          <SelectItem value="not going">not going</SelectItem>
                        </SelectContent>
                      </Select> */}
                    </div>
                  </div>
                ))}
              </div>
              <p>{eventData.created_at}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
