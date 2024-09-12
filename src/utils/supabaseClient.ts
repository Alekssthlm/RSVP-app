import { createBrowserClient } from "@supabase/ssr"

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
  }
  return supabaseBrowserClient
}
