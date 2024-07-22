"use client";
import Image from "next/image";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import Stepper from "@/components/stepper/stepper";
import { use, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interface/user";
import OutlineFormTable from "@/components/formTable/05-outlineFormTable";
import ExamAppointmentFormTable from "@/components/formTable/07-thesisExamAppointmentFormTable";
import ThesisProgressFormTable from "@/components/formTable/06-thesisProgressFormTable";
import OutlineExamCommitteeFormTable from "@/components/formTable/03-outlineExamCommitteeFormTable";
import AppointmentThesisExamFormTable from "@/components/formTable/04-thesisExamCommitteeFormTable";
import ComprehensiveExamCommitteeFormTable from "@/components/formTable/01-comprehensiveExamCommitteeFormTable";
import QualificationExamCommitteeFormTable from "@/components/formTable/02-qualificationExamCommitteeFormTable";

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

export default function StudentTablePage() {
	const [userData, setUserData] = useState<IUser>();
	const [formType, setFormType] = useState("comprehensiveExamCommitteeForm");
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
					<Image src={studentFormPage} width={100} height={100} alt="documentation" />
					<label className="ml-5">ตารางฟอร์ม</label>
					<div className="w-max ml-auto">
						<Select onValueChange={handleSelect}>
							<SelectTrigger className="w-max">
								<SelectValue
									placeholder="แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้"
									defaultValue={"comprehensiveExamCommitteeForm"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 1}
									value="comprehensiveExamCommitteeForm"
								>
									แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้
								</SelectItem>
								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 2}
									value="qualificationExamCommitteeForm"
								>
									แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ
								</SelectItem>
								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 3}
									value="outlineExamCommitteeForm"
								>
									แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
								</SelectItem>

								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 4}
									value="appointmentThesisExamForm"
								>
									แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
								</SelectItem>

								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 5}
									value="outlineForm"
								>
									แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
								</SelectItem>

								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 6}
									value="thesisProgressForm"
								>
									เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
								</SelectItem>
								<SelectItem
									// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 7}
									value="examAppointment"
								>
									คำขอนัดสอบวิทยานิพนธ์
								</SelectItem>
							</SelectContent>
						</Select>
						{userData?.role.toString() === "STUDENT" && (
							<Button
								type="button"
								variant="outline"
								className="mt-4"
								onClick={() => router.push(`/user/form/${formType}/create`)}
							>
								เพิ่มฟอร์ม
							</Button>
						)}
					</div>
				</div>
				<div className="h-full w-full flex items-center py-4">
					{formType == "comprehensiveExamCommitteeForm" && <ComprehensiveExamCommitteeFormTable userData={userData} />}
					{formType == "qualificationExamCommitteeForm" && <QualificationExamCommitteeFormTable />}
					{formType == "outlineExamCommitteeForm" && <OutlineExamCommitteeFormTable />}
					{formType == "appointmentThesisExamForm" && <AppointmentThesisExamFormTable />}
					{formType == "outlineForm" && <OutlineFormTable userData={userData} />}
					{formType == "thesisProgressForm" && <ThesisProgressFormTable />}
					{formType == "examAppointment" && <ExamAppointmentFormTable />}
				</div>
			</div>
		</>
	);
}
