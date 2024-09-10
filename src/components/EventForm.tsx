"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormInput from "@/components/CustomFormInput"
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "@/components/DatePicker"
import React, { useContext, useEffect, useRef, useState } from "react"
import AuthStateContext from "@/context/AuthStateContext"
import useGetFriends from "@/utils/getFriends"
import { Checkbox } from "@/components/ui/checkbox"
import { createEvent, editEvent, getEvent } from "@/utils/handleEvent"
import { useFriendshipsListener } from "@/hooks/useFriendshipsListener"

const formSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    start_time: z.date(),
    end_time: z.date(),
    location: z.string(),
    invited_friends: z
      .array(z.string())
      .min(1, { message: "At least one friend must be invited" }),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be later than start time",
    path: ["end_time"],
  })

interface Friendship {
  friend: string
  friendName: string
  friendUsername: string
}

// * START * //

export default function EventForm({
  mode,
  event_id,
  setIsEditing,
}: {
  mode: "edit" | "create"
  event_id?: string
  setIsEditing?: (value: boolean) => void
}) {
  const { userId } = useContext(AuthStateContext)
  const fetchFriendshipsData = useFriendshipsListener(userId)
  const [mapUrl, setMapUrl] = React.useState<string | null>(null)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const friendList = useGetFriends(userId, fetchFriendshipsData, "accepted")
  const [eventData, setEventData] = useState<z.infer<typeof formSchema> | null>(
    null
  )

  // Fetch event data if in edit mode
  useEffect(() => {
    if (mode === "edit" && event_id) {
      const fetchEventData = async () => {
        const data = await getEvent(event_id) // Fetch event by ID
        if (data) {
          setEventData({
            ...data,
            start_time: new Date(data.start_time),
            end_time: new Date(data.end_time),
          })
        }
      }
      fetchEventData()
    }
  }, [mode, event_id])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: eventData || {
      title: "",
      description: "",
      location: "",
      invited_friends: [],
    },
  })

  useEffect(() => {
    if (eventData) {
      form.reset(eventData)
      handleMapFetch()
    }
  }, [eventData])

  // FETCH MAP URL
  async function handleMapFetch() {
    const address = form.getValues("location")
    const response = await fetch(
      `/api/maps?address=${encodeURIComponent(address)}`,
      {
        method: "GET",
      }
    )
    const data = await response.json()
    setMapUrl(data.mapUrl)
  }

  // UPDATE MAP URL WHEN LOCATION CHANGES
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src =
        mapUrl || process.env.NEXT_PUBLIC_DEFAULT_MAP_LOCATION!
    }
  }, [mapUrl])

  // SUBMIT FORM
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const start_timeISO = new Date(values.start_time).toISOString()
    const end_timeISO = new Date(values.end_time).toISOString()

    const { title, description, location, invited_friends } = values
    const newValues = {
      organiser: userId,
      title,
      description,
      start_time: start_timeISO,
      end_time: end_timeISO,
      location,
      invited_friends,
    }

    if (mode === "edit" && event_id) {
      const result = await editEvent(event_id, newValues)
      setIsEditing && setIsEditing(false)
      router.refresh()
      console.log(result.message)

      return
    } else {
      const result = await createEvent(newValues)
      console.log(result.message)
    }
  }

  return (
    <section className="flex flex-col gap-4 text-white bg-[#00000086] md:rounded-md p-2 ">
      <button
        className="self-start text-[0.7rem]"
        onClick={() => router.push("/dashboard")}
      >
        ← BACK
      </button>
      <div>
        <h1>{mode === "edit" ? "Edit Event" : "Create Event"}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CustomFormInput form={form} title="Title" name="title" />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="text-black"
                      rows={10}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <DatePicker
                form={form}
                name="start_time"
                label="Start:"
                placeholder="Pick a starting time"
                mode="start_time"
              />
              <DatePicker
                form={form}
                name="end_time"
                label="End:"
                placeholder="Pick a time"
                mode="end_time"
              />
            </div>
            <div className="flex flex-col gap-2">
              <CustomFormInput
                form={form}
                title="Location"
                name="location"
                onBlur={handleMapFetch}
                onKeyUp={handleMapFetch}
              />
              <iframe
                ref={iframeRef}
                width="100%"
                height="200"
                className="rounded-md"
                loading="lazy"
                onLoad={() => console.log("loaded")}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl ?? undefined}
              ></iframe>
            </div>
            <FormField
              control={form.control}
              name="invited_friends"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Invite</FormLabel>
                    <FormDescription>
                      Select the friends you want to invite
                    </FormDescription>
                  </div>
                  {friendList.map((friendship: Friendship) => (
                    <FormField
                      key={friendship.friend}
                      control={form.control}
                      name="invited_friends"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={friendship.friend}
                            className="flex flex-row items-start space-x-3 space-y-0 border border-gray-500 rounded-md p-2"
                          >
                            <FormControl>
                              <Checkbox
                                className="border-white"
                                checked={field.value?.includes(
                                  friendship.friend
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        friendship.friend,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== friendship.friend
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal flex flex-col gap-1">
                              <h1 className="font-bold">
                                {friendship.friendName}
                              </h1>
                              <p className="text-[0.8rem] text-[#28dfff]">
                                @{friendship.friendUsername}
                              </p>
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "edit" ? (
              <div className="flex gap-4 justify-end">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing && setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button type="submit">Submit</Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  )
}
