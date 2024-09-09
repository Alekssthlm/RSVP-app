import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "../utils/supabaseClient"

export function useUserProfileImage(imagePath: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  if (!imagePath) {
    return { imageUrl: null, loading: false, error: "Image path is required" }
  }

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = supabase.storage
          .from("Images")
          .getPublicUrl(imagePath)

        if (error) {
          console.error("Error getting public URL:", error)
          setError("Failed to fetch image URL")
          setImageUrl(null)
        } else {
          setImageUrl(data.publicUrl)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("Unexpected error occurred")
        setImageUrl(null)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [imagePath])

  return { imageUrl, loading, error }
}
