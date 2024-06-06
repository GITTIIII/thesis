import Navbar from "@/components/navbar/navbar"
const menu = [
  { menuItem: "Menu Item", path: "" },
  { menuItem: "Menu Item", path: "" },
  { menuItem: "Menu Item", path: "" },
]
const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar menu={menu}/>
      <div>{children}</div>
    </>
  )
}
export default StudentLayout
