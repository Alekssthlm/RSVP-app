import { supabaseServerClient } from "@/utils/supabaseServer"

export async function getUserImage(imagePath: string) {
  "use server"
  const supabase = await supabaseServerClient()
  const {
    data: { publicUrl: userLogo },
  } = supabase.storage.from("Images").getPublicUrl(imagePath)

  return userLogo
}
