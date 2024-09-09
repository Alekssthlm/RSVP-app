import { Spinner } from "@/components/ui/spinner"

export default function loading() {
  return (
    <div className="  absolute top-0 left-0 right-0 bottom-0  flex justify-center items-center z-10">
      <Spinner className="text-[#ffffff]" size={"large"} show={true} />
    </div>
  )
}
