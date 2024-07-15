import { cn } from "@/lib/utils"

function Stepper({ step }: { step: number}) {
  return (
    <div className=" items-center md:flex hidden">
      {Array.from(Array(7).keys(), (item) => item + 1).map((key) => (
        <>
          <div
            className={cn(
              "flex border-2 border-[#A67436] w-12 h-12  rounded-full items-center  justify-center text-3xl font-normal mx-2",
              key < step ? " bg-[#A67436] text-white" : "text-[#A67436]"
            )}
          >
            {key != step ? (
              <p>{key}</p>
            ) : (
              <div className="border-2 border-[#A67436] bg-[#A67436] w-6 h-6 rounded-full " /> //วงกลม
            )}
          </div>
          {key < 7 && (
            <div className=" border-2 border-[#A67436] xl:w-24 md:w-12 w-4 h-0 rounded-lg" /> //เส้น
          )}
        </>
      ))}
    </div>
  )
}

export default Stepper
