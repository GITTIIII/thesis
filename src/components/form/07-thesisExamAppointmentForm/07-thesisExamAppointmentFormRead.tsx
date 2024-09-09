import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import signature from "@/../../public/asset/signature.png";
import ThesisProcessPlan from "../thesisProcessPlan";
import Image from "next/image";
import InputForm from "@/components/inputForm/inputForm";
import { IOutlineForm, IThesisProgressForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisExamAppointmentFormRead = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: approvedForm } = useSWR<IOutlineForm>(`/api/get05ApprovedFormByStdId/${user?.id}`, fetcher);
	const { data: formData } = useSWR<IThesisProgressForm>(`/api/get06FormById/${formId}`, fetcher);

	return (
		<>
			<div className="w-full h-full bg-white p-4">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.back()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<InputForm value={`${formData?.times} `} label="ครั้งที่ / No." />

						<InputForm value={`${formData?.trimester} `} label="ภาคเรียน / Trimester" />

						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student?.program.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />

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

						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</div>
							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
						</div>
					</div>
					<div className="border-l border-[#eeee]"></div>
					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<InputForm
							value={`${formData?.student.advisor?.firstNameTH} ${formData?.student.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>

						<div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
							ขอรายงานความคืบหน้าวิทยานิพนธ์ดังนี้
						</div>
						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="font-normal text-center mb-5">1. ระดับการดำเนินงาน</div>

							<RadioGroup className="space-y-1 mt-2" disabled>
								<div>
									<RadioGroupItem value="AsPlaned" checked={formData?.status == "AsPlaned"} />
									<Label className="ml-2 font-normal">เป็นไปตามแผนที่วางไว้ทุกประการ</Label>
								</div>
								<div>
									<RadioGroupItem value="Adjustments" checked={formData?.status == "Adjustments"} />
									<Label className="ml-2 font-normal mb-6">มีการเปลี่ยนแผนที่วางไว้</Label>
								</div>
							</RadioGroup>
							<Textarea
								className="mt-2"
								placeholder="มีการเปลี่ยนแปลงดังนี้..."
								disabled
								defaultValue={formData?.statusComment}
							/>
						</div>
						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="w-full text-center font-normal mb-6">2. ผลการดำเนินงานที่ผ่านมาในครั้งนี้</div>
							<InputForm value={`${formData?.percentage}`} label="คิดเป็นร้อยละการทำงานของเป้าหมาย" />

							<div className="flex flex-col items-center mb-6 justify-center">
								<Label className="mb-2">โดยสรุปผลได้ดังนี้</Label>
								<Textarea
									className="text-sm p-2 w-[300px] m-auto  rounded-lg"
									placeholder="Type your message here."
									disabled
									defaultValue={formData?.percentageComment}
								/>
							</div>
						</div>
						<div className="mt-6 w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="w-full text-center font-normal mb-6">3. ปัญหา อุปสรรค และแนวทางแก้ไข</div>

							<div className="flex flex-row items-center mb-6 justify-center">
								<Textarea
									className="text-sm p-2 w-[300px] m-auto  rounded-lg"
									placeholder="Type your message here."
									defaultValue={formData?.issues}
									disabled
								/>
							</div>
						</div>
						<div className="flex flex-col items-center mt-6 mb-6 justify-center">
							<Label>ลายเซ็น / Signature</Label>
							<Button variant="outline" type="button" className="w-60 mt-4 h-max">
								<Image
									src={formData?.student.signatureUrl ? formData?.student.signatureUrl : signature}
									width={200}
									height={100}
									style={{ width: "auto", height: "auto" }}
									alt="signature"
								/>
							</Button>
							<Label className="mt-4">{`วันที่ ${formData?.date ? formData?.date : "__________"}`}</Label>
						</div>
					</div>
				</div>
				<hr className="่่justify-center mx-auto w-full sm:w-max my-5 border-t-2 border-[#eeee]" />

				{/* อาจารย์ที่ปรึกษา */}
				<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
					<h1 className="mb-2 font-bold text-center">ผลการประเมินความคืบหน้าของการทำวิทยานิพนธ์โดยอาจารย์ที่ปรึกษา</h1>

					<div className="w-full sm:w-2/4 h-max">
						<Textarea disabled defaultValue={formData?.percentageComment} />
					</div>

					<Button variant="outline" type="button" className="w-60 my-4 h-max">
						<Image
							src={formData?.advisorSignUrl ? formData?.advisorSignUrl : signature}
							width={100}
							height={100}
							alt="signature"
						/>
					</Button>

					<Label className="mb-2">{`${formData?.student?.advisor?.prefix.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>

					<Label className="mt-2">{`วันที่ ${formData?.dateAdvisor ? formData?.dateAdvisor : "__________"}`}</Label>
				</div>

				{/* หัวหน้าสาขา */}
				<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
					<h1 className="mb-2 font-bold text-center">ความเห็นของหัวหน้าสาขาวิชา</h1>

					<div className="w-full sm:w-2/4 h-max">
						<Textarea disabled defaultValue={formData?.headSchoolComment} />
					</div>

					<Button variant="outline" type="button" className="w-60 my-4 h-max">
						<Image
							src={formData?.headSchoolSignUrl ? formData?.headSchoolSignUrl : signature}
							width={100}
							height={100}
							alt="signature"
						/>
					</Button>

					<Label className="mb-2">
						{formData?.headSchool
							? `${formData?.headSchool.prefix.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`
							: ""}
					</Label>

					<Label className="mt-2">{`วันที่ ${formData?.dateHeadSchool ? formData?.dateHeadSchool : "__________"}`}</Label>
				</div>
				<hr className="่่justify-center mx-auto w-full sm:w-max my-5 border-t-2 border-[#eeee]" />
				<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
					<h1 className="mb-2 font-bold text-center">เเผนการดำเนินการจัดทำวิทยานิพนธ์</h1>
					<div className="w-full flex flex-col sm:flex-row justify-center items-center mb-2 ">
						<Label className="my-2 sm:my-0 font-bold">เริ่มทำวิทธายานิพนธ์ เดือน</Label>
						<Input disabled className="w-max mx-4" value={`${approvedForm?.thesisStartMonth}`} />
						<Label className="mx-4 my-2 sm:my-0 font-bold"> ปี พ.ศ.</Label>
						<Input disabled className="w-max" value={`${approvedForm?.thesisStartYear}`} />
					</div>
					<div className="w-full h-max overflow-auto flex justify-center">
						{formData && (
							<ThesisProcessPlan degree={formData!.student.degree} canEdit={false} processPlans={formData?.processPlan} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ThesisExamAppointmentFormRead;
