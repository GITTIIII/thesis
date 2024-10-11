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
import { ArrowUpDown } from "lucide-react";
import { FormActionMenu } from "@/components/actionMenu/ActionMenu";
import FormStatus from "@/components/formStatus/FormStatus";
import { HoverCardTable } from "@/components/formTable/hoverCard";
import { MessageSquareMore } from "lucide-react";

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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
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
			const downloadPath = "";
			const updatePath = process.env.NEXT_PUBLIC_URL + `/user/form/01-comprehensiveExamCommitteeForm/superAdmin/update/${form01}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete01FormById/${form01}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/01ComprehensiveExamCommitteeForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
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
			const downloadPath = "";
			const updatePath = `/user/form/02-qualificationExamCommitteeForm/superAdmin/update/${form02}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete02FormById/${form02}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/02QualificationExamCommitteeForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
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
			const downloadPath = "";
			const updatePath = `/user/form/03-thesisOutlineCommitteeForm/superAdmin/update/${form03}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete03FormById/${form03}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/03ThesisOutlineCommitteeForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
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
			const downloadPath = "";
			const updatePath = `/user/form/04-thesisexamCommitteeForm/superAdmin/update/${form04}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete04FormById/${form04}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/04ThesisExamCommitteeForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
	},
	{
		header: "ชื่อวิทยานิพนธ์ (ไทย)",
		cell: ({ row }) => {
			return (
				<div className="w-[150px] truncate">
					<HoverCardTable data={row.original.thesisNameTH} />
				</div>
			);
		},
	},
	{
		header: "ชื่อวิทยานิพนธ์ (อังกฤษ)",
		cell: ({ row }) => {
			return (
				<div className="w-[150px] truncate">
					<HoverCardTable data={row.original.thesisNameEN} />
				</div>
			);
		},
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
		header: "ความเห็น",
		cell: (row) => (
			<Link className="flex justify-center" href={`/user/form/05-outlineForm/update/${row.row.original.id}`}>
				<MessageSquareMore className="h-6 w-6" color="#F26522" />
			</Link>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const form05 = row.original.id;
			const downloadPath = "";
			const updatePath = `/user/form/05-outlineForm/update/${form05}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete05FormById/${form05}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/05OutlineForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
	},
	// {
	//   header: "ชื่อวิทยานิพนธ์",
	//   accessorKey: "thesisNameTH",
	// },
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
			const downloadPath = "";
			const updatePath = `/user/form/06-thesisProgressForm/superAdmin/update/${form06}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete06FormById/${form06}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/06ThesisProgressForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
	},
	// {
	//   header: "ชื่อวิทยานิพนธ์",
	//   accessorKey: "thesisNameTH",
	// },
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
			const downloadPath = "";
			const updatePath = `/user/form/07-thesisExamAppointmentForm/superAdmin/update/${form07}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete07FormById/${form07}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/07ThesisExamAppointmentForm`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
		},
	},
];
const form08Columns: ColumnDef<any>[] = [
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
		accessorFn: (row) =>
			`${row.student.firstNameTH} ${row.student.lastNameTH}` || `${row.student.firstNameEN} ${row.student.lastNameEN}`,
	},
	{
		header: "ชื่อวิทยานิพนธ์ใหม่ (ไทย)",
		cell: ({ row }) => {
			return (
				<div className="w-[150px] truncate">
					<HoverCardTable data={row.original.newThesisNameTH} />
				</div>
			);
		},
	},
	{
		header: "ชื่อวิทยานิพนธ์ใหม่ (อังกฤษ)",
		cell: ({ row }) => {
			return (
				<div className="w-[150px] truncate">
					<HoverCardTable data={row.original.newThesisNameEN} />
				</div>
			);
		},
	},
	{
		header: "วิทยานิพนธ์",
		cell: ({ row }) => {
			const reply = row.original.disClosed ? "วิทยานิพนธ์เผยแพร่ได้" : "วิทยานิพนธ์ปกปิด";
			return <div className="w-[150px] truncate">{reply}</div>;
		},
	},
	{
		header: "เปลี่ยนชื่อวิทยานิพนธ์",
		cell: ({ row }) => {
			const reply = row.original.reviseTitle ? "ปรับเปลี่ยนชื่อวิทยานิพนธ์" : "ใช้ชื่อเดิม";
			return <div className="w-[150px] truncate">{reply}</div>;
		},
	},
	{
		header: "ความเห็น",
		cell: (row) => (
			<Link className="flex justify-center" href={`/user/form/08-thesisExamAssessmentForm/update/${row.row.original.id}`}>
				<MessageSquareMore className="h-6 w-6" color="#F26522" />
			</Link>
		),
	},
	{
		header: "รายละเอียด",
		cell: (row) => (
			<Link className="text-[#F26522] text-center" href={`/user/form/08-thesisExamAssessmentForm/${row.row.original.id}`}>
				คลิกเพื่อดูเพิ่มเติม
			</Link>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const form08 = row.original.id;
			const downloadPath = "";
			const updatePath = `/user/form/08-thesisExamAssessmentForm/superAdmin/update/${form08}`;
			const deleteAPI = process.env.NEXT_PUBLIC_URL + `/api/delete08FormById/${form08}`;
			const fetchAPI = process.env.NEXT_PUBLIC_URL + `/api/08ThesisExam/Form`;
			return <FormActionMenu downloadPath={downloadPath} updatePath={updatePath} deleteAPI={deleteAPI} fetchAPI={fetchAPI} />;
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
