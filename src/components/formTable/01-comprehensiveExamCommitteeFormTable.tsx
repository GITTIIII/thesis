"use Client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DownloadIcon } from "lucide-react";
import { IComprehensiveExamCommitteeForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";

async function get01FormByStdId(stdId: number | undefined) {
	if (stdId) {
		const res = await fetch(`/api/get01FormByStdId/${stdId}`, {
			next: { revalidate: 10 },
		});
		return res.json();
	}
}

async function get01FormData() {
	const res = await fetch(`/api/01ComprehensiveExamCommitteeForm`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

const handleDownload = async (formData: IComprehensiveExamCommitteeForm) => {
	if (formData.headSchoolID) {
		try {
			const response = await fetch(`/api/01ComprehensiveExamCommitteeForm/download?id=${formData.id}`);
			if (response.ok) {
				const blob = await response.blob();
				saveAs(blob, "FM-ENG-GRD-01.docx"); // Change the file name if needed
			} else {
				console.error("Failed to download file", response.statusText);
			}
		} catch (error) {
			console.error("Error downloading the file", error);
		}
	}
};

export default function ComprehensiveExamCommitteeFormTable({ userData }: { userData: IUser | undefined }) {
	const [formData, setFormData] = useState<IComprehensiveExamCommitteeForm[]>();
	const { selectedForm, setSelectedForm } = useSelectForm();

	useEffect(() => {
		async function fetchData() {
			if (userData?.role === "STUDENT") {
				const formData = await get01FormByStdId(userData?.id);
				setFormData(formData);
			} else {
				const formData = await get01FormData();
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
							<TableHead className="text-center">รหัสนักศึกษา</TableHead>
							<TableHead className="text-center">ชื่อ นศ.</TableHead>
							<TableHead className="text-center">สอบครั้งที่</TableHead>
							<TableHead className="text-center">วันที่สอบ</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData
							?.filter(
								(formData) =>
									(userData?.role === "STUDENT" && userData?.id === formData?.student?.id) || userData?.role != "STUDENT"
							)
							.map((formData, index) => (
								<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}>
									<TableCell className="text-center">{index + 1}</TableCell>
									<TableCell className="text-center">{new Date(formData.date).toLocaleDateString("th")}</TableCell>
									<TableCell className="text-center">{formData.trimester}</TableCell>
									<TableCell className="text-center">{formData.academicYear}</TableCell>
									<TableCell className="text-center">{formData?.student.username}</TableCell>
									<TableCell className="text-center">
										{`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
									</TableCell>
									<TableCell className="text-center">{formData.times}</TableCell>
									<TableCell className="text-center">{new Date(formData.examDay).toLocaleDateString("th")}</TableCell>
									<TableCell className="text-[#F26522] text-center">
										<Link
											href={
												formData.headSchoolID || userData?.role == "STUDENT"
													? `/user/form/${FormPath[selectedForm]}/${formData.id}`
													: `/user/form/${FormPath[selectedForm]}/update/${formData.id}`
											}
										>
											คลิกเพื่อดูเพิ่มเติม
										</Link>
									</TableCell>
									<TableCell className="text-center">
										{formData && (
											<Button
												onClick={() => handleDownload(formData)}
												disabled={!formData.headSchoolID}
												type="button"
												variant="outline"
											>
												<DownloadIcon className="mr-2" />
												ดาวน์โหลด
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
