import getUserData from "@/actions/getUserData"
import UserCard from "@/components/UserCard"
import { redirect } from "next/navigation"

export default async function Home() {
  const userData = await getUserData()
  if (userData) redirect("/dashboard")

  return (
    <div className="grid place-content-center h-[80vh]">
      <h1>HOME</h1>
      <UserCard userData={userData} />
    </div>
  )
}
