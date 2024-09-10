import getUserData from "@/actions/getUserData"
import { redirect } from "next/navigation"

export default async function Home() {
  const userData = await getUserData()
  if (userData) redirect("/dashboard")

  return (
    <div className="flex flex-grow text-white justify-center items-center">
      <h1>HOME</h1>
    </div>
  )
}
