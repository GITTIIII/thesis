"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/interface/user";
import { IExpert } from "@/interface/expert";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionMenu from "@/components/actionMenu/actionMenu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const studentColumns: ColumnDef<IUser>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    id: "studentID",
    header: ({ column }) => {
      return (
        <Button className="p-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          รหัศนักศึกษา
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "username",
  },
  {
    id: "studentName",
    header: "ชื่อ-นามสกุล",
    accessorFn: (row) => `${row.firstNameTH} ${row.lastNameTH}` || `${row.firstNameEN} ${row.lastNameEN}`,
  },
  {
    header: "อีเมล",
    accessorKey: "email",
  },
  {
    header: "เบอร์ติดต่อ",
    accessorKey: "phone",
  },
  {
    header: "สาขา",
    accessorKey: "school.schoolNameTH",
  },
  {
    header: "ระดับการศึกษา",
    accessorFn: (row) => `${row.degree == "Master" ? "ปริญญาโท" : "ปริญญาเอก"}`,
  },
  {
    id: "actions",
    cell: () => {
      const deleteAPI = "";
      const updatePath = "";
      const fetchAPI = "";
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];

const advisorColumns: ColumnDef<IUser>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    id: "studentName",
    header: "ชื่อ-นามสกุล",
    accessorFn: (row) => `${row.firstNameTH} ${row.lastNameTH}` || `${row.firstNameEN} ${row.lastNameEN}`,
  },
  {
    header: "อีเมล",
    accessorKey: "email",
  },
  {
    header: "เบอร์ติดต่อ",
    accessorKey: "phone",
  },
  {
    header: "สาขา",
    accessorKey: "school.schoolNameTH",
  },
  {
    header: "ระดับการศึกษา",
    accessorFn: (row) => `${row.degree == "Master" ? "ปริญญาโท" : "ปริญญาเอก"}`,
  },
  {
    id: "actions",
    cell: () => {
      const deleteAPI = "";
      const updatePath = "";
      const fetchAPI = "";
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];

const headInstituteColumns: ColumnDef<IUser>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    id: "studentName",
    header: "ชื่อ-นามสกุล",
    accessorFn: (row) => `${row.firstNameTH} ${row.lastNameTH}` || `${row.firstNameEN} ${row.lastNameEN}`,
  },
  {
    header: "อีเมล",
    accessorKey: "email",
  },
  {
    header: "สำนักวิชา",
    accessorKey: "institute",
  },

  {
    id: "actions",
    cell: () => {
      const deleteAPI = "";
      const updatePath = "";
      const fetchAPI = "";
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];

const expertColumns: ColumnDef<IExpert>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    id: "studentName",
    header: "ชื่อ-นามสกุล",
    accessorFn: (row) => `${row.prefix} ${row.firstName} ${row.lastName}`,
  },
  {
    id: "actions",
    cell: () => {
      const deleteAPI = "";
      const updatePath = "";
      const fetchAPI = "";
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];

export const userColumns = { studentColumns, advisorColumns, headInstituteColumns, expertColumns };
