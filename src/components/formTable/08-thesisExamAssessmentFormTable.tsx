"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";
import { IUser } from "@/interface/user";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";
import { useEffect, useState } from "react";
import { Search } from "./search";
import { FilterTable } from "./filter";
import { IOutlineForm, IThesisExamAssessmentForm } from "@/interface/form";
import saveAs from "file-saver";
import { HoverCardTable } from "./hoverCard";

export default function ThesisExamAssessmentFormTable({ formData, user }: { user: IUser; formData?: IThesisExamAssessmentForm[] }) {
	const { selectedForm } = useSelectForm();
	const [studentID, setStudentID] = useState("");
	const [myStudent, setMyStudent] = useState(false);
	const [status, setStatus] = useState("");
	const [approveForms, setApproveForms] = useState<{ [studentID: number]: IOutlineForm }>({});

	const filteredData = formData?.filter((formData) => {
		const matchesStudentID = studentID === "" || formData.student.username.includes(studentID);
		const matchesMyStudent =
			myStudent &&
			((user.role == "ADMIN" && user.position == "ADVISOR" && formData.student.advisorID == user.id) ||
				(status === "นักศึกษาในที่ปรึกษา" && formData.student.advisorID == user.id));

		const matchesFormStatus =
			status &&
			((status === "อนุมัติ" && formData.instituteCommitteeStatus == "อนุมัติ") ||
				(status === "ไม่อนุมัติ" && formData.instituteCommitteeStatus == "ไม่อนุมัติ"));

		return matchesStudentID && (!myStudent || matchesMyStudent) && (!status || matchesFormStatus);
	});

	const fetchApproveForm = async (studentID: number) => {
		const res = await fetch(process.env.NEXT_PUBLIC_URL + `/api/get05ApprovedFormByStdId/${studentID}`);
		const data = await res.json();
		// Store the data in the state, mapping it by studentID
		setApproveForms((prev) => ({ ...prev, [studentID]: data }));
	};

	useEffect(() => {
		if (filteredData) {
			filteredData.forEach((formData) => {
				fetchApproveForm(formData.studentID);
			});
		}
	}, []);

	const handleDownload = async (formData: IThesisExamAssessmentForm) => {
		if (formData.instituteCommitteeID) {
			try {
				const response = await fetch(process.env.NEXT_PUBLIC_URL + `/api/08ThesisExamAssessmentForm/download?id=${formData.id}`);
				if (response.ok) {
					const blob = await response.blob();
					saveAs(blob, "FM-ENG-GRD-08.docx"); // Change the file name if needed
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
						filterMyStudent={user.role != "STUDENT"}
						filterAdvisor={false}
						filterHeadSchool={false}
						setMyStudent={setMyStudent}
						setStatus={setStatus}
					/>
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
							<TableHead className="text-center">ผลการพิจารณาการสอบวิทยานิพนธ์</TableHead>
							<TableHead className="text-center">ผลการพิจารณาของคณะกรรมการประจำสำนักวิชา</TableHead>
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
										<HoverCardTable
											data={
												formData.examDate ? new Date(formData.examDate).toLocaleDateString("th") : "ยังไม่ทำการสอบ"
											}
										/>
									</TableCell>
									<TableCell className="text-center truncate">
										<HoverCardTable data={approveForms[formData.studentID]?.thesisNameTH || "กำลังโหลด..."} />
									</TableCell>
									<TableCell className="text-center truncate">
										<HoverCardTable data={approveForms[formData.studentID]?.thesisNameEN || "กำลังโหลด..."} />
									</TableCell>
									<TableCell className="text-center truncate">
										<HoverCardTable data={formData?.student.username} />
									</TableCell>
									<TableCell className="text-center truncate">
										<HoverCardTable data={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`} />
									</TableCell>
									<TableCell className="text-center truncate">
										{formData.result ? formData.result : <span className="text-orange-600">รอผลการประเมิน</span>}
									</TableCell>
									<TableCell className="text-center truncate">
										{formData.instituteCommitteeStatus ? (
											formData.instituteCommitteeStatus
										) : (
											<span className="text-orange-600">รอผลการประเมิน</span>
										)}
									</TableCell>
									<TableCell className="text-[#F26522] text-center truncate">
										<Link
											href={
												formData.instituteCommitteeID || user?.role == "STUDENT"
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
