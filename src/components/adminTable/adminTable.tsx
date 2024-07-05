"use Client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Form = {
	id: number;
	date: string;
	thesisNameTH: string;
	thesisNameEN: string;

	studentID: number;
	student: User;
	advisorID: number;
	advisor: User;
	coAdvisorID: number;
	coAdvisor: User;

	outlineCommitteeID: number;
	outlineCommittee: User;
	outlineCommitteeStatus: string;
	committee_outlineComment: string;
	dateOutlineCommitteeSign: string;

	instituteCommitteeID: number;
	instituteCommittee: User;
	instituteCommitteeStatus: string;
	instituteCommitteeComment: string;
	dateInstituteCommitteeSign: string;
};

type User = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	educationLevel: string;
	school: string;
	positions: string;
	program: string;
	programYear: string;
	advisorID: number;
	co_advisorID: number;
	signatureUrl: string;
};

interface AdminTableProps {
	formType: string | undefined;
	userId: number | undefined;
}

const formTypeMap: Record<string, string> = {
	outlineForm: "ทบ.20",
	"2": "ทบ.20",
	"3": "ทบ.20",
};

const FindStatus = ({
	formType,
	formData,
}: {
	formType: String | undefined;
	formData: Form;
}) => {
	let status = "";
	if (formType === "outlineForm") {
		if (
			formData.outlineCommitteeStatus == "APPROVE" &&
			formData.instituteCommitteeStatus == "APPROVE"
		) {
			status = "approve";
		} else if (
			formData.outlineCommitteeStatus == "NOT_APPROVE" ||
			formData.instituteCommitteeStatus == "NOT_APPROVE"
		) {
			status = "notApprove";
		} else if (
			formData.outlineCommitteeStatus == "" ||
			formData.instituteCommitteeStatus == ""
		) {
			status = "waiting";
		}
	} else if (formType === "form2") {
		status = "approve";
	}
	return (
		<>
			{status === "approve" ? (
				<div className="w-max text-green-500  rounded-xl border-2 border-green-400 px-4 py-2">
					อนุมัติ
				</div>
			) : status === "waiting" ? (
				<div className="w-max text-yellow-500  rounded-xl border-2 border-yellow-400 px-2 py-1">
					รอดำเนินการ
				</div>
			) : status == "notApprove" ? (
				<div className="w-max text-red-500  rounded-xl border-2 border-red-400 px-2 py-1">
					ไม่อนุมัติ
				</div>
			) : null}
		</>
	);
};

export default function AdminTable({ formType, userId }: AdminTableProps) {
	const [formData, setFormData] = useState<Form[] | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (formType == "outlineForm") {
			fetch(`/api/outlineForm`)
				.then((res) => res.json())
				.then((data) => setFormData(data))
				.catch((error) => console.log(error));
		}
	}, []);

	useEffect(() => {
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => setUser(data));
	}, []);

	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md px-2">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>วันที่สร้าง</TableHead>
							<TableHead>รหัสนักศึกษา</TableHead>
							<TableHead>ชื่อ นศ.</TableHead>
							<TableHead>ประเภทฟอร์ม</TableHead>
							<TableHead>สถานะ</TableHead>
							<TableHead>รายละเอียด</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData?.map((formData) => (
							<TableRow key={formData.id}>
								<TableCell>{formData.id}</TableCell>
								<TableCell>{formData.date}</TableCell>
								<TableCell>
									{formData?.student ? formData?.student.username : ""}
								</TableCell>
								<TableCell>
									{formData?.student
										? `${formData?.student?.firstName} ${formData?.student?.lastName}`
										: ""}
								</TableCell>
								<TableCell>{formType ? formTypeMap[formType] : ""}</TableCell>
								<TableCell>
									<FindStatus formType={formType} formData={formData} />
								</TableCell>
								<TableCell className="text-[#F26522]">
									<Link
										href={
											formData.outlineCommitteeID &&
											formData.instituteCommitteeID
												? `/user/form/${formType}/${formData.id}`
												: `/user/form/${formType}/update/${formData.id}`
										}
									>
										คลิกเพื่อดูเพิ่มเติม
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
