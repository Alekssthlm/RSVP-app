import { getSupabaseBrowserClient } from "@/utils/supabaseClient"

export async function deleteUserImage(path: string) {
  const supabaseBrowserClient = getSupabaseBrowserClient()

  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession()

  // GET USER FROM SESSION WHEN ON CLIENT SIDE
  const user = session?.user

  if (!user) return { success: false, message: "User not found" }

  const { error: deleteImagePathError } = await supabaseBrowserClient
    .from("users")
    .update({
      profile_image: null,
    })
    .eq("id", user.id)

  if (deleteImagePathError) {
    console.error("Update user profile error", deleteImagePathError)
    return { success: false, message: "Failed to update user profile" }
  }

  const { data, error } = await supabaseBrowserClient.storage
    .from("Images")
    .remove([`${path}`])

  if (error) {
    console.error("Error deleting image:", error.message)
    return { success: false, message: "Failed to delete image" }
  }

  return { success: true, message: "Image deleted successfully" }
}
