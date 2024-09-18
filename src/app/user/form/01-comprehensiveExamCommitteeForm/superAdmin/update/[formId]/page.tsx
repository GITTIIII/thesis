import Image from "next/image";
import learning1 from "@/../../public/asset/learning1.png";
import SuperAdminForm01Update from "@/components/form/01-comprehensiveExamCommitteeForm/01-superAdminFormUpdate";
import { get01FormById } from "@/app/action/getFormById";
import { currentUser } from "@/app/action/current-user";
import { getHeadSchool } from "@/app/action/headSchool";

export default async function SuperAdminForm01UpdatePage({ params }: { params: { formId: number } }) {
	const formId = params.formId;
	const formData = await get01FormById(formId);
	const headSchool = await getHeadSchool();
	const user = await currentUser();

	if (!formData || !user || !headSchool) {
		return <div>ไม่พบข้อมูล</div>;
	}
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<SuperAdminForm01Update formData={formData} user={user} headSchool={headSchool}/>
					</div>
				</div>
			</div>
		</>
	);
}
