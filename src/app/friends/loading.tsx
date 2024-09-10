import { Spinner } from "@/components/ui/spinner"

export default function loading() {
  return (
    <div className="bg-[#011b2988] flex-grow flex justify-center items-center z-10 md:rounded-xl">
      <Spinner className="text-[rgb(255,255,255)]" size={"large"} show={true} />
    </div>
  )
}
