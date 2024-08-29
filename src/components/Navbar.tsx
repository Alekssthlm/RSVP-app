"use client"

import Link from "next/link"
import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { useRouter } from "next/navigation"
import AuthStateContext from "@/context/AuthStateContext"
import { useFriendships } from "@/hooks/useFriendships"

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  const router = useRouter()
  const supabaseBrowserClient = getSupabaseBrowserClient()

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
    <nav className="text-gray-300 border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 border p-2 rounded-sm"
        >
          Home
        </Link>

        <div className="flex items-center space-x-5 w-auto">
          {isLoggedIn && (
            <>
              <Link
                href={`/profile/${user}`}
                className="block rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Profile
              </Link>
              <Link
                href={`/dashboard`}
                className="block rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Dashboard
              </Link>

              <Link
                href={`/friends`}
                className="block rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
              >
                Friends
              </Link>

              <Button onClick={signOut} variant="destructive">
                Sign out
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link href="/signup">SIGN UP</Link>
              <Link href="/login">LOG IN</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
