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
import { useState } from "react";
import { Search } from "./search";
import { FilterTable } from "./filter";
import { HoverCardTable } from "./hoverCard";
export default function OutlineFormTable({ formData, user }: { user: IUser; formData?: IOutlineForm[] }) {
	const { selectedForm } = useSelectForm();
	const [studentID, setStudentID] = useState("");

	const [status, setStatus] = useState("");

	const filteredData = formData?.filter((formData) => {
		const matchesStudentID = studentID === "" || formData.student.username.includes(studentID);
		const matchesFormStatus =
			status &&
			((status === "อนุมัติ" && formData.formStatus == "อนุมัติ") ||
				(status === "รอดำเนินการ" && formData.formStatus == "รอดำเนินการ") ||
				(status === "เเก้ไข" && formData.formStatus == "เเก้ไข") ||
				(status === "เเก้ไขเเล้ว" && formData.formStatus == "เเก้ไขเเล้ว") ||
				(status === "ไม่อนุมัติ" && formData.formStatus == "ไม่อนุมัติ"));

		return matchesStudentID && (!status || matchesFormStatus);
	});
	const handleDownload = async (formData: IOutlineForm) => {
		if (formData.formStatus === "อนุมัติ") {
			try {
				const response = await fetch(`/api/05OutlineForm/download?id=${formData.id}`);
				if (response.ok) {
					const blob = await response.blob();
					saveAs(blob, "FM-ENG-GRD-05.zip"); // Change the file name if needed
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
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 overflow-auto">
				<div className="w-max flex px-2 mb-2">
					<FilterTable filterAdvisor={false} filterHeadSchool={false} filterFormStatus={true} setStatus={setStatus} />
					<Search studentID={studentID} setStudentID={setStudentID} />
				</div>
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
							filteredData?.map((formData, index) => (
								<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">
										<HoverCardTable
											data={
												formData.dateOutlineCommitteeSign
													? new Date(formData.dateOutlineCommitteeSign).toLocaleDateString("th")
													: "ยังไม่ทำการสอบ"
											}
										/>
									</TableCell>
									<TableCell className="text-center" title={formData?.thesisNameTH}>
										<HoverCardTable data={formData?.thesisNameTH || ""} />
									</TableCell>
									<TableCell className="text-center" title={formData?.thesisNameEN}>
										<HoverCardTable data={formData?.thesisNameEN || ""} />
									</TableCell>
									<TableCell className="text-center" title={formData?.student.username}>
										<HoverCardTable data={formData?.student.username || ""} />
									</TableCell>
									<TableCell
										className="text-center"
										title={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
									>
										<HoverCardTable data={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`} />
									</TableCell>
									<TableCell className="flex items-center justify-center">
										<FormStatus formStatus={formData.formStatus} />
									</TableCell>
									<TableCell className="text-[#F26522] text-center truncate">
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
