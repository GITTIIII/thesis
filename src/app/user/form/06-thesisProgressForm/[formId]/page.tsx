import Image from "next/image";
import learning1 from "@/../../public/asset/learning1.png";
import ThesisProgressFormRead from "@/components/form/06-thesisProgressForm/06-thesisProgressFormRead";
import { get06FormById } from "@/app/action/getFormById";
import { currentUser } from "@/app/action/current-user";
import { get05ApprovedFormByStdId } from "@/app/action/get05ApprovedFormByStdId";

export default async function ThesisProgressFormReadPage({ params }: { params: { formId: number } }) {
	const formId = params.formId;
	const formData = await get06FormById(formId);
	const user = await currentUser();
	if (!formData) {
		return <div>ไม่พบข้อมูล</div>;
	}
	const approvedForm = await get05ApprovedFormByStdId(formData?.studentID);

	if (!user || !approvedForm) {
		return <div>ไม่พบข้อมูล</div>;
	}
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<ThesisProgressFormRead formData={formData} user={user} approvedForm={approvedForm} />
					</div>
				</div>
			</div>
		</>
	);
}
