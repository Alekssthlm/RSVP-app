import { User } from "@/types/app"
import { supabaseServerClient } from "@/utils/supabaseServer"

interface GetProfileDataProps {
  username: string
}

const getProfileData = async (username: string) => {
  "use server" //added
  const supabase = await supabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)

  if (error) {
    console.log(error, "error from getUserData")
    return null
  }

  return data ? data[0] : null
}

export default getProfileData
