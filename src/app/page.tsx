import getUserData from "@/actions/getUserData"
import { redirect } from "next/navigation"
import HomepageHero from "@/components/HomepageHero"

export default async function Home() {
  const userData = await getUserData()
  if (userData) redirect("/dashboard")

  return <HomepageHero />
}
