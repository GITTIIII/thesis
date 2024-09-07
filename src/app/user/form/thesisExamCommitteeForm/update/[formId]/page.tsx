"use client";
import Image from "next/image";
import learning1 from "@/../../public/asset/learning1.png";
import ExamCommitteeFormUpdate from "@/components/form/04-thesisExamCommitteeForm/04-thesisExamCommitteeFormUpdate";

export default function ComprehensiveExamCommitteeFormUpdatePage({ params }: { params: { formId: number } }) {
	const formId = params.formId;
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
					แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<ExamCommitteeFormUpdate formId={Number(formId)} />
					</div>
				</div>
			</div>
		</>
	);
}
