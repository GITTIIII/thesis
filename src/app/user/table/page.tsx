"use client";
import Image from "next/image";
import Stepper from "@/components/stepper/stepper";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interface/user";
import { useSelectForm } from "@/hook/selectFormHook";
import ComprehensiveExamCommitteeFormTable from "@/components/formTable/01-comprehensiveExamCommitteeFormTable";
import QualificationExamCommitteeFormTable from "@/components/formTable/02-qualificationExamCommitteeFormTable";
import OutlineExamCommitteeFormTable from "@/components/formTable/03-outlineExamCommitteeFormTable";
import ThesisExamCommitteeFormTable from "@/components/formTable/04-thesisExamCommitteeFormTable";
import OutlineFormTable from "@/components/formTable/05-outlineFormTable";
import ThesisProgressFormTable from "@/components/formTable/06-thesisProgressFormTable";
import ExamAppointmentFormTable from "@/components/formTable/07-thesisExamAppointmentFormTable";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import createForm from "@/../../public/asset/createForm.png";
import useSWR from "swr";
import { FormPath } from "@/components/formPath/formPath";

const labels: { [key: string]: string } = {
	form01: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้",
	form02: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ",
	form03: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์",
	form04: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์",
	form05: "แบบคำขออนุมัติโครงร่างวิทยานิพนธ์",
	form06: "เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์",
	form07: "คำขอนัดสอบวิทยานิพนธ์",
};

async function get05ApprovedForm() {
	const res = await fetch("/api/get05ApprovedForm");
	return res.json();
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentTablePage() {
	const { data: userData } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { selectedForm, setSelectedForm } = useSelectForm();
	const [isDisabled, setIsDisabled] = useState(false);
	const router = useRouter();

	const handleSelectChange = (value: string) => {
		setSelectedForm(value);
	};

	useEffect(() => {
		async function fetchData() {
			const data = await get05ApprovedForm();
			if (data && data.length != 0) {
				setIsDisabled(true);
			}
		}
		if (selectedForm === "outlineForm" && userData?.role.toString() === "STUDENT") {
			fetchData();
		}
		setIsDisabled(false);
	}, [selectedForm, userData]);

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
						{labels[selectedForm]}
					</label>
				</div>
				<div className="w-max ml-auto flex flex-col sm:flex-row items-center justify-center">
					<Select onValueChange={handleSelectChange} defaultValue={selectedForm}>
						<SelectTrigger className="w-max">
							<SelectValue placeholder="แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้" defaultValue={"form01"} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 1}
								value="form01"
							>
								แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้
							</SelectItem>
							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 2}
								value="form02"
							>
								แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ
							</SelectItem>
							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 3}
								value="form03"
							>
								แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
							</SelectItem>

							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 4}
								value="form04"
							>
								แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
							</SelectItem>

							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 5}
								value="form05"
							>
								แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
							</SelectItem>

							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 6}
								value="form06"
							>
								เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
							</SelectItem>
							<SelectItem
								// disabled={userData?.role.toString() == "STUDENT" && (userData?.formState ?? 0) < 7}
								value="form07"
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
							onClick={() => router.push(`/user/form/${FormPath[selectedForm]}/create`)}
							disabled={isDisabled}
						>
							<Image src={createForm} width={24} height={24} alt={"createForm"} className="mr-2" />
							เพิ่มฟอร์ม
						</Button>
					)}
				</div>
				<div className="h-full w-full flex items-center py-4">
					{selectedForm == "form01" && <ComprehensiveExamCommitteeFormTable userData={userData} />}
					{selectedForm == "form02" && <QualificationExamCommitteeFormTable userData={userData} />}
					{selectedForm == "form03" && <OutlineExamCommitteeFormTable userData={userData} />}
					{selectedForm == "form04" && <ThesisExamCommitteeFormTable userData={userData} />}
					{selectedForm == "form05" && <OutlineFormTable userData={userData} />}
					{selectedForm == "form06" && <ThesisProgressFormTable userData={userData} />}
					{selectedForm == "form07" && <ExamAppointmentFormTable userData={userData} />}
				</div>
			</div>
		</>
	);
}
