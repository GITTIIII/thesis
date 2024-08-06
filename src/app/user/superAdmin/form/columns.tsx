"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IComprehensiveExamCommitteeForm, IOutlineForm, IQualificationExamCommitteeForm } from "@/interface/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FindStatus05 } from "@/components/formStatus/FormStatus";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const form01Columns: ColumnDef<IComprehensiveExamCommitteeForm>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ลำดับ",
  },
  {
    accessorKey: "date",
    header: "วันที่สร้าง",
  },
  {
    accessorKey: "trimester",
    header: "ภาคการศึกษา",
  },
  {
    accessorKey: "academicYear",
    header: "ปีการศึกษา",
  },
  {
    id: "studentID",
    accessorKey: "student.username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          รหัศนักศึกษา
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
    id: "studentName",
    header: "ชื่อนักศึกษา",
  },
  {
    accessorKey: "times",
    header: "สอบครั้งที่",
  },
  {
    accessorKey: "examDay",
    header: "วันที่สอบ",
  },
  {
    header: "รายละเอียด",
    cell: () => {
      return <div>ดูรายละเอียด</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      //อาจจะนำไปใช้ในการดาวน์โหลดเลือก id ที่อยู่ใน row
      const form01 = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">เปิดเมนู</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
            <DropdownMenuItem>ดาวน์โหลด</DropdownMenuItem>
            <DropdownMenuItem>แก้ไขฟอร์ม</DropdownMenuItem>
            <DropdownMenuItem>ลบฟอร์ม</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const form02Columns: ColumnDef<IQualificationExamCommitteeForm>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
  },
  {
    accessorKey: "date",
    header: "วันที่สร้าง",
  },
  {
    accessorKey: "trimester",
    header: "ภาคการศึกษา",
  },
  {
    accessorKey: "academicYear",
    header: "ปีการศึกษา",
  },
  {
    id: "studentID",
    accessorKey: "student.username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          รหัศนักศึกษา
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
    id: "studentName",
    header: "ชื่อนักศึกษา",
  },
  {
    accessorKey: "times",
    header: "สอบครั้งที่",
  },
  {
    accessorKey: "examDay",
    header: "วันที่สอบ",
  },
  {
    header: "รายละเอียด",
    cell: () => {
      return <div>ดูรายละเอียด</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      //อาจจะนำไปใช้ในการดาวน์โหลดเลือก id ที่อยู่ใน row
      const form01 = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">เปิดเมนู</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
            <DropdownMenuItem>ดาวน์โหลด</DropdownMenuItem>
            <DropdownMenuItem>แก้ไขฟอร์ม</DropdownMenuItem>
            <DropdownMenuItem>ลบฟอร์ม</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const form03Columns: ColumnDef<IOutlineForm>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
  },
  {
    accessorKey: "date",
    header: "วันที่สร้าง",
  },
  {
    accessorKey: "thesisNameTH",
    header: "ชื่อวิทยานิพนธ์",
  },
  {
    id: "studentID",
    accessorKey: "student.username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          รหัศนักศึกษา
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
    id: "studentName",
    header: "ชื่อนักศึกษา",
  },
  {
    accessorKey: "thesisStartMonth",
    header: "เดือนที่เริ่ม",
  },
  {
    accessorKey: "thesisStartYear",
    header: "ปีที่เริ่ม",
  },
  {
    header: "รายละเอียด",
    cell: () => {
      return <div>ดูรายละเอียด</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      //อาจจะนำไปใช้ในการดาวน์โหลดเลือก id ที่อยู่ใน row
      const form01 = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">เปิดเมนู</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
            <DropdownMenuItem>ดาวน์โหลด</DropdownMenuItem>
            <DropdownMenuItem>แก้ไขฟอร์ม</DropdownMenuItem>
            <DropdownMenuItem>ลบฟอร์ม</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const form04Columns: ColumnDef<IOutlineForm>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
  },
  {
    accessorKey: "date",
    header: "วันที่สร้าง",
  },
  {
    accessorKey: "thesisNameTH",
    header: "ชื่อวิทยานิพนธ์",
  },
  {
    id: "studentID",
    accessorKey: "student.username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          รหัศนักศึกษา
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
    id: "studentName",
    header: "ชื่อนักศึกษา",
  },
  {
    accessorKey: "thesisStartMonth",
    header: "เดือนที่เริ่ม",
  },
  {
    accessorKey: "thesisStartYear",
    header: "ปีที่เริ่ม",
  },
  {
    header: "รายละเอียด",
    cell: () => {
      return <div>ดูรายละเอียด</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      //อาจจะนำไปใช้ในการดาวน์โหลดเลือก id ที่อยู่ใน row
      const form01 = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">เปิดเมนู</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
            <DropdownMenuItem>ดาวน์โหลด</DropdownMenuItem>
            <DropdownMenuItem>แก้ไขฟอร์ม</DropdownMenuItem>
            <DropdownMenuItem>ลบฟอร์ม</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const form05Columns: ColumnDef<IOutlineForm>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
  },
  {
    accessorKey: "date",
    header: "วันที่สร้าง",
  },
  {
    accessorKey: "thesisNameTH",
    header: "ชื่อวิทยานิพนธ์",
  },
  {
    id: "studentID",
    accessorKey: "student.username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          รหัศนักศึกษา
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
    id: "studentName",
    header: "ชื่อนักศึกษา",
  },
  {
    accessorKey: "thesisStartMonth",
    header: "เดือนที่เริ่ม",
  },
  {
    accessorKey: "thesisStartYear",
    header: "ปีที่เริ่ม",
  },
  {
    header: "สถานะ",
    cell: (row) => FindStatus05({ formData: row.row.original }),
  },
  {
    header: "รายละเอียด",
    cell: () => {
      return <div>ดูรายละเอียด</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      //อาจจะนำไปใช้ในการดาวน์โหลดเลือก id ที่อยู่ใน row
      const form01 = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">เปิดเมนู</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
            <DropdownMenuItem>ดาวน์โหลด</DropdownMenuItem>
            <DropdownMenuItem>แก้ไขฟอร์ม</DropdownMenuItem>
            <DropdownMenuItem>ลบฟอร์ม</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
