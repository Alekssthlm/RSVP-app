"use client"
import { useEffect, useState } from "react"
import AuthStateContext from "@/context/AuthStateContext"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { usePathname } from "next/navigation"

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>()
  const [userId, setUserId] = useState<string>()
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const pathname = usePathname()

  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession()

      if (session?.user) {
        setIsLoggedIn(true)
        setUser(session.user.user_metadata.username)
        setUserId(session.user.id)
      } else {
        setIsLoggedIn(false)
        setUser(undefined)
        setUserId(undefined)
      }
    }

    getCurrentUser()
  }, [pathname])

  return (
    <AuthStateContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, userId, setUserId }}
    >
      {children}
    </AuthStateContext.Provider>
  )
}

export default AuthProvider
