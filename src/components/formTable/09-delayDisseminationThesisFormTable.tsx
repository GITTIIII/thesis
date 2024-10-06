"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";
import { IDelayThesisForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "../formPath/formPath";
import { useState } from "react";
import { Search } from "./search";
import { FilterTable } from "./filter";

export default function DelayDisseminationThesisFormTable({ formData, user }: { user: IUser; formData?: IDelayThesisForm[] }) {
	const { selectedForm } = useSelectForm();
	const [studentID, setStudentID] = useState("");
	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md p-2 overflow-auto ">
				<div className="w-max flex px-2 mb-2">
					<FilterTable />
					<Search studentID={studentID} setStudentID={setStudentID} />
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ลำดับ</TableHead>
							<TableHead className="text-center">วันที่สร้าง</TableHead>
							<TableHead className="text-center">ชื่อวิทยานิพนธ์</TableHead>
							<TableHead className="text-center">Thesis name</TableHead>
							<TableHead className="text-center">รหัสนักศึกษา</TableHead>
							<TableHead className="text-center">ชื่อ นศ.</TableHead>
							<TableHead className="text-center">วารสาร</TableHead>
							<TableHead className="text-center">ตั้งแต่วันที่</TableHead>
							<TableHead className="text-center">จนถึงวันที่</TableHead>
							<TableHead className="text-center">อนุมัติ</TableHead>
							<TableHead className="text-center">รายละเอียด</TableHead>
							<TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formData &&
							formData
								.filter((formData) => studentID === "" || formData.student.username.includes(studentID))
								.map((formData, index) => (
									<TableRow key={formData.id} className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}>
										<TableCell className="text-center">{index + 1}</TableCell>
										<TableCell className="text-center">{new Date(formData.date).toLocaleDateString("th")}</TableCell>
										<TableCell className="text-center">{formData?.thesisNameTH}</TableCell>
										<TableCell className="text-center">{formData?.thesisNameEN}</TableCell>
										<TableCell className="text-center">{formData?.student.username}</TableCell>
										<TableCell className="text-center">
											{`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
										</TableCell>
										<TableCell className="text-center">{formData?.publishmentName}</TableCell>
										<TableCell className="text-center">
											{new Date(formData.startDate).toLocaleDateString("th")}
										</TableCell>
										<TableCell className="text-center">
											{new Date(formData.endDate).toLocaleDateString("th")}
										</TableCell>
										<TableCell className="text-center">
											{formData?.approve ? (formData.approve ==="approve" ? "อนุมัติ" : "ไม่อนุมัติ" ): "รอการอนุมัติ"}
										</TableCell>
										<TableCell className="text-[#F26522] text-center">
											<Link
												href={
													user?.role == "SUPER_ADMIN" || user?.role == "STUDENT"
														? `/user/form/${FormPath[selectedForm]}/${formData.id}`
														: `/user/form/${FormPath[selectedForm]}/update/${formData.id}`
												}
											>
												คลิกเพื่อดูเพิ่มเติม
											</Link>
										</TableCell>
										<TableCell className="text-center">
											<Button disabled={user?.role !== "SUPER_ADMIN"} type="button" variant="outline">
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
