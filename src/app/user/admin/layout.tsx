import Background from "@/components/background/background"
import Navbar from "@/components/navbar/navbar"
const menu = [
  { menuItem: "Menu Item 1", path: "" },
  { menuItem: "Menu Item 2", path: "" },
  { menuItem: "Menu Item 3", path: "" },
]
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar menu={menu}/>
      <Background/>
      <div className="h-full w-full flex absolute top-0 items-center justify-center z-10">
        {children}
      </div>
    </>
  )
}
export default AdminLayout
