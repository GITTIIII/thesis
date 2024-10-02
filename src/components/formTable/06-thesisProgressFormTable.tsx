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
import { useState } from "react";
import { Search } from "./search";
import { FilterTable } from "./filter";
import { HoverCardTable } from "./hoverCard";
export default function ThesisProgressFormTable({ formData, user }: { user: IUser; formData?: IThesisProgressForm[] }) {
	const { selectedForm } = useSelectForm();
	const [studentID, setStudentID] = useState("");
	const [advisor, setAdvisor] = useState(false);
	const [headSchool, setHeadSchool] = useState(false);
	const [status, setStatus] = useState("");

	const filteredData = formData?.filter((formData) => {
		const matchesStudentID = studentID === "" || formData.student.username.includes(studentID);
		const matchesAdvisor =
			advisor &&
			((status === "มีการเซ็นเรียบร้อยแล้ว" && formData.advisorSignUrl) || (status === "กำลังรอการเซ็น" && !formData.advisorSignUrl));
		const matchesHeadSchool =
			headSchool &&
			((status === "มีการเซ็นเรียบร้อยแล้ว" && formData.headSchoolID) || (status === "กำลังรอการเซ็น" && !formData.headSchoolID));

		return matchesStudentID && (!advisor || matchesAdvisor) && (!headSchool || matchesHeadSchool);
	});
	const handleDownload = async (formData: IThesisProgressForm) => {
		if (formData.headSchoolID) {
			try {
				const response = await fetch(`/api/06ThesisProgressForm/download?id=${formData.id}`);
				if (response.ok) {
					const blob = await response.blob();
					saveAs(blob, "FM-ENG-GRD-06.zip"); // Change the file name if needed
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
				<div className="w-max flex px-2 mb-2">
					<FilterTable
						filterAdvisor={true}
						filterHeadSchool={true}
						filterFormStatus={false}
						setAdvisor={setAdvisor}
						setHeadSchool={setHeadSchool}
						setStatus={setStatus}
					/>
					<Search studentID={studentID} setStudentID={setStudentID} />
				</div>
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
							<TableHead className="text-center">สถานะลายเซ็นอาจารย์ที่ปรึกษา</TableHead>
							<TableHead className="text-center">สถานะลายเซ็นหัวหน้าสาขาวิชา</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData &&
							filteredData?.map((formData, index) => (
								<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d] h-[52px]` : "" + `h-[52px]`}>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">
										<HoverCardTable data={formData.trimester.toString()} />
									</TableCell>
									<TableCell className="text-center">
										<HoverCardTable
											data={formData.status === "Adjustments" ? "เปลี่ยนเเปลงเเผนงาน" : "เป็นไปตามเเผนงานที่วางไว้"}
										/>
									</TableCell>
									<TableCell className="text-center">
										<HoverCardTable data={formData.percentage + "%"} />
									</TableCell>
									<TableCell className="text-center">
										<HoverCardTable data={new Date(formData.date).toLocaleDateString("th")} />
									</TableCell>
									<TableCell className="text-center">
										<HoverCardTable data={formData?.student.username} />
									</TableCell>
									<TableCell className="text-center">
										<HoverCardTable data={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`} />
									</TableCell>
									<TableCell className="text-center truncate">
										{formData.advisorSignUrl ? (
											<span className="text-green-500">มีการเซ็นเรียบร้อยแล้ว</span>
										) : (
											<span className="text-orange-600">กำลังรอการเซ็น</span>
										)}
									</TableCell>
									<TableCell className="text-center truncate">
										{formData.headSchoolID ? (
											<span className="text-green-500">มีการเซ็นเรียบร้อยแล้ว</span>
										) : (
											<span className="text-orange-600">กำลังรอการเซ็น</span>
										)}
									</TableCell>
									<TableCell className="text-[#F26522] text-center truncate">
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
