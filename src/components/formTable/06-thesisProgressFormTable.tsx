"use Client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { IThesisProgressForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";


async function getAll06FormByStdId(stdId: number | undefined) {
	if (stdId) {
		const res = await fetch(`/api/get06FormByStdId/${stdId}`, {
			next: { revalidate: 10 },
		});
		return res.json();
	}
}

async function getAll06Form() {
	const res = await fetch(`/api/06ThesisProgressForm`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

export default function ThesisProgressFormTable({ userData }: { userData: IUser | undefined }) {
	const [formData, setFormData] = useState<IThesisProgressForm[]>();
	const { selectedForm, setSelectedForm } = useSelectForm();
	useEffect(() => {
		async function fetchData() {
			if (userData?.role.toString() === "STUDENT") {
				const formData = await getAll06FormByStdId(userData?.id);
				setFormData(formData);
			} else {
				const formData = await getAll06Form();
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
							<TableHead className="text-center">ภาคการศึกษา</TableHead>
							<TableHead className="text-center">สถานะ</TableHead>
							<TableHead className="text-center">เปอร์เซ็นต์</TableHead>
							<TableHead className="text-center">วันที่สร้าง</TableHead>
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
							<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d] h-[52px]` : "" + `h-[52px]`}>
								<TableCell className="text-center">{index + 1}</TableCell>
								<TableCell className="text-center">{formData.trimester}</TableCell>
								<TableCell className="text-center">
									{formData.status === "Adjustments" ? "เปลี่ยนเเปลงเเผนงาน" : "เป็นไปตามเเผนงานที่วางไว้"}
								</TableCell>
								<TableCell className="text-center">{formData.percentage}%</TableCell>
								<TableCell className="text-center">{new Date(formData.date).toLocaleDateString("th")}</TableCell>
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
