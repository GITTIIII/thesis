import Image from "next/image";
import Stepper from "@/components/stepper/stepper";
import ComprehensiveExamCommitteeFormTable from "@/components/formTable/01-comprehensiveExamCommitteeFormTable";
import QualificationExamCommitteeFormTable from "@/components/formTable/02-qualificationExamCommitteeFormTable";
import OutlineExamCommitteeFormTable from "@/components/formTable/03-outlineExamCommitteeFormTable";
import ThesisExamCommitteeFormTable from "@/components/formTable/04-thesisExamCommitteeFormTable";
import OutlineFormTable from "@/components/formTable/05-outlineFormTable";
import ThesisProgressFormTable from "@/components/formTable/06-thesisProgressFormTable";
import ExamAppointmentFormTable from "@/components/formTable/07-thesisExamAppointmentFormTable";
import ThesisExamAssessmentFormTable from "@/components/formTable/08-thesisExamAssessmentFormTable";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import SelectAndCreate from "@/components/formTable/selectAndCreate";
import fetchFormData from "./fetchForm";
import { currentUser } from "@/app/action/current-user";
import { get05ApprovedFormByStdId } from "@/app/action/get05ApprovedFormByStdId";

const labels: { [key: string]: string } = {
	form01: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้",
	form02: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ",
	form03: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์",
	form04: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์",
	form05: "แบบคำขออนุมัติโครงร่างวิทยานิพนธ์",
	form06: "เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์",
	form07: "คำขอนัดสอบวิทยานิพนธ์",
	form08: "แบบประเมินการสอบวิทยานิพนธ์",
};

export default async function StudentTablePage({ searchParams }: { searchParams: { [key: string]: string } }) {
	const user = await currentUser();
	if (!user) {
		return <div>ไม่พบข้อมูล</div>;
	}

	let selectedForm: string;

	if (user && user.role == "STUDENT" && user.degree == "Doctoral") {
		selectedForm = searchParams.form || "form02";
	} else {
		selectedForm = searchParams.form || "form01";
	}
	const approvedForm = await get05ApprovedFormByStdId(user.id);

	const formData: any = await fetchFormData(selectedForm, user);

	const renderFormTable = () => {
		switch (selectedForm) {
			case "form01":
				return <ComprehensiveExamCommitteeFormTable user={user} formData={formData} />;
			case "form02":
				return <QualificationExamCommitteeFormTable user={user} formData={formData} />;
			case "form03":
				return <OutlineExamCommitteeFormTable user={user} formData={formData} />;
			case "form04":
				return <ThesisExamCommitteeFormTable user={user} formData={formData} />;
			case "form05":
				return <OutlineFormTable user={user} formData={formData} />;
			case "form06":
				return <ThesisProgressFormTable user={user} formData={formData} />;
			case "form07":
				return <ExamAppointmentFormTable user={user} formData={formData} />;
			case "form08":
				return <ThesisExamAssessmentFormTable user={user} formData={formData} approvedForm={approvedForm} />;
			default:
				return <div>ไม่มีตาราง</div>;
		}
	};

	return (
		<>
			<div className="w-full h-full bg-transparent py-12 px-2 xl:px-28">
				{user?.role == "STUDENT" && (
					<div className="w-full h-max p-4 flex justify-center items-center">
						<Stepper step={user?.formState ?? 0} />
					</div>
				)}
				<div className="h-max w-full flex items-center text-2xl p-2">
					<Image src={studentFormPage} width={80} height={80} alt="documentation" />
					<label className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-xl">
						{labels[selectedForm]}
					</label>
				</div>
				<SelectAndCreate user={user} approvedForm={approvedForm} searchParams={searchParams} />
				<div className="h-full w-full flex items-center py-4">{renderFormTable()}</div>
			</div>
		</>
	);
}
