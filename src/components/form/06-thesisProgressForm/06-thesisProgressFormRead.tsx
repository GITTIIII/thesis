import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import signature from "@/../../public/asset/signature.png";
import InputForm from "@/components/inputForm/inputForm";
import Image from "next/image";
import { Textarea } from "../../ui/textarea";
import { use, useEffect, useState } from "react";
import { IOutlineForm, IThesisProgressForm } from "@/interface/form";
import ThesisProcessPlan from "../thesisProcessPlan";

async function get05ApprovedForm() {
	const res = await fetch("/api/get05ApprovedForm");
	return res.json();
}

async function get06FormById(formId: number): Promise<IThesisProgressForm> {
	const res = await fetch(`/api/get06FormById/${formId}`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

const form05Promise = get05ApprovedForm();

const ThesisProgressFormRead = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const approvedForm: IOutlineForm = use(form05Promise);
	const [formData, setFormData] = useState<IThesisProgressForm>();

	useEffect(() => {
		async function fetchData() {
			const data = await get06FormById(formId);
			setFormData(data);
		}
		fetchData();
	}, [formId]);

	console.log(formData);

	return (
		<>
			<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table?formType=thesisProgressForm`)}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}

					<div className="w-full sm:2/4 ">
						<div className="flex flex-row items-center mb-6 justify-center">
							<InputForm value={`${formData?.times}`} label="ครั้งที่ / No." />
						</div>

						<div>
							<div className="flex flex-row items-center mb-6 justify-center">
								<InputForm value={`${formData?.trimester}`} label="ภาคเรียน / Trimester" />
							</div>
						</div>
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.student?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={
								formData?.student?.formLanguage == "en"
									? `${formData?.student?.firstNameEN} ${formData?.student?.lastNameEN}`
									: `${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`
							}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm
							value={
								formData?.student?.formLanguage == "en"
									? `${formData?.student?.school.schoolNameEN}`
									: `${formData?.student?.school.schoolNameTH}`
							}
							label="สาขาวิชา / School"
						/>
						<InputForm
							value={
								formData?.student?.formLanguage == "en"
									? `${formData?.student?.program.programNameEN}`
									: `${formData?.student?.program.programNameTH}`
							}
							label="หลักสูตร / Program"
						/>
						<InputForm
							value={`${formData?.student?.program.programYear}`}
							label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)"
						/>

						<div className="flex flex-col items-center mb-6 justify-center">
							<Label className="font-normal">ระดับการศึกษา / Education Level</Label>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem checked={formData?.student?.degree === "Master"} value="Master" />
									<Label className="ml-2 font-normal">ปริญญาโท (Master Degree)</Label>
								</div>
								<div>
									<RadioGroupItem
										checked={formData?.student?.degree === "Doctoral"}
										value="Doctoral"
									/>
									<Label className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</div>
							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm
								value={`${approvedForm?.thesisNameEN}`}
								label="ชื่อภาษาอังกฤษ / ThesisName(EN)"
							/>
						</div>
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<InputForm
							value={
								formData?.student.formLanguage == "en"
									? `${formData?.student.advisor?.firstNameEN} ${formData?.student.advisor?.lastNameEN}`
									: `${formData?.student.advisor?.firstNameTH} ${formData?.student.advisor?.lastNameTH}`
							}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>

						<div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
							ขอรายงานความคืบหน้าวิทยานิพนธ์ดังนี้
						</div>
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
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
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="w-full text-center font-normal mb-6">
								2. ผลการดำเนินงานที่ผ่านมาในครั้งนี้
							</div>
							<Label className="mx-auto">คิดเป็นร้อยละการทำงานของเป้าหมาย</Label>
							<InputForm value={`${formData?.percentage}`} label="" />

							<div className="flex flex-col items-center mb-6 justify-center">
								<Label>โดยสรุปผลได้ดังนี้</Label>
								<Textarea
									className="text-sm mt-2 p-2 w-[300px] rounded-lg"
									placeholder="Type your message here."
									defaultValue={formData?.percentageComment}
									disabled
								/>
							</div>
						</div>
						<div className="mt-6 w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
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
									width={100}
									height={100}
									style={{ width: "auto", height: "auto" }}
									alt="signature"
								/>
							</Button>
							<Label className="mt-2">{`วันที่ ${formData?.date ? formData?.date : "__________"}`}</Label>
						</div>
					</div>
				</div>
				<hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />

				<div className="flex justify-center  w-full mb-10">
					{formData && (
						<ThesisProcessPlan
							canEdit={false}
							degree={formData?.student.degree}
							processPlans={formData?.processPlan}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default ThesisProgressFormRead;
