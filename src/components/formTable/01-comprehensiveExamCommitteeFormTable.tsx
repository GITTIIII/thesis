"use Client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from "react";
import { Download } from "lucide-react";
import { IComprehensiveExamCommitteeForm } from "@/interface/form";
import { IUser } from "@/interface/user";

async function getFormData() {
	const res = await fetch(`/api/comprehensiveExamCommitteeForm`);
	return res.json();
}

const formDataPromise = getFormData();

export default function ComprehensiveExamCommitteeFormTable({ userData }: { userData: IUser | undefined }) {
	const formData: IComprehensiveExamCommitteeForm[] = use(formDataPromise);
	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 ">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ลำดับ</TableHead>
							<TableHead className="text-center">รหัสนักศึกษา</TableHead>
							<TableHead className="text-center">วันที่สร้าง</TableHead>
							<TableHead className="text-center">วันที่สอบ</TableHead>
							<TableHead className="text-center">ชื่อ นศ.</TableHead>
							<TableHead className="text-center">ประเภทฟอร์ม</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData
							?.filter(
								(formData) =>
									(userData?.role.toString() === "STUDENT" &&
										userData?.id === formData?.student?.id) ||
									userData?.role.toString() != "STUDENT"
							)
							.map((formData, index) => (
								<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">{formData?.student.username}</TableCell>
									<TableCell className="text-center">{formData.date}</TableCell>
									<TableCell className="text-center">{formData.examDay}</TableCell>
									<TableCell className="text-center">
										{formData.student.formLanguage == "en"
											? `${formData?.student?.firstNameEN} ${formData?.student?.lastNameEN}`
											: `${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
									</TableCell>
									<TableCell className="text-center">
										เเบบคำขออนุมัติเเต่งตั้งกรรมการสอบประมวลความรู้
									</TableCell>
									<TableCell className="text-[#F26522] text-center">
										<Link href={`/user/form/comprehensiveExamCommitteeForm/${formData.id}`}>
											คลิกเพื่อดูเพิ่มเติม
										</Link>
									</TableCell>
									<TableCell className="text-center">
										<Button type="button" variant="outline">
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
