import { Spinner } from "@/components/ui/spinner"

export default function loading() {
  return (
    <div className="flex-grow flex justify-center items-center z-10">
      <Spinner className="text-[rgb(255,255,255)]" size={"large"} show={true} />
    </div>
  )
}
