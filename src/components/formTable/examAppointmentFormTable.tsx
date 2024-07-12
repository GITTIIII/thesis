"use Client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";

interface OutlineFormTableProps {
	userId: number | undefined;
}

const FindStatus = ({ formData }: { formData: IOutlineForm }) => {
	let status = "";

	if (
		formData?.outlineCommitteeStatus === "APPROVED" &&
		formData?.instituteCommitteeStatus === "APPROVED"
	) {
		status = "approve";
	} else if (
		formData?.outlineCommitteeStatus === "NOT_APPROVED" ||
		formData?.instituteCommitteeStatus === "NOT_APPROVED"
	) {
		status = "notApprove";
	} else if (
		formData?.outlineCommitteeStatus === null ||
		formData?.instituteCommitteeStatus === null
	) {
		status = "waiting";
	}

	return (
		<>
			{status != "" && status === "approve" ? (
				<div className="w-24 text-center text-green-500  rounded-xl border-2 border-green-400 py-1">
					อนุมัติ
				</div>
			) : status === "waiting" ? (
				<div className="w-24 text-center text-yellow-500  rounded-xl border-2 border-yellow-400 py-1">
					รอดำเนินการ
				</div>
			) : status == "notApprove" ? (
				<div className="w-24 text-center text-red-500  rounded-xl border-2 border-red-400 py-1">
					ไม่อนุมัติ
				</div>
			) : null}
		</>
	);
};

async function getFormData() {
	const res = await fetch(`/api/outlineForm`);
	return res.json();
}

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

const userPromise = getCurrentUser();
const formDataPromise = getFormData();

export default function ExamAppointmentFormTable({
	userId,
}: OutlineFormTableProps) {
	const formData: IOutlineForm[] = use(formDataPromise);
	const user: IUser = use(userPromise);
	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 ">
			<div className="w-full h-full flex justify-center items-center">คำขอนัดสอบวิทยานิพนธ์</div>
				{/* <Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ลำดับ</TableHead>
							<TableHead className="text-center">วันที่สอบ</TableHead>
							<TableHead className="text-center">รหัสนักศึกษา</TableHead>
							<TableHead className="text-center">ชื่อ นศ.</TableHead>
							<TableHead className="text-center">ประเภทฟอร์ม</TableHead>
							<TableHead className="text-center">สถานะ</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead
								hidden={user?.role != "STUDENT"}
								className="text-center"
							>
								ดาวน์โหลดฟอร์ม
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData
							?.filter(
								(formData) =>
									(user?.role === "STUDENT" &&
										user?.id === formData?.student?.id) ||
									user?.role != "STUDENT"
							)
							.map((formData, index) => (
								<TableRow
									key={formData.id}
									className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}
								>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">
										{formData.dateOutlineCommitteeSign
											? formData.dateOutlineCommitteeSign
											: "ยังไม่ทำการสอบ"}
									</TableCell>
									<TableCell className="text-center">
										{formData?.student.username}
									</TableCell>
									<TableCell className="text-center">{`${formData?.student?.firstName} ${formData?.student?.lastName}`}</TableCell>
									<TableCell className="text-center">
										เเบบคำขออนุมัติโครงร่างวิทยานิพนธ์
									</TableCell>
									<TableCell className="flex justify-center">
										<FindStatus formData={formData} />
									</TableCell>
									<TableCell className="text-[#F26522] text-center">
										<Link
											href={
												(formData.outlineCommitteeID &&
													formData.instituteCommitteeID) ||
												user?.role == "STUDENT"
													? `/user/form/outlineForm/${formData.id}`
													: `/user/form/outlineForm/update/${formData.id}`
											}
										>
											คลิกเพื่อดูเพิ่มเติม
										</Link>
									</TableCell>
									<TableCell
										hidden={user?.role != "STUDENT"}
										className="text-center"
									>
										<Button
											disabled={
												formData?.outlineCommitteeStatus === "APPROVED" &&
												formData?.instituteCommitteeStatus === "APPROVED"
													? false
													: true
											}
											type="button"
											variant="outline"
										>
											<Download className="mr-2" />
											ดาวน์โหลด
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table> */}
			</div>
		</>
	);
}
