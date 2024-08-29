import getUserData from "@/actions/getUserData"
import { getUserImage } from "@/actions/getUserImage"
import { redirect } from "next/navigation"

const Profile = async () => {
  const userData = await getUserData()
  const currentUsername = userData?.username

  if (!userData) {
    return redirect("/login")
  }

  redirect(`/profile/${currentUsername}`)

  return (
    <div>
      <h1>Redirecting</h1>
    </div>
  )
}

export default Profile
