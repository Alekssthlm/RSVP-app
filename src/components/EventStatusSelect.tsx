"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateSelectStatus } from "@/utils/handleEvent"
import { useInvitationData } from "@/hooks/useInvitationData"
import { useRouter } from "next/navigation"

export default function EventStatusSelect({
  userId,
  event_id,
}: {
  userId: string
  event_id: string
}) {
  const invitationData = useInvitationData(event_id, userId, true)
  const router = useRouter()

  async function handleStatusChange(value: string) {
    updateSelectStatus(invitationData[0].id, value)
    router.refresh()
  }

  return (
    <div>
      <Select
        value={
          invitationData.length > 0 && invitationData[0].status
            ? invitationData[0].status
            : "PENDING"
        }
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="flex gap-2 bg-black border border-gray-500 rounded-md px-4 py-1 text-[0.8rem] self-start">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING" disabled>
            PENDING
          </SelectItem>
          <SelectItem value="GOING">GOING</SelectItem>
          <SelectItem value="NOT GOING">NOT GOING</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
