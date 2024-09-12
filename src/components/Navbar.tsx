"use client"
import {
  CircleUserRound,
  LayoutDashboard,
  Menu,
  User,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useContext, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import AuthStateContext from "@/context/AuthStateContext"
import { set } from "date-fns"

const Navbar = ({ user, avatar_url }: { user: any; avatar_url: string }) => {
  const { isLoggedIn, setIsLoggedIn, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  const router = useRouter()
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  const pathname = usePathname()

  async function signOut() {
    const { error } = await supabaseBrowserClient.auth.signOut()
    if (!error) {
      setIsLoggedIn(false)
      setUser(undefined)
      setUserId(undefined)
      setIsOpen(false)
    }
    router.push("/")
    router.refresh()
  }

  if (!user) {
    return (
      <nav className="text-white sm:text-xl h-[4rem] ">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4 ">
          <Link href="/" className="text-2xl font-bold p-2 text-[#28dfff]">
            RSVP
          </Link>

          <div className="flex items-center space-x-5 w-auto">
            <>
              <Link href="/signup">SIGN UP</Link>
              <Link href="/login">LOG IN</Link>
            </>
          </div>
        </div>
      </nav>
    )
  }
  return (
    <nav className=" text-white sm:text-xl h-[4rem] md:hidden">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4 ">
        <div>
          <div className="">
            <button
              className="p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>

            <div
              id="mobile-menu"
              className={`absolute flex flex-col top-0 left-0 right-0 bottom-0 bg-[#000f17f2] text-white shadow-lg py-1 z-50 ${
                isOpen ? "block" : "hidden"
              } transition-all duration-300 ease-in-out`}
              aria-hidden={!isOpen}
            >
              <div className="flex justify-end p-2">
                <button
                  className="p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={toggleMenu}
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  href={`/profile/${user.username}`}
                  prefetch={true}
                  className={`flex items-center gap-2 px-4 py-2 text-[1.2rem] hover:bg-gray-100  ${
                    pathname?.startsWith(`/profile/${user.username}`) &&
                    "text-[#28dfff]"
                  }`}
                  onClick={toggleMenu}
                >
                  <CircleUserRound />
                  Profile
                </Link>
                <Link
                  href={`/dashboard`}
                  prefetch={true}
                  className={`flex items-center gap-2 px-4 py-2 text-[1.2rem] hover:bg-gray-100 ${
                    pathname?.startsWith(`/dashboard`) && "text-[#28dfff]"
                  }`}
                  onClick={toggleMenu}
                >
                  <LayoutDashboard />
                  Events
                </Link>
                <Link
                  href={`/friends`}
                  prefetch={true}
                  className={`flex items-center gap-2 px-4 py-2 text-[1.2rem] hover:bg-gray-100 ${
                    pathname?.startsWith(`/friends`) && "text-[#28dfff]"
                  }`}
                  onClick={toggleMenu}
                >
                  <Users />
                  Friends
                </Link>
              </div>
              <div className="flex flex-1 justify-center items-end">
                <button
                  onClick={signOut}
                  className="text-red-600 bg-none hover:bg-[#0000008f] flex-grow py-4"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <Link href="/" className="text-2xl font-bold p-2 text-[#28dfff]">
          RSVP
        </Link>
        <Link href={`/profile/${user.username}`}>
          <Avatar>
            <AvatarImage src={avatar_url} className="bg-gray-500" />
            <AvatarFallback className="bg-gray-700">
              <User />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
