import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import signature from "@/../../public/asset/signature.png";
import InputForm from "@/components/inputForm/inputForm";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { use, useEffect, useState } from "react";
import { IOutlineForm } from "@/interface/form";

async function getOutlineFormById(formId: number): Promise<IOutlineForm> {
	const res = await fetch(`/api/getOutlineFormById/${formId}`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

export default function OutlineFormRead({ formId }: { formId: number }) {
	const router = useRouter();
	const [formData, setFormData] = useState<IOutlineForm>();

	useEffect(() => {
		async function fetchData() {
			const data = await getOutlineFormById(formId);
			setFormData(data);
		}
		fetchData();
	}, [formId]);

	return (
		<>
			<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table`)}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<div className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</div>

						<InputForm
							value={`${formData?.student.firstName} ${formData?.student.lastName}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm
							value={`${formData?.student?.username}`}
							label="รหัสนักศึกษา / StudentID"
						/>
						<div className="flex flex-col items-center mb-6 justify-center">
							<Label className="font-normal">
								ระดับการศึกษา / Education Level
							</Label>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem
										checked={formData?.student?.degree === "Master"}
										value="Master"
									/>
									<Label className="ml-2 font-normal">
										ปริญญาโท (Master Degree)
									</Label>
								</div>
								<div>
									<RadioGroupItem
										checked={formData?.student?.degree === "Doctoral"}
										value="Doctoral"
									/>
									<Label className="ml-2 font-normal">
										ปริญญาเอก (Doctoral Degree)
									</Label>
								</div>
							</RadioGroup>
						</div>

						<InputForm
							value={`${formData?.student?.school.schoolName}`}
							label="สาขาวิชา / School"
						/>
						<InputForm
							value={`${formData?.student?.program.programName}`}
							label="หลักสูตร / Program"
						/>
						<InputForm
							value={`${formData?.student?.program.programYear}`}
							label="ปีหลักสูตร / Program Year"
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<div className="text-center font-semibold mb-2">
							ชื่อโครงร่างวิทยานิพนธ์
						</div>
						<InputForm
							value={`${formData?.thesisNameTH}`}
							label="ชื่อภาษาไทย / ThesisName(TH)"
						/>
						<InputForm
							value={`${formData?.thesisNameEN}`}
							label="ชื่อภาษาอังกฤษ / ThesisName(EN)"
						/>
						<InputForm
							value={`${formData?.advisor.firstName} ${formData?.advisor.lastName}`}
							label="อาจารย์ที่ปรึกษา / Thesis Advisor"
						/>
						<InputForm
							value={
								formData?.coAdvisor
									? `${formData?.coAdvisor.firstName} ${formData?.coAdvisor.lastName}`
									: ""
							}
							label="อาจารย์ที่ปรึกษาร่วม(ถ้ามี) / Co-Thesis Advisor (if any)"
						/>
						<div className="flex flex-col items-center mt-6 justify-center">
							<Label>ลายเซ็น / Signature</Label>
							<Button
								variant="outline"
								type="button"
								className="w-60 my-4 h-max"
							>
								<Image
									src={
										formData?.student.signatureUrl
											? formData?.student.signatureUrl
											: signature
									}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>
							<Label className="mt-2">{`วันที่ ${
								formData?.date ? formData?.date : "__________"
							}`}</Label>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center mt-4 sm:mt-0 mb-6 justify-center md:flex-row">
					<div className="flex flex-col justify-center items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold">
							ความเห็นของคณะกรรมการพิจารณาโครงร่างวิทยานิพนธ์
						</h1>
						<Label className="mt-2">{`วันที่ ${
							formData?.dateOutlineCommitteeSign
								? formData?.dateOutlineCommitteeSign
								: "__________"
						}`}</Label>
						<div className="flex flex-col items-center justify-center">
							<RadioGroup disabled className="flex my-6">
								<div className="flex items-center justify-center">
									<RadioGroupItem
										checked={formData?.outlineCommitteeStatus == "NOT_APPROVED"}
										value="NOT_APPROVED"
									/>
									<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
										ไม่อนุมัติ
									</div>
								</div>
								<div className="ml-4 mt-0 flex items-center justify-center">
									<RadioGroupItem
										checked={formData?.outlineCommitteeStatus == "APPROVED"}
										value="APPROVED"
									/>
									<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
										อนุมัติ
									</div>
								</div>
							</RadioGroup>
						</div>
						<div>
							<Textarea
								disabled
								placeholder="ความเห็น..."
								className="resize-none h-full text-md mb-2"
								value={formData?.outlineCommitteeComment}
							/>
						</div>
						<Button variant="outline" type="button" className="w-60 my-4 h-max">
							<Image
								src={
									formData?.outlineCommittee
										? formData?.outlineCommittee.signatureUrl
										: signature
								}
								width={100}
								height={100}
								alt="signature"
							/>
						</Button>
						<Label className="mb-2">
							{formData?.outlineCommittee
								? `${formData?.outlineCommittee.firstName} ${formData?.outlineCommittee.lastName}`
								: ""}
						</Label>
						<Label className="mb-2">(ประธานคณะกรรมการ)</Label>
					</div>

					<div className="flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold">
							มติคณะกรรมการประจำสำนักวิชาวิศวกรรมศาสตร์
						</h1>
						<Label className="mt-2">{`ครั้งที่ 1  วันที่ ${
							formData?.dateInstituteCommitteeSign
								? formData?.dateInstituteCommitteeSign
								: "__________"
						}`}</Label>
						<div className="flex flex-col items-center justify-center">
							<RadioGroup disabled className="flex my-6">
								<div className="flex items-center justify-center">
									<RadioGroupItem
										checked={
											formData?.instituteCommitteeStatus == "NOT_APPROVED"
										}
										value="NOT_APPROVED"
									/>
									<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
										ไม่อนุมัติ
									</div>
								</div>
								<div className="ml-4 mt-0 flex items-center justify-center">
									<RadioGroupItem
										checked={formData?.instituteCommitteeStatus == "APPROVED"}
										value="APPROVED"
									/>
									<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
										อนุมัติ
									</div>
								</div>
							</RadioGroup>
						</div>
						<div>
							<Textarea
								disabled
								placeholder="ความเห็น..."
								className="resize-none h-full text-md mb-2"
								value={formData?.instituteCommitteeComment}
							/>
						</div>
						<Button variant="outline" type="button" className="w-60 my-4 h-max">
							<Image
								src={
									formData?.instituteCommittee
										? formData?.instituteCommittee.signatureUrl
										: signature
								}
								width={100}
								height={100}
								alt="signature"
							/>
						</Button>
						<Label className="mb-2">
							{formData?.instituteCommittee
								? `${formData?.instituteCommittee.firstName} ${formData?.instituteCommittee.lastName}`
								: ""}
						</Label>
						<Label className="mb-2">(ประธานคณะกรรมการ)</Label>
					</div>
				</div>
			</div>
			<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg mt-4">
				<div className="w-full h-max flex flex-col items-center">
					<Label className="text-sm font-medium mb-2">
						บทคัดย่อ / Abstract
					</Label>
					<Textarea
						className="text-[16px] resize-none 
						w-full md:w-[595px] lg:w-[794px] 
						h-[842px] lg:h-[1123px] 
						p-[16px] 
						md:pt-[108px] lg:pt-[144px] 
						md:pl-[108px] lg:pl-[144px] 
						md:pr-[72px]  lg:pr-[96px] 
						md:pb-[72px]  lg:pb-[96px]"
						value={formData?.abstract}
						disabled
					/>
				</div>
			</div>
		</>
	);
}

// export default OutlineFormRead;
