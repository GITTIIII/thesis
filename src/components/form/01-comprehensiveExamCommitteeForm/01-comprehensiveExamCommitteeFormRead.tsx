import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { IComprehensiveExamCommitteeForm } from "@/interface/form";

async function getComprehensiveExamCommitteeFormById(formId: number): Promise<IComprehensiveExamCommitteeForm> {
	const res = await fetch(`/api/getComprehensiveExamCommitteeFormById/${formId}`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

const ComprehensiveExamCommitteeFormRead = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const [formData, setFormData] = useState<IComprehensiveExamCommitteeForm>();

	useEffect(() => {
		async function fetchData() {
			const data = await getComprehensiveExamCommitteeFormById(formId);
			setFormData(data);
		}
		fetchData();
	}, [formId]);

	console.log(formData);

	return (
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
				<div className="w-full sm:2/4">
					<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
					<InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
					<InputForm value={`${formData?.trimester}`} label="ภาคเรียน / Trimester" />
					<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา / Academic year" />
					<InputForm value={`${formData?.examDay}`} label="วันที่สอบ / Date of the examination" />

					<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
					<InputForm value={`${formData?.student.username}`} label="รหัสนักศึกษา / Student ID" />
					<InputForm
						value={
							formData?.student.formLanguage == "en"
								? `${formData?.student.firstNameEN} ${formData?.student.lastNameEN}`
								: `${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`
						}
						label="ชื่อ-นามสกุล / Fullname"
					/>
					<InputForm
						value={
							formData?.student.formLanguage == "en"
								? `${formData?.student?.school.schoolNameEN}`
								: `${formData?.student?.school.schoolNameTH}`
						}
						label="สาขาวิชา / School"
					/>
					<InputForm
						value={
							formData?.student.formLanguage == "en"
								? `${formData?.student?.program.programNameEN}`
								: `${formData?.student?.program.programNameTH}`
						}
						label="หลักสูตร / Program"
					/>
					<InputForm
						value={`${formData?.student.program.programYear}`}
						label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)"
					/>
				</div>

				<div className="w-full sm:2/4">
					<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
					<div className="flex items-center justify-center text-sm">
						<CircleAlert className="mr-1" />
						สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
						<Button variant="link" className="p-1 text-[#A67436]">
							<Link href="">คลิกที่นี่</Link>
						</Button>
					</div>
					<InputForm value={`${formData?.committeeName1}`} label="ประธานกรรมการ / Head of the Committee" />
					<InputForm value={`${formData?.committeeName2}`} label="กรรมการ / Member of the Committee" />
					<InputForm value={`${formData?.committeeName3}`} label="กรรมการ / Member of the Committee" />
					<InputForm value={`${formData?.committeeName4}`} label="กรรมการ / Member of the Committee" />
					<InputForm value={`${formData?.committeeName5}`} label="กรรมการ / Member of the Committee" />
				</div>
			</div>
		</div>
	);
};

export default ComprehensiveExamCommitteeFormRead;
