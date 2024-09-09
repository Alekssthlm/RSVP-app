import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Component() {
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileName(file ? file.name : null)
  }

  return (
    <div className="flex flex-col items-start space-y-2">
      <Button onClick={handleClick} variant="outline">
        {fileName ? "Change File" : "Choose File"}
      </Button>
      {fileName && (
        <p className="text-sm text-muted-foreground">Selected: {fileName}</p>
      )}
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        aria-label="File input"
      />
    </div>
  )
}
