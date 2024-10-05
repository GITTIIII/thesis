"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IOutlineForm, IThesisExamAppointmentForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import InputForm from "@/components/inputForm/inputForm";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import UserCertificate from "@/components/profile/userCertificate";

const ThesisProgressFormRead = ({
	user,
	formData,
	approvedForm,
}: {
	user: IUser;
	formData: IThesisExamAppointmentForm;
	approvedForm: IOutlineForm;
}) => {
	const router = useRouter();

	return (
		<div className="w-full h-full bg-white p-4">
			<div className="w-full flex px-0 sm:px-10 mb-2">
				<Button
					variant="outline"
					type="reset"
					onClick={() => router.back()}
					className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
				>
					ย้อนกลับ
				</Button>
			</div>
			<div className="flex flex-col justify-center md:flex-row mb-4">
				{/* ฝั่งซ้าย */}
				<div className="w-full">
					<div className="m-auto w-[300px] mb-6">
						<Label className="text-sm font-medium">ภาคเรียน / Trimester</Label>
						<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
							<div className="flex items-center space-x-3 space-y-0">
								<RadioGroupItem checked={formData.trimester === 1} value="1" />
								<Label className="ml-2 font-normal">1</Label>
							</div>
							<div className="flex items-center space-x-3 space-y-0">
								<RadioGroupItem checked={formData.trimester === 2} value="2" />
								<Label className="ml-2 font-normal">2</Label>
							</div>
							<div className="flex items-center space-x-3 space-y-0">
								<RadioGroupItem checked={formData.trimester === 3} value="3" />
								<Label className="ml-2 font-normal">3</Label>
							</div>
						</RadioGroup>
					</div>
					<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา (พ.ศ.) / Academic year (B.E.)" />
					<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
					<InputForm value={`${formData?.gpa}`} label="คะเเนนสะสมเฉลี่ย / GPA" />
					<InputForm value={`${formData?.credits}`} label="หน่วยกิต / Credits" />

					<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
					<InputForm
						value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
						label="ชื่อ-นามสกุล / Full name"
					/>
					<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
					<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
					<InputForm value={`${formData?.student?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />

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
				</div>
				<div className="border-l border-[#eeee]"></div>

				{/* ฝั่งขวา */}
				<div className="w-full">
					<div className="w-full sm:w-3/4 mx-auto flex flex-col item-center justify-center rounded-lg mb-2">
						<InputForm
							value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>
						<div className="text-center font-semibold mb-2">โครงร่างวิทยานิพนธ์</div>
						<div className="flex flex-row items-center mb-6 justify-center">
							<div className="w-[300px]">
								<Label>
									วันที่อนุมัติโครงร่างวิทยานิพนธ์ / <br />
									Thesis outline approval date
								</Label>
								<Input
									disabled
									value={`${
										approvedForm?.dateOutlineCommitteeSign
											? new Date(approvedForm?.dateOutlineCommitteeSign).toLocaleDateString("th")
											: ""
									}`}
								/>
							</div>
						</div>

						<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
						<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />
						<InputForm
							value={`${formData?.dateExam ? new Date(formData?.dateExam).toLocaleDateString("th") : ""}`}
							label="วันที่นัดสอบ / Date of the examination"
						/>
					</div>

					<div className="flex flex-col items-center mt-6 mb-6 justify-center">
						<Label>ลายเซ็น / Signature</Label>
						<SignatureDialog disable={true} signUrl={formData?.student.signatureUrl ? formData?.student.signatureUrl : ""} />
						<Label className="mt-4">{`วันที่ ${
							formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"
						}`}</Label>
					</div>
				</div>

				<hr className="่่justify-center mx-auto w-full sm:w-max my-5 border-t-2 border-[#eeee]" />
			</div>
			<div className="w-full xl:w-1/2 h-full mx-auto bg-white p-4 flex flex-col gap-4">
				<h1 className="text-center font-semibold">นักศึกษาได้รับทุนการศึกษา ดังนี้ (เกณฑ์ขั้นต่ำพร้อมแนบเอกสารประกอบ)</h1>
				<div>
					<div className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.has01Certificate} />

						<Label>{`ทุน OROG ${
							user?.degree == "Master"
								? `(ป.โท วารสารระดับชาติ หรือ ประชุมวิชาการระดับนานาชาติ)`
								: `(ป.เอก วารสารระดับนานาชาติ)`
						}`}</Label>
					</div>

					<UserCertificate canUpload={false} user={formData?.student} certificateType="1" />
				</div>
				<div>
					<div className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.has02Certificate} />

						<Label>{`ทุนกิตติบัณฑิต / ทุนวิเทศบัณฑิต ${
							user?.degree == "Master"
								? `(ป.โท ประชุมวิชาการระดับชาติ / นานาชาติ เเละ วารสารระดับชาติ / นานาชาติ)`
								: `(ป.เอก นำเสนอผลงานระดับชาติ / นานาชาติ เเละ วารสารระดับนานาชาติ)`
						}`}</Label>
					</div>

					<UserCertificate canUpload={false} user={formData?.student} certificateType="2" />
				</div>
				<div>
					<div className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.has03Certificate} />

						<Label>{`ทุนศักยภาพ / ทุนเรียนดี / ทุนส่วนตัว ${
							user?.degree == "Master" ? `(ป.โท ประชุมวิชาการระดับชาติ)` : `(ป.เอก วารสารระดับชาติ)`
						}`}</Label>
					</div>

					<UserCertificate canUpload={false} user={formData?.student} certificateType="3" />
				</div>
				<div>
					<div className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.hasOtherCertificate} />

						<Label>{`ทุนอื่น ๆ`}</Label>
					</div>

					<UserCertificate canUpload={false} user={formData?.student} certificateType="4" />
				</div>
				<div className="flex flex-col justify-center items-center">
					<div className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.presentationFund} />

						<Label>ไม่ติดค้างการรายงานทุนนำเสนอผลงาน</Label>
					</div>

					<SignatureDialog signUrl={formData?.presentationFundSignUrl ? formData?.presentationFundSignUrl : ""} disable={true} />
					<Label>{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
					<div className="w-max h-max flex mt-2 mb-4 items-center">
						<Label className="mr-2">วันที่</Label>
						{formData?.dateAdvisor ? (
							<Label>{formData?.dateAdvisor ? new Date(formData?.dateAdvisor).toLocaleDateString("th") : "__________"}</Label>
						) : null}
					</div>

					<div className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.researchProjectFund} />

						<Label>ไม่ติดค้างการรายงานทุนอุดหนุนโครงการวิจัยเพื่อทำวิทยานิพนธ์ระดับบัณฑิตศึกษา</Label>
					</div>

					<SignatureDialog
						signUrl={formData?.researchProjectFundSignUrl ? formData?.researchProjectFundSignUrl : ""}
						disable={true}
					/>
					<Label>{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
					<div className="w-max h-max flex mt-2 items-center">
						<Label className="mr-2">วันที่</Label>
						{formData?.dateAdvisor ? (
							<Label>{formData?.dateAdvisor ? new Date(formData?.dateAdvisor).toLocaleDateString("th") : "__________"}</Label>
						) : null}
					</div>
				</div>
				<div>
					<div className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
						<Checkbox disabled checked={formData?.turnitinVerified} />

						<Label>
							ผ่านการตรวจสอบการคัดลอกวิทยานิพนธ์จากระบบ Turnitin <span className="underline">พร้อมแนบเอกสาร</span>
						</Label>
					</div>

					<UserCertificate canUpload={false} user={formData?.student} certificateType="5" />
				</div>
				<div className="w-full flex flex-col md:flex-row justify-center mt-4">
					{/* อาจารย์ที่ปรึกษา */}
					<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold text-center">ความเห็นของอาจารย์ที่ปรึกษา</h1>

						<div className="w-max flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
							<Checkbox disabled checked={formData?.turnitinVerified} />

							<Label>ผ่านการตรวจสอบจากระบบ Turnitin</Label>
						</div>

						<SignatureDialog signUrl={formData?.advisorSignUrl ? formData?.advisorSignUrl : ""} disable={true} />
						<Label>{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>

						<div className="w-max h-max flex mt-2 items-center">
							<Label className="mr-2">วันที่</Label>
							{formData?.dateAdvisor ? (
								<Label>
									{formData?.dateAdvisor ? new Date(formData?.dateAdvisor).toLocaleDateString("th") : "__________"}
								</Label>
							) : null}
						</div>
					</div>

					{/* หัวหน้าสาขา */}

					<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold text-center">ความเห็นของหัวหน้าสาขาวิชา</h1>

						<div className="w-full h-max">
							<Input
								className="text-sm p-4 w-full h-[50px] m-auto shadow rounded-lg mb-2"
								disabled
								value={formData?.headSchoolComment ? formData?.headSchoolComment : ""}
							/>
						</div>

						<SignatureDialog disable={true} signUrl={formData?.headSchoolSignUrl} />
						{formData?.headSchoolID ? (
							<Label>{`${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`}</Label>
						) : null}
						<div className="w-max h-max flex mt-2 items-center">
							<Label className="mr-2">วันที่</Label>
							{formData?.dateHeadSchool ? (
								<Label>
									{formData?.dateHeadSchool ? new Date(formData?.dateHeadSchool).toLocaleDateString("th") : "__________"}
								</Label>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThesisProgressFormRead;
