import { getSupabaseBrowserClient } from "./supabaseClient"

export default async function getUserOnClient() {
  const supabaseBrowserClient = getSupabaseBrowserClient()
  await supabaseBrowserClient.auth.refreshSession()
  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession()

  const user = session?.user

  return user
}
