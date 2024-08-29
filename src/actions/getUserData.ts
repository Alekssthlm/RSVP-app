import { User } from "@/types/app"
import { supabaseServerClient } from "@/utils/supabaseServer"

const getUserData = async (): Promise<User | null> => {
  "use server" //added
  const supabase = await supabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    ;`No user found`
    return null
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)

  if (error) {
    console.log(error, "error from getUserData")
    return null
  }

  return data ? data[0] : null
}

export default getUserData
