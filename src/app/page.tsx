import getUserData from "@/actions/getUserData"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  const userData = await getUserData()
  if (userData) redirect("/dashboard")

  return (
    <section className="flex-grow flex items-center justify-center">
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center gap-4 p-4">
          <div className="flex flex-col text-center md:text-left gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
              Plan, Share, <span className="text-[#28dfff]">Celebrate</span>
            </h1>
            <p className="max-w-[600px]  text-gray-400 md:text-xl dark:text-gray-400">
              Create memorable gatherings and effortlessly manage RSVPs all in
              one place.
            </p>
          </div>
          <div className="flex justify-center md:justify-start">
            <ul className="grid gap-2 py-4 text-white">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 " />
                <span className="text-sm md:text-base">
                  Easily create and customize events
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm md:text-base">
                  Track RSVPs and manage guest lists
                </span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col  gap-2 min-[400px]:flex-row">
            <Link
              href="/login"
              passHref
              className="flex justify-center md:justify-start"
            >
              <Button
                size="lg"
                className="bg-[#28dfff] font-bold text-[#022930]"
              >
                🎉 Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
