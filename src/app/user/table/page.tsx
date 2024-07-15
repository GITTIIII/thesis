"use client";
import Image from "next/image";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import Stepper from "@/components/stepper/stepper";
import { use, useState } from "react";
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


async function getUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

const userPromise = getUser();

export default function StudentTablePage() {
	const user: IUser = use(userPromise);
	const [formType, setFormType] = useState("outlineForm");
	const router = useRouter();

	const handleSelect = (value: String) => {
		setFormType(value.toString());
	};

	return (
		<>
			<div className="w-full h-full bg-transparent py-12 px-2 lg:px-28">
				{user?.role == "STUDENT" && (
					<div className="w-full h-max p-4 flex justify-center items-center">
						<Stepper step={user?.formState ?? 0} />
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
								{(user?.position == "HEAD_INSTITUTE" ||
									user?.position == "ADVISOR") && (
									<SelectItem value="outlineExamCommitteeForm">
										แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
									</SelectItem>
								)}
								{(user?.position == "HEAD_INSTITUTE" ||
									user?.position == "ADVISOR") && (
									<SelectItem value="thesisExamCommitteeForm">
										แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
									</SelectItem>
								)}
								<SelectItem
									disabled={
										user?.role == "STUDENT" && (user?.formState ?? 0) < 1
									}
									value="outlineForm"
								>
									แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
								</SelectItem>

								<SelectItem
									disabled={
										user?.role == "STUDENT" && (user?.formState ?? 0) < 2
									}
									value="thesisProgressForm"
								>
									เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
								</SelectItem>
								<SelectItem
									disabled={
										user?.role == "STUDENT" && (user?.formState ?? 0) < 3
									}
									value="examAppointment"
								>
									คำขอนัดสอบวิทยานิพนธ์
								</SelectItem>
							</SelectContent>
						</Select>
						{(user?.role === "STUDENT" ||
							(user?.position === "HEAD_INSTITUTE" &&
								formType === "outlineExamCommitteeForm") ||
							(user?.position === "HEAD_INSTITUTE" &&
								formType === "examCommitteeForm")) && (
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
					{formType == "outlineExamCommitteeForm" && (
						<OutlineExamCommitteeFormTable userId={user?.id} />
					)}
					{formType == "thesisExamCommitteeForm" && (
						<ThesisExamCommitteeFormTable userId={user?.id} />
					)}
					{formType == "outlineForm" && <OutlineFormTable userId={user?.id} />}
					{formType == "thesisProgressForm" && (
						<ThesisProgressFormTable userId={user?.id} />
					)}
					{formType == "examAppointment" && (
						<ExamAppointmentFormTable userId={user?.id} />
					)}
				</div>
			</div>
		</>
	);
}
