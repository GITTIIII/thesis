import Image from "next/image";
import learning1 from "@/../../public/asset/learning1.png";
import OutlineFormRead from "@/components/form/05-outlineForm/05-outlineFormRead";
import { get05FormById } from "@/app/action/getFormById";

export default async function OutlineFormReadPage({ params }: { params: { formId: number } }) {
	const formId = params.formId;
	const formData = await get05FormById(formId);
	if (!formData) {
		return <div>ไม่พบข้อมูล</div>;
	}
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<OutlineFormRead formData={formData} />
					</div>
				</div>
			</div>
		</>
	);
}
