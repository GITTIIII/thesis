import Image from "next/image";
import learning1 from "@/../../public/asset/learning1.png";
import ThesisProgressFormUpdate from "@/components/form/06-thesisProgressForm/06-thesisProgressFormUpdate";
import { get06FormById } from "@/app/action/getFormById";
import { getHeadSchool } from "@/app/action/getHeadSchool";
import { currentUser } from "@/app/action/current-user";
import { get05ApprovedFormByStdId } from "@/app/action/get05ApprovedFormByStdId";
import { getLast06FormByStdId } from "@/app/action/getLast06FormByStdId";

export default async function ThesisProgressFormUpdatePage({ params }: { params: { formId: number } }) {
	const formId = params.formId;
	const formData = await get06FormById(formId);
	const headSchool = await getHeadSchool();
	const user = await currentUser();
	if (!user || !headSchool) {
		return <div>ไม่พบข้อมูล</div>;
	}
	const last06Form = await getLast06FormByStdId(user.id);
	if (!formData) {
		return <div>ไม่พบข้อมูล</div>;
	}
	const approvedForm = await get05ApprovedFormByStdId(formData?.studentID);

	if (!approvedForm) {
		return <div>ไม่พบข้อมูล</div>;
	}
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 xl:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<ThesisProgressFormUpdate
							formData={formData}
							user={user}
							approvedForm={approvedForm}
							headSchool={headSchool}
							last06Form={last06Form}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
