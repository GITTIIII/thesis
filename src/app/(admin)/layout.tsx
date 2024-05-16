import Navbar from "../../components/navbar/navbar"
const menu = [
  { menuItem: "Menu Item 1", path: "" },
  { menuItem: "Menu Item 2", path: "" },
  { menuItem: "Menu Item 3", path: "" },
]
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar menu={menu} />
      <div>{children}</div>
    </>
  )
}
export default AdminLayout
