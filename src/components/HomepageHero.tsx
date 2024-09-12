"use client"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users } from "lucide-react"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

import Link from "next/link"

export default function HomepageHero() {
  const titleRef = useRef(null)

  useGSAP(() => {
    gsap.from("#title-1", { x: -25, opacity: 0, duration: 1 })
    gsap.from("#title-2", { opacity: 0, x: -25, duration: 1, delay: 0.5 })
    gsap.from("#title-3", { opacity: 0, x: -25, duration: 1, delay: 1 })
    gsap.from("#description", { opacity: 0, y: 25, duration: 1.5, delay: 1.5 })
    gsap.from("#bullet-points", { opacity: 0, y: 25, duration: 1.5, delay: 2 })
    gsap.from("#get-started", { opacity: 0, y: 25, duration: 1.5, delay: 2.5 })
  })
  return (
    <section className="flex-grow flex items-center justify-center">
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center gap-4 p-4">
          <div className="flex flex-col text-center md:text-left gap-2">
            <h1
              ref={titleRef}
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white"
            >
              <span id="title-1" className="inline-block">
                Plan.
              </span>{" "}
              <span id="title-2" className="inline-block">
                Share.
              </span>{" "}
              <span id="title-3" className="text-[#28dfff] inline-block">
                Celebrate!
              </span>
            </h1>
            <p
              id="description"
              className="max-w-[600px]  text-gray-400 md:text-xl dark:text-gray-400"
            >
              Create memorable gatherings and effortlessly manage RSVPs all in
              one place.
            </p>
          </div>
          <div
            id="bullet-points"
            className="flex justify-center md:justify-start"
          >
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
                id="get-started"
                className="bg-[#28dfff] hover:bg-[#77ebff] font-bold text-[#022930]"
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
