"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/interface/user";
import { IExpert } from "@/interface/expert";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { StudentActionMenu, AdvisorActionMenu, HeadInstituteActionMenu, ExpertActionMenu } from "@/components/actionMenu/actionMenu";
import { SelectPosition } from "@/components/selectPosition/selectPosition";
import { Eye } from "lucide-react";
import { StudentDialog, AdvisorDialog, HeadInstituteDialog, ExpertDialog } from "@/components/user-dialog/user-dialog";

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
    meta: {
      filterVariant: "select",
    },
  },
  {
    id: "studentName",
    header: "ชื่อ-นามสกุล",
    accessorFn: (row) => `${row.firstNameTH} ${row.lastNameTH}` || `${row.firstNameEN} ${row.lastNameEN}`,
  },
  {
    header: "สาขา",
    cell: (row) => row.row.original.school?.schoolNameTH,
  },
  {
    header: "หลักสูตร",
    cell: (row) => row.row.original.program?.programNameTH,
  },
  {
    header: "อีเมล",
    accessorKey: "email",
  },
  {
    id: "actions",
    cell: (row) => {
      const deleteAPI = `/api/user/${row.row.original.id}`;
      const fetchAPI = "/api/getStudent";
      return (
        <div className="flex items-center gap-2">
          <StudentDialog user={row.row.original}>
            <Eye className="h-4 w-4 hover:cursor-pointer" />
          </StudentDialog>
          <StudentActionMenu user={row.row.original} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />
        </div>
      );
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
    header: "สาขา",
    accessorKey: "school.schoolNameTH",
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
    header: "ตำแหน่ง",
    cell: (row) => (
      <div>
        <SelectPosition user={row.row.original} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: (row) => {
      const deleteAPI = `/api/user/${row.row.original.id}`;
      const fetchAPI = "/api/getAdvisor";
      return (
        <div className="flex items-center gap-2">
          <AdvisorDialog user={row.row.original}>
            <Eye className="h-4 w-4 hover:cursor-pointer" />
          </AdvisorDialog>
          <AdvisorActionMenu user={row.row.original} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />
        </div>
      );
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
    accessorKey: "institute.instituteNameTH",
  },
  {
    id: "actions",
    cell: (row) => {
      const deleteAPI = `/api/user/${row.row.original.id}`;
      const fetchAPI = "/api/getHeadInstitute";
      return (
        <div className="flex items-center gap-2">
          <HeadInstituteDialog user={row.row.original}>
            <Eye className="h-4 w-4 hover:cursor-pointer" />
          </HeadInstituteDialog>
          <HeadInstituteActionMenu user={row.row.original} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />
        </div>
      );
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
    cell: (row) => {
      const deleteAPI = `/api/expert/${row.row.original.id}`;
      const fetchAPI = "/api/expert";
      return (
        <div className="flex justify-end">
          <div className="flex items-center content-end gap-2">
            <ExpertDialog user={row.row.original}>
              <Eye className="h-4 w-4 hover:cursor-pointer" />
            </ExpertDialog>
            <ExpertActionMenu user={row.row.original} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />
          </div>
        </div>
      );
    },
  },
];

export const userColumns = { studentColumns, advisorColumns, headInstituteColumns, expertColumns };
