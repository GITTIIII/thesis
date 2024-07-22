"use client";
import learning1 from "@/../../public/asset/learning1.png";
import QualificationExamCommitteeFormCreate from "@/components/form/02-qualificationExamCommitteeForm/02-qualificationExamCommitteeFormCreate";
import Image from "next/image";

const QualificationExamCommitteeFormCreatePage = () => {
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<div className="p-2 flex justify-center bg-[#A67436] text-white text-lg">
							กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบความถูกต้อง
						</div>
						<QualificationExamCommitteeFormCreate />
					</div>
				</div>
			</div>
		</>
	);
};

export default QualificationExamCommitteeFormCreatePage;
