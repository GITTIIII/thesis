import Navbar from "@/components/navbar/navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type menuItem = {
  menuItem: string;
  path: string;
};

let menu: menuItem[] = [];

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (session?.user.role == "STUDENT") {
    menu = [
      { menuItem: "หน้าหลัก", path: "/user/student" },
      { menuItem: "คำขออนุมัติฟอร์ม", path: "/user/table" },
      { menuItem: "โปรไฟล์", path: "/user/profile" },
    ];
  } else if (session?.user.role == "ADMIN" || session?.user.role == "COMMITTEE") {
    menu = [
      { menuItem: "หน้าหลัก", path: "/user/admin" },
      { menuItem: "คำขออนุมัติฟอร์ม", path: "/user/table" },
      { menuItem: "โปรไฟล์", path: "/user/profile" },
    ];
  } else if (session?.user.role == "SUPER_ADMIN") {
    menu = [
      { menuItem: "แดชบอร์ด", path: "/user/superAdmin" },
      { menuItem: "แบบฟอร์ม", path: "/user/superAdmin/form" },
      { menuItem: "รายชื่อ", path: "/user/superAdmin/user" },
    ];
  }

  return (
    <>
      <Navbar menu={menu} />
      {children}
    </>
  );
};
export default Layout;
