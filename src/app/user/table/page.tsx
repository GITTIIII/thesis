"use client";
import Image from "next/image";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import Stepper from "@/components/stepper/stepper";
import { use, useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interface/user";
import OutlineFormTable from "@/components/formTable/outlineFormTable";
import ExamAppointmentFormTable from "@/components/formTable/examAppointmentFormTable";
import ThesisProgressFormTable from "@/components/formTable/thesisProgressFormTable";
import OutlineExamCommitteeFormTable from "@/components/formTable/outlineExamCommitteeFormTable";
import ThesisExamCommitteeFormTable from "@/components/formTable/thesisExamCommitteeFormTable";

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

export default function StudentTablePage() {
	const [userData, setUserData] = useState<IUser>();
	const [formType, setFormType] = useState("outlineForm");
	const router = useRouter();

	const handleSelect = (value: String) => {
		setFormType(value.toString());
	};

	useEffect(() => {
		async function fetchData() {
			const userData = await getCurrentUser();
			setUserData(userData);
		}
		fetchData();
	}, []);

	return (
		<>
			<div className="w-full h-full bg-transparent py-12 px-2 lg:px-28">
				{userData?.role.toString() == "STUDENT" && (
					<div className="w-full h-max p-4 flex justify-center items-center">
						<Stepper step={userData?.formState ?? 0} />
					</div>
				)}
				<div className="h-max w-full flex items-center text-2xl p-2">
					<Image
						src={studentFormPage}
						width={100}
						height={100}
						alt="documentation"
					/>
					<label className="ml-5">ตารางฟอร์ม</label>
					<div className="w-max ml-auto">
						<Select onValueChange={handleSelect}>
							<SelectTrigger className="w-max">
								<SelectValue
									placeholder="แบบคำขออนุมัติโครงร่างวิทยานิพนธ์"
									defaultValue={"outlineForm"}
								/>
							</SelectTrigger>
							<SelectContent>
								{(userData?.position.toString() ==
									"HEAD_INSTITUTE" ||
									userData?.position.toString() ==
										"ADVISOR") && (
									<SelectItem value="outlineExamCommitteeForm">
										แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
									</SelectItem>
								)}
								{(userData?.position.toString() ==
									"HEAD_INSTITUTE" ||
									userData?.position.toString() ==
										"ADVISOR") && (
									<SelectItem value="thesisExamCommitteeForm">
										แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
									</SelectItem>
								)}
								<SelectItem
									disabled={
										userData?.role.toString() ==
											"STUDENT" &&
										(userData?.formState ?? 0) < 1
									}
									value="outlineForm"
								>
									แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
								</SelectItem>

								<SelectItem
									disabled={
										userData?.role.toString() ==
											"STUDENT" &&
										(userData?.formState ?? 0) < 2
									}
									value="thesisProgressForm"
								>
									เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
								</SelectItem>
								<SelectItem
									disabled={
										userData?.role.toString() ==
											"STUDENT" &&
										(userData?.formState ?? 0) < 3
									}
									value="examAppointment"
								>
									คำขอนัดสอบวิทยานิพนธ์
								</SelectItem>
							</SelectContent>
						</Select>
						{(userData?.role.toString() === "STUDENT" ||
							(userData?.position.toString() ===
								"HEAD_INSTITUTE" &&
								formType === "outlineExamCommitteeForm") ||
							(userData?.position.toString() ===
								"HEAD_INSTITUTE" &&
								formType === "examCommitteeForm")) && (
							<Button
								type="button"
								variant="outline"
								className="mt-4"
								onClick={() =>
									router.push(`/user/form/${formType}/create`)
								}
							>
								เพิ่มฟอร์ม
							</Button>
						)}
					</div>
				</div>
				<div className="h-full w-full flex items-center py-4">
					{formType == "outlineExamCommitteeForm" && (
						<OutlineExamCommitteeFormTable />
					)}
					{formType == "thesisExamCommitteeForm" && (
						<ThesisExamCommitteeFormTable />
					)}
					{formType == "outlineForm" && (
						<OutlineFormTable userData={userData} />
					)}
					{formType == "thesisProgressForm" && (
						<ThesisProgressFormTable />
					)}
					{formType == "examAppointment" && (
						<ExamAppointmentFormTable />
					)}
				</div>
			</div>
		</>
	);
}
