"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Control, FieldValues, useFormContext } from "react-hook-form"
import { TimePicker } from "./TimePicker/TimePicker"

interface DatePickerProps {
  form: {
    control: Control<any>
  }
  name: string
  label: string
  placeholder: string
  mode: string
}

export default function DatePicker({
  form,
  name,
  label,
  placeholder,
  mode,
}: DatePickerProps) {
  const { control, watch } = useFormContext()
  const start_time = watch("start_time")

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[100%] pl-3 text-left font-normal text-black",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 " align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  if (mode === "start_time") {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  } else if (mode === "end_time") {
                    const today = new Date(start_time)
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }
                  return false // Ensure a boolean is always returned
                }}
                initialFocus
              />
              <div className="p-3 border-t border-border">
                <TimePicker setDate={field.onChange} date={field.value} />
              </div>
            </PopoverContent>
          </Popover>
          {/* <FormDescription>
            Commented
          </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
