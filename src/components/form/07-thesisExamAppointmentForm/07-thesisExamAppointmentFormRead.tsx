import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IOutlineForm, IThesisExamAppointmentForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import InputForm from "@/components/inputForm/inputForm";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisExamAppointmentFormRead = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: approvedForm } = useSWR<IOutlineForm>(`/api/get05ApprovedFormByStdId/${user?.id}`, fetcher);
	const { data: formData } = useSWR<IThesisExamAppointmentForm>(`/api/get07FormById/${formId}`, fetcher);

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
					<div className="w-full">
						<InputForm value={`${formData?.trimester} `} label="ภาคเรียน / Trimester" />
						<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา / Academic year" />
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.gpa}`} label="คะเเนนสะสมเฉลี่ย / GPA" />
						<InputForm value={`${formData?.credits}`} label="หน่วยกิต / Credits" />

						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />

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
								value={`${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
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

							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
							<InputForm
								value={`${formData?.dateExam ? new Date(formData?.dateExam).toLocaleDateString("th") : ""}`}
								label="วันที่นัดสอบ / Date of the examination"
							/>
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
							<Label className="mt-4">{`วันที่ ${
								formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>
				</div>
				<hr className="่่justify-center mx-auto w-full sm:w-max my-5 border-t-2 border-[#eeee]" />
			</div>
		</>
	);
};

export default ThesisExamAppointmentFormRead;
