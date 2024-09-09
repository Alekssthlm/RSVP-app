"use client"
import AuthStateContext from "@/context/AuthStateContext"
import { CircleUserRound, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"
import { useContext } from "react"

export default function Sidebar() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  return (
    <aside className="flex-1 hidden md:block  bg-[#0000008f]  py-4">
      <nav className="flex flex-col h-full">
        <CustomLink href={`/profile/${user}`}>
          <CircleUserRound />
          <span>Profile</span>
        </CustomLink>

        <CustomLink href={`/dashboard`}>
          <LayoutDashboard />
          <span>Events</span>
        </CustomLink>

        <CustomLink href={`/friends`}>
          <Users />
          <span>Friends</span>
        </CustomLink>
      </nav>
    </aside>
  )
}

function CustomLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded hover:bg-gray-100 md:hover:bg-[#0000008f] md:border-0 text-[1.5rem] text-white px-6 py-4"
    >
      {children}
    </Link>
  )
}
