import { getOrganiserFromEventServer } from "@/actions/getOrganiserFromEventServer"
import getPeopleFromEventServer from "@/actions/getPeopleFromEventServer"
import getUserData from "@/actions/getUserData"
import EventDisplay from "@/components/EventDisplay"
import { getEvent } from "@/utils/handleEvent"

interface Params {
  event_id: string
}

export default async function page({ params }: { params: Params }) {
  const { event_id } = params
  const getAuthUser = await getUserData()
  const authUserId = getAuthUser!.id
  const eventData = await getEvent(event_id)
  const authIsEventOrganiser = eventData.organiser_id === authUserId

  const invitedFriends = await getPeopleFromEventServer(
    event_id,
    eventData.invited_friends
  )

  const organiserData = await getOrganiserFromEventServer(
    eventData.organiser_id
  )

  return (
    <EventDisplay
      params={params}
      eventData={eventData}
      authUserId={authUserId}
      authIsEventOrganiser={authIsEventOrganiser}
      invitedFriends={invitedFriends}
      organiserData={organiserData}
    />
  )
}
