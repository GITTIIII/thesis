import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import signature from "@/../../public/asset/signature.png";
import InputForm from "@/components/inputForm/inputForm";
import Image from "next/image";
import { Textarea } from "../ui/textarea";

async function getOutlineFormById(formId: number) {
	const res = await fetch(`/api/getOutlineFormById/${formId}`);
	return res.json();
}

export default async function OutlineFormRead({ formId }: { formId: number }) {
	const router = useRouter();
	const formData = await getOutlineFormById(formId);

	return (
		<>
			<div className="w-full h-full bg-white p-4">
				<div className="w-full flex px-20">
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
							<RadioGroup className="space-y-1 mt-2">
								<div>
									<RadioGroupItem
										checked={formData?.student?.educationLevel === "Master"}
										value="Master"
									/>
									<Label className="ml-2 font-normal">
										ปริญญาโท (Master Degree)
									</Label>
								</div>
								<div>
									<RadioGroupItem
										checked={formData?.student?.educationLevel === "Doctoral"}
										value="Doctoral"
									/>
									<Label className="ml-2 font-normal">
										ปริญญาเอก (Doctoral Degree)
									</Label>
								</div>
							</RadioGroup>
						</div>

						<InputForm
							value={`${formData?.student?.school}`}
							label="สำนักวิชา / School"
						/>
						<InputForm
							value={`${formData?.student?.program}`}
							label="หลักสูตร / Program"
						/>
						<InputForm
							value={`${formData?.student?.programYear}`}
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
						<div className="flex flex-col items-center mb-6 justify-center">
							<Label>ลายเซ็น / Signature</Label>
							<Button
								variant="outline"
								type="button"
								className="w-60 mt-4 h-max"
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
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center mb-6 justify-center md:flex-row">
					<div className="flex flex-col justify-center items-center px-20">
						<h1 className="mb-2 font-bold">กรรมการโครงร่าง</h1>
						<Label>ลายเซ็น / Signature</Label>
						<Button variant="outline" type="button" className="w-60 mt-4 h-max">
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
						<div className="flex flex-col items-center justify-center">
							<RadioGroup className="flex my-6">
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
							<Label>ความเห็นกรรมการสำนักวิชา</Label>
							<Textarea
								placeholder="ความเห็น..."
								className="resize-none h-full text-md"
								value={formData?.outlineCommitteeComment}
							/>
						</div>
					</div>

					<div className="flex flex-col justify-center items-center px-20">
						<h1 className="mb-2 font-bold">กรรมการสำนักวิชา</h1>
						<Label>ลายเซ็น / Signature</Label>
						<Button variant="outline" type="button" className="w-60 mt-4 h-max">
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
						<div className="flex flex-col items-center justify-center">
							<RadioGroup className="flex my-6">
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
							<Label>ความเห็นกรรมการสำนักวิชา</Label>
							<Textarea
								placeholder="ความเห็น..."
								className="resize-none h-full text-md"
								value={formData?.instituteCommitteeComment}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// export default OutlineFormRead;
