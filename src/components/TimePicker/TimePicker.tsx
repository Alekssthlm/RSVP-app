"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { TimePickerInput } from "./time-picker-input"

interface TimePickerDemoProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex justify-between gap-2">
      <div className="flex gap-2 items-center text-gray-700">
        <Clock className="h-5 w-5" />
        <p className="text-sm font-medium">Time</p>
      </div>
      <div className="flex gap-1 text-center items-center">
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
        <span>:</span>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
    </div>
  )
}
