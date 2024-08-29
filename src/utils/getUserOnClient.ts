import { supabaseBrowserClient } from "./supabaseClient"

export default async function getUserOnClient() {
  await supabaseBrowserClient.auth.refreshSession()
  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession()

  const user = session?.user

  return user
}
