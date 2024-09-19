import learning1 from "@/../../public/asset/learning1.png";
import { currentUser } from "@/app/action/current-user";
import { get05ApprovedFormByStdId } from "@/app/action/get05ApprovedFormByStdId";
import { getLast06FormByStdId } from "@/app/action/getLast06FormByStdId";
import ThesisProgressFormCreate from "@/components/form/06-thesisProgressForm/06-thesisProgressFormCreate";
import Image from "next/image";

export default async function ThesisProgressFormCreatePage() {
	const user = await currentUser();
	if (!user) {
		return <div>ไม่พบข้อมูล</div>;
	}
	const last06Form = await getLast06FormByStdId(user.id);
	const approvedForm = await get05ApprovedFormByStdId(user.id);

	if (!approvedForm || !last06Form) {
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
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-8 rounded-md">
					<div className="w-full h-full">
						<div className="p-2 flex justify-center bg-[#A67436] text-white text-lg">
							กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบความถูกต้อง
						</div>
						<ThesisProgressFormCreate user={user} approvedForm={approvedForm} last06Form={last06Form} />
					</div>
				</div>
			</div>
		</>
	);
}
