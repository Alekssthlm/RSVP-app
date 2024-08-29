"use client"

import { use, useContext } from "react"
import { Button } from "@/components/ui/button"
import { set, useForm } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { loginWithEmailAndPassword } from "@/actions/supabase"
import { Provider } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { useRouter } from "next/navigation"
import AuthStateContext from "@/context/AuthStateContext"

export default function LoginPage(this: any) {
  const { isLoggedIn, setIsLoggedIn, setUser, userId, setUserId } =
    useContext(AuthStateContext)
  const router = useRouter()
  const supabaseBrowserClient = getSupabaseBrowserClient()

  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Enter your password" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLogin = async (data: {
    user: { user_metadata: { username: any }; id: string }
  }) => {
    if (data) {
      setIsLoggedIn(true)
      const username = data.user.user_metadata.username
      const userIdentification = data.user.id
      setUserId(userIdentification)
      setUser(username)
      router.push(`/dashboard`)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await loginWithEmailAndPassword(values)
    const { error, data } = JSON.parse(response)
    if (error) {
      console.error(error)
      return
    }

    if (data) {
      handleLogin(data)
    }
  }

  // LOGIN WITH GITHUB AND OTHER SOCIAL PROVIDERS
  async function socialAuth(provider: Provider) {
    const response = await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <section className="flex justify-center">
      <div className="flex flex-col w-[50%] max-w-[25rem] gap-4">
        <h1>LOGIN</h1>
        {/* <Button onClick={socialAuth.bind(this, "github")}>GITHUB</Button> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  {/* <FormDescription>Please enter your email</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  {/* <FormDescription>Min 3 characters</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  )
}
