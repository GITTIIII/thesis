import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SuperAdminTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead> */}
          <TableHead>ชื่อ-นามสกุล</TableHead>
          <TableHead>อีเมล</TableHead>
          <TableHead>เบอร์ติดต่อ</TableHead>
          <TableHead className="hidden md:table-cell">สาขาวิชา</TableHead>
          <TableHead className="hidden md:table-cell">ชั้นปี</TableHead>
          <TableHead className="hidden md:table-cell">รายละเอียด</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {/* <TableCell className="hidden sm:table-cell">
            <Image
              alt="Product image"
              className="aspect-square rounded-md object-cover"
              height="64"
              src="/placeholder.svg"
              width="64"
            />
          </TableCell> */}
          <TableCell className="font-medium">ณฐพล ศักดิ์วิบูลย์เดชา</TableCell>
          <TableCell>
            <Badge variant="outline">paulxpon58@gmail.com</Badge>
          </TableCell>
          <TableCell>091-1234567</TableCell>
          <TableCell className="hidden md:table-cell">
            วิศวกรรมคอมพิวเตอร์
          </TableCell>
          <TableCell className="hidden md:table-cell">1</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
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
      </TableBody>
    </Table>
  );
}
