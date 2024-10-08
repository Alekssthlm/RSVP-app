"use client"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { v4 as uuid } from "uuid"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { useRouter } from "next/navigation"
import { deleteUserImage } from "@/utils/deleteUserImage"
import { MinusCircle } from "lucide-react"

type CurrentProfile = {
  id: string
  username: string
  full_name: string
  email: string
  profile_image: string
  bio: string
}

const formSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  bio: z.string().max(150, "Bio must be 150 characters or less"),
  image: z
    .custom((value) => {
      return value instanceof File || value === undefined || value === null
    }, "Invalid file format")
    .optional(),
})

export function EditProfileModal({
  currentProfile,
  public_image_url,
}: {
  currentProfile: CurrentProfile
  public_image_url: string
}) {
  const { id, username, full_name, email, profile_image, bio } = currentProfile
  const [bioLength, setBioLength] = useState(bio.length)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabaseBrowserClient = getSupabaseBrowserClient()
  const maxBioLength = 150
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name,
      bio,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { full_name, bio, image } = values
    const unique_id = uuid()
    const supabase = getSupabaseBrowserClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // GET USER FROM SESSION WHEN ON CLIENT SIDE
    const user = session?.user
    if (!user) return

    try {
      if (!image) {
        // // UPDATE USER PROFILE WITH NEW VALUES
        const { error: updateUserProfileError } = await supabase
          .from("users")
          .update({
            full_name,
            bio,
          })
          .eq("id", user.id)

        if (updateUserProfileError) {
          console.error("Update user profile error", updateUserProfileError)
          return
        }
      } else {
        const imageFile = image as File
        // DEFINE UPLOAD IMAGE PROMISE
        const uploadImagePromise = supabase.storage
          .from("Images")
          .upload(`user-${user.id}-${unique_id}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          })
        const [imageData] = await Promise.all([uploadImagePromise])

        const imageError = imageData?.error
        if (imageError) {
          console.error("Image upload error", imageError)
          return
        }
        // // UPDATE USER PROFILE WITH IMAGE AND NEW VALUES
        const { error: updateUserProfileError } = await supabase
          .from("users")
          .update({
            full_name,
            bio,
            profile_image: imageData.data.path,
          })
          .eq("id", user.id)

        if (updateUserProfileError) {
          console.error("Update user profile error", updateUserProfileError)
          return
        }
      }

      form.reset()
      router.refresh()

      setIsDialogOpen(false)
    } catch (error) {}
  }

  const handleDeleteImage = async () => {
    const result = await deleteUserImage(profile_image)
    if (result.success) {
      setIsDialogOpen(false)
      router.refresh()
    } else {
      console.error("Error deleting image")
    }
  }

  const handleDeleteAccount = async () => {
    const {
      data: { session },
    } = await supabaseBrowserClient.auth.getSession()

    // GET USER FROM SESSION WHEN ON CLIENT SIDE
    const user = session?.user
    const userId = user?.id

    if (!userId) {
      console.error("User ID is not available")
      return
    }

    try {
      const response = await fetch("/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user")
      }

      const { error } = await supabaseBrowserClient.auth.signOut()
      if (error) {
        throw new Error(error.message)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Dialog
      modal={true}
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#38067a] hover:bg-[#5605c0] text-white py-2 px-4 rounded">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black border-none sm:border-gray-600 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex justify-center">
              <div className="w-[100px] h-[100px] relative">
                <img
                  src={public_image_url}
                  className="w-[100px] h-[100px] bg-gray-500 object-cover rounded-full"
                  alt={""}
                />
                {profile_image && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <MinusCircle className="absolute text-white bg-red-700 rounded-full bottom-0 right-0 cursor-pointer" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your profile image.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="text-black"
                          rows={4}
                          maxLength={150}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setBioLength(e.target.value.length)
                          }}
                        />
                      </FormControl>
                      <div className="text-right text-sm text-gray-500">
                        {maxBioLength - bioLength} characters left
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Profile Image</FormLabel>
                    <FormDescription>
                      Upload or change your profile image.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="file"
                        className="text-sm"
                        accept="image/*"
                        onChange={(event) => {
                          field.onChange(event.target.files?.[0] || undefined)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-[#28dfff] text-[#022930]">
                Save changes
              </Button>
            </DialogFooter>
            <p className="text-white text-lg font-semibold mt-4 leading-none tracking-tight">
              Account
            </p>
            <div className="border-gray-500 border px-2 py-2 mt-2 rounded-md">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className=" text-red-500 text-sm rounded">
                    {" "}
                    Delete Account{" "}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
