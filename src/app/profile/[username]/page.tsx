import getProfileData from "@/actions/getProfileData"
import getUserData from "@/actions/getUserData"
import { getUserImage } from "@/actions/getUserImage"
import updateUserSkill from "@/actions/updateUserSkill"
import { EditProfileModal } from "@/components/EditProfileModal"
import SendFriendRequestButton from "@/components/SendFriendRequestButton"
import { MessageSquareMore } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"

interface Params {
  username: string
}

const AVATAR = "/profile-image.png"

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

  const public_image_url =
    (await getUserImage(currentProfile?.profile_image)) || AVATAR

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

  return (
    <div className="container flex justify-center flex-grow bg-[#5454544b] py-8 rounded-xl">
      <div className=" flex justify-center items-center shadow rounded-lg p-6 max-w-[40rem] flex-grow">
        <div className="flex flex-col items-center gap-8">
          <div className="w-[30vmin] h-[30vmin] max-w-[15rem] max-h-[15rem]">
            <Image
              src={public_image_url}
              width={300}
              height={300}
              className="w-full h-full bg-gray-500 object-cover rounded-full"
              alt={""}
            />
          </div>
          <div className="flex flex-col flex-[2] gap-8">
            <div className="flex flex-col items-center">
              <h1 className="text-[1.5rem] font-bold text-white">
                {currentProfile?.full_name}
              </h1>
              <p className="text-[#28dfff]">@{currentProfile?.username}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="italic text-white">{currentProfile?.bio}</p>
            </div>
            <div className="flex justify-center flex-wrap gap-4">
              {isLoggedInUser ? (
                currentProfile && (
                  <EditProfileModal
                    currentProfile={currentProfile}
                    public_image_url={public_image_url}
                  />
                )
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
