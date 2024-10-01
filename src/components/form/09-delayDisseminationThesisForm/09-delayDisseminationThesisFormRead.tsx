"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { IDelayThesisForm } from "@/interface/form";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const DelayDisseminationThesisFormRead = ({ user, formData }: { user: IUser; formData: IDelayThesisForm }) => {
	const router = useRouter();

	return (
		<div className="w-full h-full bg-white p-4">
			<div className="w-full flex justify-start">
				<Button
					variant="outline"
					type="reset"
					onClick={() => router.back()}
					className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
				>
					ย้อนกลับ
				</Button>
			</div>
			<div className="flex flex-col justify-center xl:flex-row">
				{/* ฝั่งซ้าย */}

				<div className="w-full  mt-5">
					<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
					<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / StudentID" />
					<InputForm value={`${user?.email} `} label="อีเมล์ / Email" />
					<InputForm value={`${user?.phone} `} label="เบอร์โทรศัพท์ / Phone Number" />
					<div className="flex flex-col items-center mb-6 justify-center">
						<Label className="font-normal">ระดับการศึกษา / Education Level</Label>
						<RadioGroup disabled className="space-y-1 mt-2">
							<div>
								<RadioGroupItem checked={formData?.student?.degree === "Master"} value="Master" />
								<Label className="ml-2 font-normal">ปริญญาโท (Master Degree)</Label>
							</div>
							<div>
								<RadioGroupItem checked={formData?.student?.degree === "Doctoral"} value="Doctoral" />
								<Label className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</Label>
							</div>
						</RadioGroup>
					</div>
					<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School Of" />
					<InputForm value={`${user?.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
					<InputForm value={`${user?.program?.programNameTH}`} label="หลักสูตร / Program" />
					<InputForm value={`${user?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
				</div>
				<div className="border-l border-[#eeee]"></div>

				{/* ฝั่งขวา */}
				<div className="w-full ">
					<div>
						<div className="text-center my-5">เรียนประธานคณะกรรมการ / To Head of Committee</div>
						<InputForm value={`${formData?.headCommitteeName}`} label="ชื่อประธารคณะกรรมการ / Head of Committee name" />
					</div>
					<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
						<div className="text-center mb-5">ชื่อวิทยานิพนธ์</div>
						<InputForm value={`${formData?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
						<InputForm value={`${formData?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
						<InputForm
							value={`${formData?.publishmentName}`}
							label="ชื่อวารสารที่ต้องการนำวิทยานิพนธ์ไปตีพิมพ์ / scientific journal name"
						/>

						<InputForm value={`${formData?.startDate.toLocaleDateString("th")}`} label="ตั้งแต่วันที่ / Starting Date" />
						<InputForm value={`${formData?.endDate.toLocaleDateString("th")}`} label="ตั้งแต่วันที่ / Starting Date" />
					</div>
					<div className="flex item-center justify-center ">
						<div className="w-3/4 flex flex-col item-center justify-center border-2 rounded-lg py-5 my-5 border-[#eeee] ">
							<div>
								{(user.role == "STUDENT" ||
									(user.role == "SUPER_ADMIN" && user.position == "HEAD_OF_INSTITUTE" && formData)) && (
									<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
										{/* ลายเซ็นต์นักศึกษา */}
										<div className="text-center mb-2">
											ลายเซ็นต์นักศึกษา / <br />
											Student Signature
										</div>
										<SignatureDialog
											signUrl={formData?.studentSignUrl ? formData?.studentSignUrl : ""}
											disable={true}
										/>
										{/* <Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label> */}
									</div>
								)}
							</div>
							<div>
								{(user.role == "STUDENT" ||
									(user.role == "SUPER_ADMIN" && user.position == "HEAD_OF_INSTITUTE" && formData)) && (
									<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
										{/* ลายเซ็นต์นักศึกษา */}
										<div className="text-center mb-2">
											ลายเซ็นต์ประธานคณะกรรมการ / <br />
											Head of Committee
										</div>
										<SignatureDialog
											signUrl={formData?.instituteSignUrl ? formData?.instituteSignUrl : ""}
											disable={true}
										/>
										{/* <Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label> */}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DelayDisseminationThesisFormRead;
