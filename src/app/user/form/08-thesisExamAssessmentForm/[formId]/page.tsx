import Image from "next/image";
import learning1 from "@/../../public/asset/learning1.png";
import { get08FormById } from "@/app/action/getFormById";
import { currentUser } from "@/app/action/current-user";
import { get05ApprovedFormByStdId } from "@/app/action/get05ApprovedFormByStdId";
import { getAllExpert } from "@/app/action/getExpert";
import { getInstituteCommittee } from "@/app/action/getInstituteCommittee";
import { getAdminNotNone } from "@/app/action/getAdminNotNone";
import ThesisExamAssessmentFormRead from "@/components/form/08-thesisExamAssessmentForm/08-thesisExamAssessmentFormRead";

export default async function ThesisExamAssessmentFormReadPage({ params }: { params: { formId: number } }) {
	const formId = params.formId;
	const formData = await get08FormById(formId);
	const user = await currentUser();
	const expert = await getAllExpert();
	const instituteCommittee = await getInstituteCommittee();
	const adminNotNone = await getAdminNotNone();

	if (!formData || !user || !expert || !instituteCommittee || !adminNotNone) {
		return <div>ไม่พบข้อมูล</div>;
	}

	const approvedForm = await get05ApprovedFormByStdId(formData.student.id);

	if (!approvedForm) {
		return <div>ไม่พบข้อมูล</div>;
	}

	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						แบบประเมินการสอบวิทยานิพนธ์
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<ThesisExamAssessmentFormRead
							formData={formData}
							user={user}
							approvedForm={approvedForm}
							expert={expert}
							instituteCommittee={instituteCommittee}
							adminNotNone={adminNotNone}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
