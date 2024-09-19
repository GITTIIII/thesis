// components/Layout.tsx
import Navbar from "@/components/navbar/navbar";
import { authOptions } from "@/lib/auth";
import { currentUser } from "@/app/action/current-user";
import { getServerSession } from "next-auth";
import React from "react";

type MenuItem = {
  menuItem: string;
  path: string;
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const user = await currentUser();
  if (!user) {
    return <div>Please sign in to view the content.</div>;
  }
  // Generate menu based on user role
  const menu: MenuItem[] = (() => {
    if (session?.user.role === "STUDENT") {
      return [
        { menuItem: "หน้าหลัก", path: "/user/student" },
        { menuItem: "คำขออนุมัติฟอร์ม", path: "/user/table" },
        { menuItem: "โปรไฟล์", path: "/user/profile" },
      ];
    } else if (session?.user.role === "ADMIN" || session?.user.role === "COMMITTEE") {
      return [
        { menuItem: "หน้าหลัก", path: "/user/admin" },
        { menuItem: "คำขออนุมัติฟอร์ม", path: "/user/table" },
        { menuItem: "โปรไฟล์", path: "/user/profile" },
      ];
    } else if (session?.user.role === "SUPER_ADMIN") {
      return [
        { menuItem: "แดชบอร์ด", path: "/user/superAdmin" },
        { menuItem: "แบบฟอร์ม", path: "/user/superAdmin/form" },
        { menuItem: "รายชื่อ", path: "/user/superAdmin/user" },
      ];
    }
    return [];
  })();

  return (
    <>
      <Navbar menu={menu} user={user} />
      {children}
    </>
  );
};

export default Layout;
