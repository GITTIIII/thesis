import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { currentUser } from "@/app/action/current-user";
import Image from "next/image";
import React from "react";
import signature from "@/../../public/asset/signature.png";
import EditSignature from "@/components/profile/editSignature";
import EditPersonalInformation from "@/components/profile/editPersonalInfomation";
import EditProfilePic from "@/components/profile/editProfilePic";
import UserCertificate from "@/components/profile/userCertificate";

export default async function Profile() {
	const user = await currentUser();

	if (!user) {
		return <div>Loading</div>;
	}

	return (
		<>
			<div className="w-full h-full flex justify-center items-center">
				<div className="w-[900px] h-full py-12">
					{/* เเถว 1 */}
					<div className="w-full h-max flex flex-col sm:flex-row gap-4 mb-4">
						<div className="relative w-full sm:w-1/3 h-auto bg-white p-4 rounded-xl shadow-[0px_0px_5px_1px_#e2e8f0]">
							<div className="w-full h-max px-4 absolute flex justify-end">
								<EditProfilePic user={user} />
							</div>
							<div className="w-full h-full flex items-center justify-center">
								<Avatar className="w-[128px] h-auto">
									<AvatarImage src={user?.profileUrl || "defaultProfileUrl"} alt="Profile" />
									<AvatarFallback>
										<User className="w-[128px] h-auto" />
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
						<div className="relative w-full sm:w-2/3 h-max bg-white p-4 rounded-xl shadow-[0px_0px_5px_1px_#e2e8f0]">
							<div className="w-full h-max flex items-center">
								<div className="w-full h-max px-4 absolute flex justify-end">
									<EditPersonalInformation user={user} />
								</div>
								<label className="text-xl">ข้อมูลส่วนตัว</label>
							</div>
							<div className="mt-4 md:flex ">
								<section className="flex flex-col sm:w-max gap-4">
									{user?.role == "STUDENT" && <p>{`รหัสนักศึกษา:  ${user?.username} `}</p>}
									<p>{`ชื่อ - สกุล (ไทย):  ${user?.prefix?.prefixTH ? user?.prefix?.prefixTH : ""}${user?.firstNameTH} ${
										user?.lastNameTH
									} `}</p>
									<p>{`ชื่อ - สกุล (อังกฤษ):  ${user?.prefix?.prefixEN ? user?.prefix?.prefixEN : ""}${
										user?.firstNameEN ? user?.firstNameEN : ""
									} ${user?.lastNameEN ? user?.lastNameEN : ""} `}</p>
									<p>{`เพศ:  ${user?.sex == "Male" ? "ชาย" : "หญิง"} `}</p>
								</section>
								<section className="flex flex-col mt-3 md:mt-0 sm:w-max gap-4 md:ml-8 sm:ml-0">
									<p>{`อีเมล:  ${user?.email} `}</p>
									<p>{`เบอร์โทรศัพท์:  ${user?.phone} `}</p>
								</section>
							</div>
						</div>
					</div>

					{/* เเถว 2 */}
					<div className="w-full h-max flex flex-col sm:flex-row gap-4 mb-4">
						<div className="w-full sm:w-2/4 h-auto bg-white p-4 rounded-xl shadow-[0px_0px_5px_1px_#e2e8f0]">
							<div className="w-full flex  justify-between">
								<label className=" text-xl ">ข้อมูลด้านการศึกษา</label>
							</div>
							<section className="mt-4  gap-4 flex  flex-col self-center">
								<p>{`สำนักวิชา: ${user?.institute?.instituteNameTH} `}</p>
								<p>{`สาขาวิชา: ${user?.school?.schoolNameTH} `}</p>
								{user?.role == "STUDENT" && (
									<>
										<p>{`หลักสูตร: ${user?.program ? user?.program?.programNameTH : ""} ${
											user?.program ? user?.program?.programYear : ""
										} `}</p>
										<p>{`ระดับการศึกษา: ${user?.degree.toLowerCase() === "master" ? "ปริญญาโท" : "ปริญญาเอก"} `}</p>
										<p>{`อ.ที่ปรึกษา: ${user?.advisor?.prefix?.prefixTH} ${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}</p>
									</>
								)}
							</section>
						</div>
						<div className="relative w-full sm:w-2/4 h-auto justify-center items-center bg-white p-4 rounded-xl shadow-[0px_0px_5px_1px_#e2e8f0]">
							<div className="w-full h-max flex items-center">
								<label className="text-xl">ลายเซ็น</label>
								<div className="w-full h-max px-4 absolute flex justify-end">
									<EditSignature user={user} />
								</div>
							</div>
							<div className="w-full h-52 flex justify-center items-center">
								<Image
									src={user?.signatureUrl ? user?.signatureUrl : signature}
									width={100}
									height={100}
								
									alt="Profile"
								/>
							</div>
						</div>
					</div>

					{/* เเถว 3 */}
					{user?.role === "STUDENT" && (
						<div className="relative w-full h-auto bg-white p-4 rounded-xl shadow-[0px_0px_5px_1px_#e2e8f0] mb-4">
							<label className=" text-xl ">ทุนการศึกษา / Turnitin</label>
							<div className="mt-4 flex flex-col gap-4">
								<div>
									<label>{`ทุน OROG ${
										user?.degree == "Master"
											? `(ป.โท วารสารระดับชาติ หรือ ประชุมวิชาการระดับนานาชาติ)`
											: `(ป.เอก วารสารระดับนานาชาติ)`
									}`}</label>
									<div className="">
										<UserCertificate canUpload={true} user={user} certificateType="1" />
									</div>
								</div>
								<div>
									<label>{`ทุนกิตติบัณฑิต / ทุนวิเทศบัณฑิต ${
										user?.degree == "Master"
											? `(ป.โท ประชุมวิชาการระดับชาติ / นานาชาติ เเละ วารสารระดับชาติ / นานาชาติ)`
											: `(ป.เอก นำเสนอผลงานระดับชาติ / นานาชาติ เเละ วารสารระดับนานาชาติ)`
									}`}</label>
									<div className="">
										<UserCertificate canUpload={true} user={user} certificateType="2" />
									</div>
								</div>
								<div>
									<label>{`ทุนศักยภาพ / ทุนเรียนดี / ทุนส่วนตัว ${
										user?.degree == "Master" ? `(ป.โท ประชุมวิชาการระดับชาติ)` : `(ป.เอก วารสารระดับชาติ)`
									}`}</label>
									<div className="">
										<UserCertificate canUpload={true} user={user} certificateType="3" />
									</div>
								</div>
								<div>
									<label>{`ทุนอื่น ๆ`}</label>
									<div className="">
										<UserCertificate canUpload={true} user={user} certificateType="4" />
									</div>
								</div>
								<div>
									<label>{`ผลการตรวจสอบการคัดลอกวิทยานิพนธ์จากระบบ Turnitin`}</label>
									<div className="">
										<UserCertificate canUpload={true} user={user} certificateType="5" />
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
