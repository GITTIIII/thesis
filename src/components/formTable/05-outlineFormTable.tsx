"use Client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import FormStatus from "../formStatus/formStatus";

async function getAll05FormByStdId(stdId: number | undefined) {
	if (stdId) {
		const res = await fetch(`/api/get05FormByStdId/${stdId}`, {
			next: { revalidate: 10 },
		});
		return res.json();
	}
}

async function getAll05Form() {
	const res = await fetch(`/api/05OutlineForm`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

export default function OutlineFormTable({ userData }: { userData: IUser | undefined }) {
	const [formData, setFormData] = useState<IOutlineForm[]>();

	useEffect(() => {
		async function fetchData() {
			if (userData?.role.toString() === "STUDENT") {
				const formData = await getAll05FormByStdId(userData?.id);
				setFormData(formData);
			} else {
				const formData = await getAll05Form();
				setFormData(formData);
			}
		}
		fetchData();
	}, [userData]);

	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 overflow-auto ">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ลำดับ</TableHead>
							<TableHead className="text-center">วันที่สอบ</TableHead>
							<TableHead className="text-center">ชื่อวิทยานิพนธ์ (ไทย)</TableHead>
							<TableHead className="text-center">ชื่อวิทยานิพนธ์ (อังกฤษ)</TableHead>
							<TableHead className="text-center">รหัสนักศึกษา</TableHead>
							<TableHead className="text-center">ชื่อ นศ.</TableHead>
							<TableHead className="text-center">สถานะ</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData?.map((formData, index) => (
							<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}>
								<TableCell className="text-center">{index + 1}</TableCell>
								<TableCell className="text-center">
									{formData.dateOutlineCommitteeSign
										? new Date(formData.dateOutlineCommitteeSign).toLocaleDateString("th")
										: "ยังไม่ทำการสอบ"}
								</TableCell>
								<TableCell className="text-center">{formData?.thesisNameTH}</TableCell>
								<TableCell className="text-center">{formData?.thesisNameEN}</TableCell>
								<TableCell className="text-center">{formData?.student.username}</TableCell>
								<TableCell className="text-center">
									{`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
								</TableCell>
								<TableCell className="flex justify-center">
									<FormStatus formStatus={formData.formStatus} />
								</TableCell>
								<TableCell className="text-[#F26522] text-center">
									<Link
										href={
											formData.formStatus == "อนุมัติ"
												? `/user/form/outlineForm/${formData.id}`
												: userData?.role.toString() == "STUDENT" && formData.formStatus == "เเก้ไข"
												? `/user/form/outlineForm/updateStd/${formData.id}`
												: `/user/form/outlineForm/update/${formData.id}`
										}
									>
										คลิกเพื่อดูเพิ่มเติม
									</Link>
								</TableCell>
								<TableCell className="text-center">
									<Button
										disabled={formData.formStatus != "อนุมัติ"}
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
