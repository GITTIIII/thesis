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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { IForm } from "@/interface/form";
import { IUser } from "@/interface/user";

interface FormTableProps {
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
	formData: IForm;
}) => {
	let status = "";
	if (formType === "outlineForm") {
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
	} else if (formType === "form2") {
		status = "approve";
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

export default function FormTable({ formType, userId }: FormTableProps) {
	const [formData, setFormData] = useState<IForm[] | null>(null);
	const [user, setUser] = useState<IUser | null>(null);
	const router = useRouter();
	console.log(userId);
	useEffect(() => {
		if (formType == "outlineForm" && userId) {
			if (user?.role == "STUDENT") {
				fetch(`/api/getAllOutlineFormByStdId/${userId}`)
					.then((res) => res.json())
					.then((data) => setFormData(data))
					.catch((error) => console.log(error));
			} else {
				fetch(`/api/outlineForm`)
					.then((res) => res.json())
					.then((data) => setFormData(data))
					.catch((error) => console.log(error));
			}
		}
	}, [userId]);

	useEffect(() => {
		fetch(`/api/user`)
			.then((res) => res.json())
			.then((data) => setUser(data))
			.catch((error) => console.log(error));
	}, []);

	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 ">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ลำดับ</TableHead>
							<TableHead className="text-center">วันที่สร้าง</TableHead>
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
						{formData?.map((formData, index) => (
							<TableRow
								key={formData.id}
								className={formData.id % 2 == 0 ? `bg-[#f0c38d3d]` : ""}
							>
								<TableCell className="text-center">{index + 1}</TableCell>
								<TableCell className="text-center">{formData.date}</TableCell>
								<TableCell className="text-center">
									{formData?.student.username}
								</TableCell>
								<TableCell className="text-center">{`${formData?.student?.firstName} ${formData?.student?.lastName}`}</TableCell>
								<TableCell className="text-center">
									{formType ? formTypeMap[formType] : ""}
								</TableCell>
								<TableCell className="flex justify-center">
									<FindStatus formType={formType} formData={formData} />
								</TableCell>
								<TableCell className="text-[#F26522] text-center">
									<Link
										href={
											(formData.outlineCommitteeID &&
												formData.instituteCommitteeID) ||
											user?.role == "STUDENT"
												? `/user/form/${formType}/${formData.id}`
												: `/user/form/${formType}/update/${formData.id}`
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
				</Table>
			</div>
		</>
	);
}
