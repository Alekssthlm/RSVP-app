// app/api/maps/[address]/route.js (Next.js 13+)
import { NextResponse } from "next/server"

export async function GET(request: { url: string | URL }) {
  const { searchParams } = new URL(request.url)

  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  // Your Google Maps API key
  const apiKey = process.env.MAPS_API
  const encodedAddress = encodeURIComponent(address)
  const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`

  return NextResponse.json({ mapUrl: url })
}
