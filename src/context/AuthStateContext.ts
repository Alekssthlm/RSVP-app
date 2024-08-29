import { createContext } from "react"

interface AuthStateContext {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  user: any
  setUser: (value: any) => void
  userId: any
  setUserId: (value: any) => void
}

const AuthStateContext = createContext<AuthStateContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => null,
  user: null,
  setUser: () => null,
  userId: null,
  setUserId: () => null,
})

export default AuthStateContext
