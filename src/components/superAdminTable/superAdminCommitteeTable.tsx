"use client";

import { useState, useEffect } from "react";
import { IUser } from "@/interface/user";
import { Eye, ListFilter, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getCurrentUser() {
  const res = await fetch("/api/user");
  return res.json();
}

export default function SuperAdminCommitteeTable({ filterRole }: { filterRole: string }) {
  const [userData, setUserData] = useState<IUser[]>([]);
  const [studentFilter, setStudentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");

  const filteredData = userData.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      const data = await getCurrentUser();
      setUserData(data);
      setUsername(data[0].username);
    }
    fetchData();
  }, []);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = userData.find((u) => u.username === username);
    setSelectedUser(user || null);
  }, [userData, username]);

  return (
    <div>
      <header className="flex justify-end gap-2">
        <div className="relative ml-auto flex-1 md:grow-0">
          <form>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อกรรมการ..."
              className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </form>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-1 rounded-lg">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">คัดกรอง</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>คัดกรองโดย</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={studentFilter} onValueChange={setStudentFilter}>
              <DropdownMenuRadioItem value="All">ทั้งหมด</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Master">ภายใน</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Doctoral">ภายนอก</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อ-นามสกุล</TableHead>
            <TableHead className="hidden md:table-cell">อีเมล</TableHead>
            <TableHead className="hidden md:table-cell">เบอร์ติดต่อ</TableHead>
            <TableHead>
              <span className="sr-only">รายละเอียด</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <Dialog>
          <TableBody>
            {filteredData
              .filter((userData) => (filterRole == "COMMITTEE" ? userData?.role.toString() === "COMMITTEE" : null))
              .map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <DialogTrigger asChild className="hover:cursor-pointer">
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DialogTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          onClick={() => setUsername(user.username)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
                        <DropdownMenuItem>แก้ไข</DropdownMenuItem>
                        <DropdownMenuItem>ลบข้อมูล</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

          <DialogContent className="max-w-[60%] sm:min-w-[425px]">
            <DialogHeader>
              <DialogTitle>ข้อมูลรายละเอียดของกรรมการ</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">รหัส</Label>
                <Input value={selectedUser?.username} className="col-span-3 disabled" readOnly />
                <Label className="text-right">ชื่อ</Label>
                <Input value={selectedUser?.firstName} className="col-span-3 disabled" readOnly />
                <Label className="text-right">นามสกุล</Label>
                <Input value={selectedUser?.lastName} className="col-span-3 disabled" readOnly />
                <Label className="text-right">อีเมล</Label>
                <Input value={selectedUser?.email} className="col-span-3 disabled" readOnly />
                <Label className="text-right">เบอร์ติดต่อ</Label>
                <Input value={selectedUser?.phone} className="col-span-3 disabled" readOnly />
                <Label className="text-right">ระดับการศึกษา</Label>
                <Input value={selectedUser?.degree} className="col-span-3 disabled" readOnly />
                <Label className="text-right">สำนักวิชา</Label>
                <Input value={selectedUser?.institute.instituteName} className="col-span-3 disabled" readOnly />
                <Label className="text-right">สาขาวิชา</Label>
                <Input value={selectedUser?.school.schoolName} className="col-span-3 disabled" readOnly />
                <Label className="text-right">หลักสูตร</Label>
                <Input value={selectedUser?.program.programName} className="col-span-3 disabled" readOnly />
                <Label className="text-right">ปีหลักสูตร</Label>
                <Input value={selectedUser?.program.programYear} className="col-span-3 disabled" readOnly />
              </div>
            </div>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </Table>
    </div>
  );
}
