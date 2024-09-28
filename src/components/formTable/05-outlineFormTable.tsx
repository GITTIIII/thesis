"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import FormStatus from "../formStatus/formStatus";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";
import saveAs from "file-saver";

export default function OutlineFormTable({ formData, user }: { user: IUser; formData?: IOutlineForm[] }) {
	const { selectedForm } = useSelectForm();

	const handleDownload = async (formData: IOutlineForm) => {
		if (formData.formStatus === "อนุมัติ") {
			try {
				const response = await fetch(`/api/05OutlineForm/download?id=${formData.id}`);
				if (response.ok) {
					const blob = await response.blob();
					saveAs(blob, "FM-ENG-GRD-05.docx"); // Change the file name if needed
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
						{formData &&
							formData?.map((formData, index) => (
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
												user?.role == "STUDENT" && formData.formStatus == "เเก้ไข"
													? `/user/form/${FormPath[selectedForm]}/updateStd/${formData.id}`
													: formData.formStatus == "อนุมัติ" || user?.role == "STUDENT"
													? `/user/form/${FormPath[selectedForm]}/${formData.id}`
													: `/user/form/${FormPath[selectedForm]}/update/${formData.id}`
											}
										>
											คลิกเพื่อดูเพิ่มเติม
										</Link>
									</TableCell>
									<TableCell className="text-center">
										<Button
											onClick={() => handleDownload(formData)}
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
