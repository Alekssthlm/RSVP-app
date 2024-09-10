"use client"
import AuthStateContext from "@/context/AuthStateContext"
import { CircleUserRound, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"
import { useContext } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function Sidebar({ avatar_url }: { avatar_url: string }) {
  const { isLoggedIn, setIsLoggedIn, user, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  const router = useRouter()
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const pathname = usePathname()

  async function signOut() {
    const { error } = await supabaseBrowserClient.auth.signOut()
    if (!error) {
      setIsLoggedIn(false)
      setUser(undefined)
      setUserId(undefined)
    }
    router.push("/")
    router.refresh()
  }
  return (
    <aside className="flex-1 hidden md:block text-white py-2 ">
      <nav className="flex flex-col h-full gap-8 bg-[#00436788] rounded-xl pt-4">
        <div className="flex gap-4 px-4 items-center">
          <Avatar>
            <AvatarImage src={avatar_url} width={40} height={40} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Link
            href={`/profile/${user}`}
            className="block rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-[#28dfff]"
          >
            {user}
          </Link>
        </div>
        <div>
          <CustomLink href={`/profile/${user}`} pathname={pathname}>
            <CircleUserRound />
            <span>Profile</span>
          </CustomLink>

          <CustomLink href={`/dashboard`} pathname={pathname}>
            <LayoutDashboard />
            <span>Events</span>
          </CustomLink>

          <CustomLink href={`/friends`} pathname={pathname}>
            <Users />
            <span>Friends</span>
          </CustomLink>
        </div>
        <div className="flex flex-1 justify-center items-end">
          <button
            onClick={signOut}
            className="text-red-600 bg-none hover:bg-[#0000008f] flex-grow py-4"
          >
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  )
}

function CustomLink({
  href,
  pathname,
  children,
}: {
  href: string
  pathname?: string
  children: React.ReactNode
}) {
  const isActive = pathname?.startsWith(href)
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded hover:bg-gray-100 md:hover:bg-[#0000008f] md:border-0 text-[1.5rem] text-white px-6 py-4 ${
        isActive && "bg-[#0000008f]"
      } `}
    >
      {children}
    </Link>
  )
}
