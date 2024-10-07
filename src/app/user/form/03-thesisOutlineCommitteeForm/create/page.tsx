import learning1 from "@/../../public/asset/learning1.png";
import { currentUser } from "@/app/action/current-user";
import ThesisOutlineCommiteeFormCreate from "@/components/form/03-thesisOutlineCommitteeForm/03-thesisOutlineCommitteeFormCreate";
import Image from "next/image";
import { GetCertificate01 } from "@/app/action/checkUserHasOROG";

export default async function ThesisOutlineCommiteeFormCreatePage(){
	const user = await currentUser();
	const OROG = await GetCertificate01()
	if (!user) {
		return <div>ไม่พบข้อมูล</div>;
	}
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl bg-white-500 py-8">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
					<span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
					</span>
				</div>
				<div className="h-full w-full flex items-center bg-[#EEEEEE] p-2 md:p-8 rounded-md">
					<div className="w-full h-full">
						<div className="p-2 flex justify-center bg-[#A67436] text-white text-lg">
							กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบความถูกต้อง
						</div>
						<div className="w-full h-auto bg-[#FFF4EF] text-sm py-2">
							<div className="text-center">
								{/* ่ประธานกรรมการหนึ่ง อจทปษหนึ่ง กรรมการสอง ถ้ารวมทปษรเป็นห้าท่าน */}
								<span className="text-red-500">*</span>ระดับปริญญาโท คณะกรรมการสอบ ไม่น้อยกว่า 3 ท่าน หากมีที่ปรึกษาวิทยานิพนธ์ร่วมต้องมีกรรมการสอบ 5 ท่าน
							</div>
							<div className="text-center">
								{/* ่ประธานกรรมการหนึ่ง อจทปษหนึ่ง กรรมการสาม ถ้ารวมทปษรเป็นหกท่าน */}
								<span className="text-red-500">*</span>ระดับปริญญาเอก คณะกรรมการสอบ ไม่น้อยกว่า 5 ท่าน หากมีที่ปรึกษาวิทยานิพนธ์ร่วมต้องมีกรรมการสอบไม่น้อยกว่า 6 ท่าน
							</div>
						</div>
						<ThesisOutlineCommiteeFormCreate user={user}/>
					</div>
				</div>
			</div>
		</>
	);
};
