import getProfileData from "@/actions/getProfileData"
import getUserData from "@/actions/getUserData"
import { getUserImage } from "@/actions/getUserImage"
import updateUserSkill from "@/actions/updateUserSkill"
import SendFriendRequestButton from "@/components/SendFriendRequestButton"
import { redirect } from "next/navigation"

interface Params {
  username: string
}

export default async function Profile({
  params: { username },
}: {
  params: Params
}) {
  const currentUser = await getUserData()
  const currentUsername = currentUser?.username
  const currentUserId = currentUser?.id
  const currentUserFullname = currentUser?.full_name
  const currentProfile = await getProfileData(username)
  const currentProfileUsername = currentProfile?.username
  const currentProfileId = currentProfile?.id
  const currentProfileFullname = currentProfile?.full_name
  const isLoggedInUser = currentUsername === username

  const userLogo = await getUserImage(currentProfile?.logo!)

  if (!currentUser) {
    return redirect("/login")
  }

  if (!currentProfile) {
    return (
      <div className="container mx-auto py-8">
        <div className="col-span-4 sm:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-xl font-bold">Profile not found</h1>
          </div>
        </div>
      </div>
    )
  }

  // const handleAddSkill = async (formData: FormData) => {
  //   "use server"

  //   const skill = formData.get("skill")

  //   if (!skill) {
  //     return
  //   }

  //   const [formResponse, formError] = await updateUserSkill(
  //     currentProfile?.id!,
  //     skill as string
  //   )

  //   revalidatePath("/profile")
  // }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={userLogo}
            className="w-32 h-32 bg-gray-300 object-cover rounded-full mb-4 shrink-0"
            alt={""}
          />
          <h1 className="text-xl font-bold">{currentProfile?.full_name}</h1>
          <p className="text-gray-700">@{currentProfile?.username}</p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {isLoggedInUser ? (
              <a
                href="#"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Edit Profile
              </a>
            ) : (
              <>
                <SendFriendRequestButton
                  currentUserId={currentUserId}
                  currentUsername={currentUsername}
                  currentUserFullname={currentUserFullname}
                  currentProfile={currentProfileId}
                  currentProfileUsername={currentProfileUsername}
                  currentProfileFullname={currentProfileFullname}
                />
                <a
                  href="#"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Message
                </a>
              </>
            )}
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300" />
      </div>
    </div>
  )
}
