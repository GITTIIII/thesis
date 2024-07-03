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

	committeeOutlineID: number;
	committeeOutline: User;
	committeeOutlineStatus: string;
	committee_outlineComment: string;
	dateCommitteeOutlineSign: string;

	committeeInstituteID: number;
	committeeInstitute: User;
	committeeInstituteStatus: string;
	committeeInstituteComment: string;
	dateCommitteeInstituteSign: string;
};

type User = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	educationLevel: string;
	school: string;
	program: string;
	programYear: string;
	advisorID: number;
	co_advisorID: number;
	signatureUrl: string;
};

interface AdminTableProps {
	formTypeNumber: string | undefined;
	userId: number | undefined;
}

const formTypeMap: Record<string, string> = {
	"1": "ทบ.20",
	"2": "ทบ.20",
	"3": "ทบ.20",
};

export default function AdminTable({
	formTypeNumber,
	userId,
}: AdminTableProps) {
	const [formData, setFormData] = useState<Form[] | null>(null);
	const router = useRouter();
	console.log(userId);
	useEffect(() => {
		if (formTypeNumber == "1") {
			fetch(`/api/outlineForm`)
				.then((res) => res.json())
				.then((data) => setFormData(data));
		}
	}, []);

	console.log(formData);
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
								<TableCell>{formData?.student ? formData?.student.username : ""}</TableCell>
								<TableCell>{formData?.student ? `${formData?.student?.firstName} ${formData?.student?.lastName}` : ""}</TableCell>
								<TableCell>
									{formTypeNumber ? formTypeMap[formTypeNumber] : ""}
								</TableCell>
								<TableCell>สถานะ</TableCell>
								<TableCell className="text-[#F26522]">
									<Link href={`/user/form/outlineForm/update/${formData.id}`}>
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
