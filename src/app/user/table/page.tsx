"use client";
import Image from "next/image";
import Stepper from "@/components/stepper/stepper";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interface/user";
import ComprehensiveExamCommitteeFormTable from "@/components/formTable/01-comprehensiveExamCommitteeFormTable";
import QualificationExamCommitteeFormTable from "@/components/formTable/02-qualificationExamCommitteeFormTable";
import OutlineExamCommitteeFormTable from "@/components/formTable/03-outlineExamCommitteeFormTable";
import ThesisExamCommitteeFormTable from "@/components/formTable/04-thesisExamCommitteeFormTable";
import OutlineFormTable from "@/components/formTable/05-outlineFormTable";
import ThesisProgressFormTable from "@/components/formTable/06-thesisProgressFormTable";
import ExamAppointmentFormTable from "@/components/formTable/07-thesisExamAppointmentFormTable";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import createForm from "@/../../public/asset/createForm.png";

const labels: { [key: string]: string } = {
	comprehensiveExamCommitteeForm: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้",
	qualificationExamCommitteeForm: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ",
	outlineExamCommitteeForm: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์",
	appointmentThesisExamForm: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์",
	outlineForm: "แบบคำขออนุมัติโครงร่างวิทยานิพนธ์",
	thesisProgressForm: "เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์",
	examAppointment: "คำขอนัดสอบวิทยานิพนธ์",
};

async function get05ApprovedForm() {
	const res = await fetch("/api/get05ApprovedForm");
	return res.json();
}

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

export default function StudentTablePage() {
	const searchParams = useSearchParams().get("formType");
	const [userData, setUserData] = useState<IUser>();
	const [formType, setFormType] = useState(searchParams ? searchParams : "comprehensiveExamCommitteeForm");
	const [isDisabled, setIsDisabled] = useState(false);
	const router = useRouter();

	const handleSelect = (value: String) => {
		setFormType(value.toString());
	};

	useEffect(() => {
		async function fetchData() {
			const data = await get05ApprovedForm();
			if (data.length != 0) {
				setIsDisabled(true);
			}
		}
		if (formType === "outlineForm" && userData?.role.toString() === "STUDENT") {
			fetchData();
		}
		setIsDisabled(false);
	}, [formType, userData]);

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
					<label className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-xl">
						{labels[formType]}
					</label>
				</div>
				<div className="w-max ml-auto flex flex-col sm:flex-row items-center justify-center">
					<Select onValueChange={handleSelect} defaultValue={searchParams ? searchParams : ""}>
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
							variant="default"
							className="bg-[#F26522] w-auto text-md text-white rounded-md ml-auto sm:ml-4 border-[#F26522] mt-2 sm:mt-0"
							onClick={() => router.push(`/user/form/${formType}/create`)}
							disabled={isDisabled}
						>
							<Image src={createForm} width={24} height={24} alt={"createForm"} className="mr-2" />
							เพิ่มฟอร์ม
						</Button>
					)}
				</div>
				<div className="h-full w-full flex items-center py-4">
					{formType == "comprehensiveExamCommitteeForm" && (
						<ComprehensiveExamCommitteeFormTable userData={userData} />
					)}
					{formType == "qualificationExamCommitteeForm" && (
						<QualificationExamCommitteeFormTable userData={userData} />
					)}
					{formType == "outlineExamCommitteeForm" && <OutlineExamCommitteeFormTable userData={userData} />}
					{formType == "appointmentThesisExamForm" && <ThesisExamCommitteeFormTable userData={userData} />}
					{formType == "outlineForm" && <OutlineFormTable userData={userData} />}
					{formType == "thesisProgressForm" && <ThesisProgressFormTable userData={userData} />}
					{formType == "examAppointment" && <ExamAppointmentFormTable userData={userData} />}
				</div>
			</div>
		</>
	);
}
