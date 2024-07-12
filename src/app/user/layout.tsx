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
      { menuItem: "admin", path: "/user/admin" },
      { menuItem: "superadmin", path: "/user/superAdmin" },
    ];
  } else if (
    session?.user.role == "ADMIN" ||
    session?.user.role == "COMMITTEE"
  ) {
    menu = [
      { menuItem: "หน้าหลัก", path: "/user/admin" },
      { menuItem: "คำขออนุมัติฟอร์ม", path: "/user/profile" },
      { menuItem: "รายชื่อนักศึกษา", path: "/user/table" },
      { menuItem: "student", path: "/user/student" },
      { menuItem: "superadmin", path: "/user/superAdmin" },
    ];
  } else if (session?.user.role == "SUPER_ADMIN") {
    menu = [
      { menuItem: "หน้าหลัก", path: "/user/superAdmin" },
      { menuItem: "คู่มือการเขียนวิทยานิพนธ์", path: "/user/superAdmin" },
      { menuItem: "ติดตามผลการอนุมัติ", path: "/user/superAdmin" },
      { menuItem: "student", path: "/user/student" },
      { menuItem: "admin", path: "/user/admin" },
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
