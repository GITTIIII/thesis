import Background from "@/components/background/background"
import Navbar from "@/components/navbar/navbar"
const menu = [
  { menuItem: "Menu Item", path: "" },
  { menuItem: "Menu Item", path: "" },
  { menuItem: "Menu Item", path: "" },
]
const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar menu={menu} />
      {/* <Background/> */}
      <div className="h-full w-full">
        {children}
      </div>
    </>
  )
}
export default StudentLayout
