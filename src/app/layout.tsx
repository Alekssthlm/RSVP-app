import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/providers/AuthProvider"
import getUserData from "@/actions/getUserData"
import Sidebar from "@/components/Sidebar"
import { getUserImage } from "@/actions/getUserImage"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Events app",
  description: "Create and manage events",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUserData()
  const AVATAR = "/profile-image.png"
  const public_image_url =
    (user && (await getUserImage(user.profile_image))) || AVATAR

  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col h-dvh bg-[#021b26] mx-auto`}
      >
        <AuthProvider>
          <header>
            <Navbar user={user} avatar_url={public_image_url} />
          </header>
          <div className="flex flex-grow h-full overflow-hidden">
            {user && <Sidebar avatar_url={public_image_url} />}
            <main className="flex-[3] flex flex-col overflow-y-auto relative">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

{
  /* bg-gradient-to-br from-green-400 via-[#009aee] via-0% to-black */
}
