import Link from "next/link"

export default function page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex">
        <Link
          href="/dashboard/create-event"
          className="bg-gray-200 py-2 px-4 rounded-full"
        >
          New Event{" "}
        </Link>
      </div>
    </div>
  )
}
