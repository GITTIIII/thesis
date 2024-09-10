"use Client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { IThesisExamAppointmentForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";


async function getAll07FormByStdId(stdId: number | undefined) {
	if (stdId) {
		const res = await fetch(`/api/get07FormByStdId/${stdId}`, {
			next: { revalidate: 10 },
		});
		return res.json();
	}
}

async function getAll07Form() {
	const res = await fetch(`/api/07ThesisExamAppointmentForm`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

export default function ThesisExamAppointmentFormTable({ userData }: { userData: IUser | undefined }) {
	const [formData, setFormData] = useState<IThesisExamAppointmentForm[]>();
	const { selectedForm, setSelectedForm } = useSelectForm();

	useEffect(() => {
		async function fetchData() {
			if (userData?.role.toString() === "STUDENT") {
				const formData = await getAll07FormByStdId(userData?.id);
				setFormData(formData);
			} else {
				const formData = await getAll07Form();
				setFormData(formData);
			}
		}
		fetchData();
	}, [userData]);

	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 ">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ลำดับ</TableHead>
							<TableHead className="text-center">วันที่สร้าง</TableHead>
							<TableHead className="text-center">ภาคการศึกษา</TableHead>
							<TableHead className="text-center">ปีการศึกษา</TableHead>
							<TableHead className="text-center">GPA</TableHead>
							<TableHead className="text-center">หน่วยกิต</TableHead>
							<TableHead className="text-center">วันที่นัดสอบ</TableHead>
							<TableHead className="text-center">รหัสนักศึกษา</TableHead>
							<TableHead className="text-center">ชื่อ นศ.</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead hidden={userData?.role.toString() != "STUDENT"} className="text-center">
								ดาวน์โหลดฟอร์ม
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData?.map((formData, index) => (
							<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}>
								<TableCell className="text-center">{index + 1}</TableCell>
								<TableCell className="text-center">{new Date(formData.date).toLocaleDateString("th")}</TableCell>
								<TableCell className="text-center">{formData.trimester}</TableCell>
								<TableCell className="text-center">{formData.academicYear}</TableCell>
								<TableCell className="text-center">{formData.gpa}</TableCell>
								<TableCell className="text-center">{formData.credits}</TableCell>
								<TableCell className="text-center">{new Date(formData.dateExam).toLocaleDateString("th")}</TableCell>
								<TableCell className="text-center">{formData?.student.username}</TableCell>
								<TableCell className="text-center">
									{`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
								</TableCell>
								<TableCell className="text-[#F26522] text-center">
									<Link
										href={
											(formData.dateAdvisor && formData.dateHeadSchool) || userData?.role.toString() == "STUDENT"
												? `/user/form/${FormPath[selectedForm]}/${formData.id}`
												: `/user/form/${FormPath[selectedForm]}/update/${formData.id}`
										}
									>
										คลิกเพื่อดูเพิ่มเติม
									</Link>
								</TableCell>
								<TableCell hidden={userData?.role.toString() != "STUDENT"} className="text-center">
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
