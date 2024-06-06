import Navbar from "@/components/navbar/navbar"
const menu = [
  { menuItem: "Menu Item", path: "" },
  { menuItem: "Menu Item", path: "" },
  { menuItem: "Menu Item", path: "" },
]
const StudentRequestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar menu={menu} notification={true} />
      <div className="relative z-10">{children}</div>
    </>
  )
}
export default StudentRequestLayout
