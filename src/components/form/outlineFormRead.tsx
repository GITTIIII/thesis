import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import signature from "@/../../public/asset/signature.png";
import InputForm from "@/components/inputForm/inputForm";
import Image from "next/image";

type Form = {
	id: number;
	date: string;
	thesisNameTH: string;
	thesisNameEN: string;

	studentID: number;
	student: User;
	advisorID: number;
	advisor: User;
	coAdvisorID: number;
	coAdvisor: User;

	committeeOutlineID: number;
	committeeOutline: User;
	committeeOutlineStatus: string;
	committee_outlineComment: string;
	dateCommitteeOutlineSign: string;

	committeeInstituteID: number;
	committeeInstitute: User;
	committeeInstituteStatus: string;
	committeeInstituteComment: string;
	dateCommitteeInstituteSign: string;
};

type User = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	educationLevel: string;
	school: string;
	program: string;
	programYear: string;
	advisorID: number;
	co_advisorID: number;
	signatureUrl: string;
};

const OutlineFormRead = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const [formData, setFormData] = useState<Form | null>(null);
	console.log(formId);
	useEffect(() => {
		if (formId) {
			fetch(`/api/getOutlineFormById/${formId}`)
				.then((res) => res.json())
				.then((data) => setFormData(data));
		}
	}, [formId]);

	return (
		<>
			<div className="w-full h-full bg-white p-4">
				<div className="w-full flex px-20">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/student/table")}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<InputForm value={`${formData?.date}`} label="วันที่สร้าง / Date" />
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
						<div className="text-center">ชื่อโครงร่างวิทยานิพนธ์</div>
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
									formData?.committeeOutline
										? formData?.committeeOutline.signatureUrl
										: signature
								}
								width={100}
								height={100}
								alt="signature"
							/>
						</Button>
					</div>

					<div className="flex flex-col justify-center items-center px-20">
						<h1 className="mb-2 font-bold">กรรมการสำนักวิชา</h1>
						<Label>ลายเซ็น / Signature</Label>
						<Button variant="outline" type="button" className="w-60 mt-4 h-max">
							<Image
								src={
									formData?.committeeInstitute
										? formData?.committeeInstitute.signatureUrl
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
		</>
	);
};

export default OutlineFormRead;
