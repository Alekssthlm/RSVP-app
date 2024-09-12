"use client"

import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginWithEmailAndPassword } from "@/actions/supabase"
import { useRouter } from "next/navigation"
import AuthStateContext from "@/context/AuthStateContext"
import CustomFormInput from "@/components/CustomFormInput"
import Link from "next/link"

export default function LoginPage(this: any) {
  const { setIsLoggedIn, setUser, setUserId } = useContext(AuthStateContext)
  const [loginError, setLoginError] = useState("")
  const router = useRouter()

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
      setLoginError("Invalid email or password")
      return
    }

    if (data) {
      handleLogin(data)
    }
  }

  function clearError() {
    if (loginError) {
      setLoginError("")
    }
  }

  return (
    <section className="flex justify-center pt-8 px-4">
      <div className="flex flex-col max-w-[30rem] flex-grow gap-4 bg-[#012d42] p-4 rounded-md">
        <h1 className="text-xl text-white font-bold">LOGIN</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-4">
              <CustomFormInput
                form={form}
                name="email"
                placeholder="Email"
                onChange={clearError}
              />
              <CustomFormInput
                form={form}
                name="password"
                placeholder="Password"
                type="password"
                onChange={clearError}
              />
              <div>
                <p className="text-base h-8 text-red-600">{loginError}</p>
              </div>
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <h1 className="text-white text-sm self-center">
          Not registered?{" "}
          <Link href={"/signup"} className="text-[#28dfff] hover:underline">
            Create an account here.
          </Link>
        </h1>
      </div>
    </section>
  )
}
