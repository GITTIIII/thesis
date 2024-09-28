"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { IThesisProgressForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";
import Link from "next/link";
import saveAs from "file-saver";

export default function ThesisProgressFormTable({ formData, user }: { user: IUser; formData?: IThesisProgressForm[] }) {
	const { selectedForm } = useSelectForm();

	const handleDownload = async (formData: IThesisProgressForm) => {
		if (formData.headSchoolID) {
			try {
				const response = await fetch(`/api/06ThesisProgressForm/download?id=${formData.id}`);
				if (response.ok) {
					const blob = await response.blob();
					saveAs(blob, "FM-ENG-GRD-06.docx"); // Change the file name if needed
				} else {
					console.error("Failed to download file", response.statusText);
				}
			} catch (error) {
				console.error("Error downloading the file", error);
			}
		}
	};

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
							<TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData &&
							formData?.map((formData, index) => (
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
												(formData.dateAdvisor && formData.dateHeadSchool) || user?.role == "STUDENT"
													? `/user/form/${FormPath[selectedForm]}/${formData.id}`
													: `/user/form/${FormPath[selectedForm]}/update/${formData.id}`
											}
										>
											คลิกเพื่อดูเพิ่มเติม
										</Link>
									</TableCell>
									<TableCell className="text-center">
										<Button onClick={() => handleDownload(formData)} type="button" variant="outline">
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
