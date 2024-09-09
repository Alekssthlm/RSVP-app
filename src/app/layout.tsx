import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/providers/AuthProvider"
import getUserData from "@/actions/getUserData"
import Sidebar from "@/components/Sidebar"

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

  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col h-dvh bg-gradient-to-br from-green-400 via-[#004468] via-0% to-black`}
      >
        <AuthProvider>
          <header className="h-[5rem]">
            <Navbar />
          </header>
          <div className="flex flex-grow h-full overflow-hidden">
            {user && <Sidebar />}
            <main className="flex-[4] flex flex-col overflow-y-auto relative bg-[#0000008f] p-4">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
