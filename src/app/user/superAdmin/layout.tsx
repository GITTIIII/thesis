import Background from "@/components/background/background"
import Navbar from "@/components/navbar/navbar"
const menu = [
  { menuItem: "Student", path: "/user/student" },
  { menuItem: "Admin", path: "/user/admin" },
  { menuItem: "SuperAdmin", path: "/user/superAdmin" },
  { menuItem: "Profile", path: "/user/profile" },
]
const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar menu={menu}/>
     
  
        {children}
     
    </>
  )
}
export default SuperAdminLayout
