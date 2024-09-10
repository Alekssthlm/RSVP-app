"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerWithEmailAndPassword } from "@/actions/supabase"
import { Provider } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/utils/supabaseClient"
import { useRouter } from "next/navigation"
import CustomFormInput from "@/components/CustomFormInput"
import { Checkbox } from "@/components/ui/checkbox"
import TermsAndConditions from "@/components/TermsAndConditions"

export default function SignUpPage(this: any) {
  const [userControlErrors, setUserControlErrors] = useState<{
    email?: string
    username?: string
  }>({})
  const router = useRouter()
  const supabaseBrowserClient = getSupabaseBrowserClient()

  useEffect(() => {
    async function redirectIfAuthenticated() {
      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession()

      if (session?.user) {
        router.push("/")
      }
    }

    redirectIfAuthenticated()
  }, [])

  const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[.@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (.@$!%*?&#).",
      }),
    fullname: z.string().min(1, {
      message: "Provide your name.",
    }),
    username: z.string().min(1, {
      message: "Username is required.",
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "Required.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      username: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, fullname, username, terms } = values
    const newValues = {
      email,
      password,
      fullname,
      username: username.toLowerCase(),
      terms,
    }
    const response = await registerWithEmailAndPassword(newValues)
    const { error, data } = JSON.parse(response)
    if (error) {
      console.error(error)
      setUserControlErrors(error)
      return
    }
  }

  function clearEmailErrors() {
    if (!userControlErrors.email) return
    setUserControlErrors((prev) => ({ ...prev, email: "" }))
  }

  function clearUsernameErrors() {
    if (!userControlErrors.username) return
    setUserControlErrors((prev) => ({ ...prev, username: "" }))
  }

  return (
    <section className="flex justify-center">
      <div className="flex flex-col w-[50%] max-w-[25rem] gap-4">
        <h1>SIGN UP</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col "
          >
            <FieldWrap>
              <CustomFormInput
                form={form}
                name="email"
                placeholder="Email"
                onChange={clearEmailErrors}
              />
              {userControlErrors.email && (
                <p className="text-[0.7rem] ml-1 text-red-500">
                  {userControlErrors.email}
                </p>
              )}
            </FieldWrap>
            <FieldWrap>
              <CustomFormInput form={form} name="fullname" placeholder="Name" />
            </FieldWrap>
            <FieldWrap>
              <CustomFormInput
                form={form}
                name="username"
                placeholder="Username"
                onChange={clearUsernameErrors}
              />
              {userControlErrors.username && (
                <p className="text-[0.7rem] ml-2 text-red-500">
                  {userControlErrors.username}
                </p>
              )}
            </FieldWrap>
            <FieldWrap>
              <CustomFormInput
                form={form}
                name="password"
                type="password"
                placeholder="Password"
              />
            </FieldWrap>
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <TermsAndConditions>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel>
                      I have read and agree to the Terms of Service and Privacy
                      Policy.
                    </FormLabel>
                  </TermsAndConditions>
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

function FieldWrap({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-[3.8rem]">{children}</div>
}
