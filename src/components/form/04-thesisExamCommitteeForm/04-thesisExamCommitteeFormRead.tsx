"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { IExamCommitteeForm } from "@/interface/form";
import InputForm from "../../inputForm/inputForm";
import Link from "next/link";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const ThesisExamCommitteeFormRead = ({ formData }: { formData: IExamCommitteeForm }) => {
	const router = useRouter();

	return (
		<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
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
				<div className="w-full ">
					<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
					<InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
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
					<InputForm
						value={`${formData?.examDate ? new Date(formData?.examDate).toLocaleDateString("th") : ""}`}
						label="วันที่สอบ / Date of the examination"
					/>

					<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
					<InputForm value={`${formData?.student.username}`} label="รหัสนักศึกษา / Student ID" />
					<InputForm value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
					<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
					<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
					<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
				</div>

				<div className="w-full ">
					<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
					<div className="flex items-center justify-center text-sm">
						<CircleAlert className="mr-1" />
						สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
						<Button variant="link" className="p-1 text-[#A67436]">
							<Link href="/user/expertTable">คลิกที่นี่</Link>
						</Button>
					</div>
					{formData?.committeeMembers.map((member, index: number) => (
						<InputForm key={index} value={`${member.name}`} label="กรรมการ / Committee" />
					))}
				</div>
			</div>
			<div className="w-full h-max flex justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
				<div className="w-full h-full flex flex-col justify-center items-center">
					<h1 className="font-bold">ลายเซ็นอาจารย์ที่ปรึกษา</h1>
					<SignatureDialog signUrl={formData?.advisorSignUrl ? formData?.advisorSignUrl : ""} disable={true} />
					<Label className="mb-2">
						{formData?.student.advisor
							? `${formData?.student.advisor.prefix?.prefixTH}${formData?.student.advisor.firstNameTH} ${formData?.student.advisor.lastNameTH}`
							: ""}
					</Label>
				</div>

				<div className="w-full h-full flex flex-col justify-center items-center">
					<h1 className="font-bold">ลายเซ็นหัวหน้าสาขาวิชา</h1>
					<SignatureDialog signUrl={formData?.headSchoolSignUrl ? formData?.headSchoolSignUrl : ""} disable={true} />
					<Label className="">
						{formData?.headSchool
							? `${formData?.headSchool?.prefix?.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`
							: ""}
					</Label>
					<Label className="">{`หัวหน้าสาขาวิชา ${
						formData?.headSchool ? formData?.headSchool?.school?.schoolNameTH : ""
					}`}</Label>
				</div>

				<div className="w-full h-full flex flex-col justify-center items-center">
					<h1 className="font-bold">ลายเซ็นหัวหน้าสำนักวิชา</h1>
					<SignatureDialog signUrl={formData?.instituteComSignUrl ? formData?.instituteComSignUrl : ""} disable={true} />
					{/* <Label className="">
						{formData?.headSchool
							? `${formData?.headSchool?.prefix?.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`
							: ""}
					</Label> */}
					{/* <Label className="">{`หัวหน้าสำนักวิชา ${
						formData?.headSchool ? formData?.headSchool?.school?.schoolNameTH : ""
					}`}</Label> */}
				</div>
			</div>
		</div>
	);
};

export default ThesisExamCommitteeFormRead;
