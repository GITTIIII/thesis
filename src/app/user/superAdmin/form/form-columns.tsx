"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  IComprehensiveExamCommitteeForm,
  IQualificationExamCommitteeForm,
  IOutlineCommitteeForm,
  IExamCommitteeForm,
  IOutlineForm,
  IThesisProgressForm,
  IThesisExamAppointmentForm,
} from "@/interface/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import ActionMenu from "@/components/actionMenu/actionMenu";
import FormStatus from "@/components/formStatus/formStatus";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const form01Columns: ColumnDef<IComprehensiveExamCommitteeForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
  },
  {
    header: "ครั้งที่สอบ",
    accessorKey: "times",
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "วันที่สอบ",
    accessorFn: (row) => new Date(row.examDay).toLocaleDateString("th-TH"),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/01-comprehensiveExamCommitteeForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form01 = row.original.id;
      const deleteAPI = `/api/delete01FormById/${form01}`;
      const updatePath = `/user/form/01-comprehensiveExamCommitteeForm/superAdmin/update/${form01}`;
      const fetchAPI = `/api/01ComprehensiveExamCommitteeForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form02Columns: ColumnDef<IQualificationExamCommitteeForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
  },
  {
    header: "ครั้งที่สอบ",
    accessorKey: "times",
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "วันที่สอบ",
    accessorFn: (row) => new Date(row.examDay).toLocaleDateString("th-TH"),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/02-qualificationExamCommitteeForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form02 = row.original.id;
      const deleteAPI = `/api/delete02FormById/${form02}`;
      const updatePath = `/user/form/02-qualificationExamCommitteeForm/superAdmin/update/${form02}`;
      const fetchAPI = `/api/02QualificationExamCommitteeForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form03Columns: ColumnDef<IOutlineCommitteeForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
  },
  {
    header: "ครั้งที่สอบ",
    accessorKey: "times",
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "วันที่สอบ",
    accessorFn: (row) => new Date(row.examDate).toLocaleDateString("th-TH"),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/03-thesisOutlineCommitteeForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form03 = row.original.id;
      const deleteAPI = `/api/delete03FormById/${form03}`;
      const updatePath = `/user/form/03-thesisOutlineCommitteeForm/superAdmin/update/${form03}`;
      const fetchAPI = `/api/03ThesisOutlineCommitteeForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form04Columns: ColumnDef<IExamCommitteeForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ภาคการศึกษา",
    accessorFn: (row) => `${row.trimester}/${row.academicYear}`,
  },
  {
    header: "ครั้งที่สอบ",
    accessorKey: "times",
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "วันที่สอบ",
    accessorFn: (row) => new Date(row.examDate).toLocaleDateString("th-TH"),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/04-thesisOutlineCommitteeForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form04 = row.original.id;
      const deleteAPI = `/api/delete04FormById/${form04}`;
      const updatePath = `/user/form/04-thesisexamCommitteeForm/superAdmin/update/${form04}`;
      const fetchAPI = `/api/04ThesisExamCommitteeForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form05Columns: ColumnDef<IOutlineForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ชื่อวิทยานิพนธ์",
    accessorKey: "thesisNameTH",
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "วันที่เริ่มทำ",
    accessorFn: (row) => `${row.thesisStartMonth} ${row.thesisStartYear}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "การอนุมัติ",
    cell: (row) => FormStatus({ formStatus: row.row.original.formStatus }),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/05-outlineForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form05 = row.original.id;
      const deleteAPI = `/api/delete05FormById/${form05}`;
      const updatePath = `/user/form/05-outlineForm/update/${form05}`;
      const fetchAPI = `/api/05OutlineForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form06Columns: ColumnDef<IThesisProgressForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ชื่อวิทยานิพนธ์",
    accessorKey: "thesisNameTH",
  },
  {
    header: "ความก้าวหน้า",
    accessorFn: (row) => `${row.percentage}%`,
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "สถานะ",
    cell: (row) => (row.row.original.status == "AsPlaned" ? "เป็นไปตามแผน" : "เปลี่ยนแปลงแผน"),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/06-thesisProgressForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form06 = row.original.id;
      const deleteAPI = `/api/delete06FormById/${form06}`;
      const updatePath = `/user/form/06-thesisProgressForm/superAdmin/update/${form06}`;
      const fetchAPI = `/api/06ThesisProgressForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form07Columns: ColumnDef<IThesisExamAppointmentForm>[] = [
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "ชื่อวิทยานิพนธ์",
    accessorKey: "thesisNameTH",
  },
  {
    header: "GPA",
    accessorKey: "gpa",
  },
  {
    header: "หน่วยกิต",
    accessorKey: "credits",
  },
  {
    header: "วันที่สร้าง",
    accessorFn: (row) => new Date(row.date).toLocaleDateString("th-TH"),
  },
  {
    header: "วันที่สอบ",
    accessorFn: (row) => new Date(row.dateExam).toLocaleDateString("th-TH"),
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/07-thesisProgressForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form07 = row.original.id;
      const deleteAPI = `/api/delete07FormById/${form07}`;
      const updatePath = `/user/form/07-thesisExamAppointmentForm/superAdmin/update/${form07}`;
      const fetchAPI = `/api/07ThesisExamAppointmentForm`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];
const form08Columns: ColumnDef<any>[] = [
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
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: any) => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "student.username",
  },
  {
    id: "studentName",
    header: "ชื่อนักศึกษา",
    accessorFn: (row) => `${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
  },
  {
    header: "รายละเอียด",
    cell: (row) => (
      <Link className="text-[#F26522] text-center" href={`/user/form/07-thesisProgressForm/${row.row.original.id}`}>
        คลิกเพื่อดูเพิ่มเติม
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form08 = row.original.id;
      const deleteAPI = `/api/delete08FormById/${form08}`;
      const updatePath = `/user/form/08-thesisExamForm/superAdmin/update/${form08}`;
      const fetchAPI = `/api/08ThesisExam/Form`;
      return <ActionMenu deleteAPI={deleteAPI} updatePath={updatePath} fetchAPI={fetchAPI} />;
    },
  },
];

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
