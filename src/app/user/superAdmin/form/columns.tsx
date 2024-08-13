"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  IComprehensiveExamCommitteeForm,
  IQualificationExamCommitteeForm,
  IOutlineForm,
  IThesisProgressForm,
} from "@/interface/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ActionMenu from "@/components/actionMenu/ActionMenu";
import { FindStatus05 } from "@/components/formStatus/FormStatus";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const form01Columns: ColumnDef<IComprehensiveExamCommitteeForm>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    header: "วันที่สร้าง",
    accessorKey: "date",
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ครั้งที่สอบ",
    accessorKey: "times",
  },
  {
    header: "วันที่สอบ",
    accessorKey: "examDay",
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link
        className="text-[#F26522] text-center"
        href={`/user/form/comprehensiveExamCommitteeForm/${row.row.original.id}`}
      >
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form01 = row.original.id;
      console.log("Hel1111111111111111111", form01);
      const deleteAPI = `/api/delete01FormById/${form01}`;
      return <ActionMenu deleteAPI={deleteAPI} />;
    },
  },
];
const form02Columns: ColumnDef<IQualificationExamCommitteeForm>[] = [
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
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    header: "วันที่สร้าง",
    accessorKey: "date",
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ครั้งที่สอบ",
    accessorKey: "times",
  },
  {
    header: "วันที่สอบ",
    accessorKey: "examDay",
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link
        className="text-[#F26522] text-center"
        href={`/user/form/qualificationExamCommitteeForm/${row.row.original.id}`}
      >
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form02 = row.original.id;
      console.log("Hel2222222222222222222", form02);
      const deleteAPI = `/api/delete02FormById/${form02}`;
      return <ActionMenu deleteAPI={deleteAPI} />;
    },
  },
];
const form03Columns: ColumnDef<any>[] = [];
const form04Columns: ColumnDef<any>[] = [];
const form05Columns: ColumnDef<IOutlineForm>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    header: "วันที่สร้าง",
    accessorKey: "date",
  },
  {
    header: "ภาคการศึกษา",
    // accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ชื่อวิทยานิพนธ์",
    accessorKey: "thesisNameTH",
  },
  {
    header: "วันที่เริ่ม",
    accessorFn: (row) =>
      `${row.thesisStartMonth} ${row.thesisStartYear}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "สถานะ",
    cell: (row) => FindStatus05({ formData: row.row.original }),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/outlineForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form05 = row.original.id;
      console.log("55555555555555555555", form05);
      const deleteAPI = `/api/delete05FormById/${form05}`;
      return <ActionMenu deleteAPI={deleteAPI} />;
    },
  },
];
const form06Columns: ColumnDef<IThesisProgressForm>[] = [
  {
    header: "ลำดับ",
    cell: (row) => row.row.index + 1,
  },
  {
    header: "วันที่สร้าง",
    accessorKey: "date",
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}`,
    // accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) =>
      `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ชื่อวิทยานิพนธ์",
    accessorKey: "thesisNameTH" != null ? "thesisNameTH" : "thesisNameEN",
  },
  {
    header: "เปอร์เซ็นต์",
    accessorKey: "percentage",
  },
  {
    header: "สถานะ",
    accessorKey: "status",
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/thesisProgressForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form06 = row.original.id;
      console.log("666666666666666666666", form06);
      const deleteAPI = `/api/delete06FormById/${form06}`;
      return <ActionMenu deleteAPI={deleteAPI} />;
    },
  },
];
const form07Columns: ColumnDef<any>[] = [];
const form08Columns: ColumnDef<any>[] = [];

export const formColumns = {
  form01Columns,
  form02Columns,
  form03Columns,
  form04Columns,
  form05Columns,
  form06Columns,
  form07Columns,
  form08Columns,
};
