import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Events app",
  description: "Create and manage events",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-[#582560] to-black min-h-screen`}
      >
        <main className="max-w-[40rem] mx-auto flex flex-col h-full">
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  )
}
