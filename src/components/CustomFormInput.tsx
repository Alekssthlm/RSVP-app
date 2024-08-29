"use client"

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useRef } from "react"
import { Control } from "react-hook-form"

interface FormInputProps {
  form: {
    control: Control<any>
  }
  title?: string
  name: string
  placeholder?: string
  type?: string
  description?: string
  onChange?: () => void
  onBlur?: () => void
  onKeyUp?: (e: React.KeyboardEvent) => void
}

export default function CustomFormInput({
  form,
  title,
  name,
  placeholder,
  type,
  description,
  onChange,
  onBlur,
  onKeyUp,
}: FormInputProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <FormControl>
            <Input
              className="text-black"
              placeholder={placeholder}
              type={type}
              {...field}
              onBlur={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current)
                }
                if (onBlur) {
                  onBlur()
                }
              }}
              onKeyUp={(e) => {
                if (onKeyUp) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  timeoutRef.current = setTimeout(() => {
                    onKeyUp(e)
                  }, 500)
                }
              }}
              onChange={(e) => {
                field.onChange(e)
                if (onChange) {
                  onChange()
                }
              }}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-[0.7rem]">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
