"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem, Label, FormMessage } from "@/components/ui/form";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR from "swr";
import { IExamForm } from "@/interface/form";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisExamAssessmentFormRead = ({ user, formData }: { user: IUser; formData: IExamForm }) => {
	const router = useRouter();

	return (
		<div>
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
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full  mt-5">
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
						<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${user?.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${user?.phone} `} label="เบอร์โทรศัพท์ / Phone Number" />
						<div className="w-[300px] flex flex-col items-left mb-6 justify-left mx-auto">
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
						<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School Of" />
						<InputForm value={`${user?.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
						<InputForm value={`${user?.program?.programNameTH}`} label="หลักสูตร / Program" />

						<InputForm value={`${user?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>
					<div className="border-l border-[#eeee]"></div>

					<div className="w-full ">
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center mb-5">ชื่อวิทยานิพนธ์</div>
							<InputForm value={`${formData?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm value={`${formData?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
							<RadioGroup disabled className="w-[300px] flex flex-col items-left mb-6 justify-left mx-auto">
								<div>
									<RadioGroupItem checked={formData?.disClosed} value="disclosed" />
									<Label className="ml-2 font-normal">
										วิทยานิพนธ์เผยแพร่ได้ / <br /> This Thesis can be disclosed.
									</Label>
								</div>
								<div>
									<RadioGroupItem checked={!formData?.disClosed} value="nondisclosure" />
									<Label className="ml-2 font-normal">
										วิทยานิพนธ์ปกปิด (โปรดกรอก ทบ.24) / <br /> This Thesis is subject to nondisclosure <br />
										(Please attach form No.24).
									</Label>
								</div>
							</RadioGroup>
							<InputForm value={`${formData?.examinationDate}`} label="วันที่สอบ / This Examination Date" />
							<div className="px-4 m-0 text-xs text-justify">
								<span className="font-bold">หมายเหตุ:</span>&nbsp;กรณีนักศึกษามีส่วนที่ต้องปรับปรุง
								ต้องดำเนินการให้แล้วเสร็จ
								<span className="font-bold underline">ภายในระยะเวลา 30 วัน</span>
								และไม่เกินวันสุดท้ายของภาคการศึกษาที่ขอสอบวิทยานิพนธ์ หากดำเนินการไม่ทันภาคการศึกษาดังกล่าว
								นักศึกษาต้องลงทะเบียนรักษาสภาพในภาคการศึกษาถัดไป
								และกำหนดให้วันที่นักศึกษาส่งเล่มวิทยานิพนธ์เป็นวันที่สำเร็จการศึกษา
							</div>
							<div className="px-4 m-0 text-xs text-justify">
								<span className="font-bold">Remask:</span>&nbsp;In the event thesis amendments are required, the
								student&nbsp;
								<span className="font-bold underline">must complete all amendments within 30 days</span>
								&nbsp; and no later than the last day of the term in which the thesis examination took place. Failure to do
								so will result in the student maintaining student status in the following term. The thesis submission date
								shall be deemed the students graduation date.
							</div>
						</div>
						{formData?.reviseTitle ? (
							<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg my-5 border-[#eeee]">
								<div className="w-full">
									<div>
										<div className="items-top flex space-x-2 mt-2 justify-center">
											<Checkbox checked={!!formData?.reviseTitle} />
											<div className="grid gap-1.5 leading-none">
												<Label className="ml-2 font-normal mb-6">
													ปรับเปลี่ยนชื่อวิทยานิพนธ์ / <br />
													if the thesis title requires revision, <br />
													provide both revised Thai and English titles.
												</Label>
											</div>
										</div>
										<InputForm value={`${formData?.newNameTH}`} label="ชื่อวิทยานิพนธ์ภาษาไทย / Thai thesis title" />
										<InputForm value={`${formData?.newNameEN}`} label="ชื่อวิทยานิพนธ์อังกฤษ / English thesis title" />
									</div>
								</div>
							</div>
						) : undefined}
						<hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />
					</div>
				</div>
				<div className="flex flex-col">
					<div className="text-center">แบบประเมินการสอบวิทยานิพนธ์ (ต่อ) / Thesis Examination Assessment Form (continued)</div>
					<div>
						<div className="w-full flex flex-row flex-wrap item-center justify-center">
							{formData?.committeeSignUrl?.map((field, index) => (
								<div className="flex justify-center flex-col m-5 px-5" key={index}>
									<div className="flex justify-center">
										<SignatureDialog
											signUrl={formData?.committeeSignUrl?.[index]?.signUrl || ""}
											isOpen={false}
											disable={!!formData?.committeeSignUrl?.[index]?.signUrl}
										/>
									</div>
									<div className="flex justify-center mb-2">
										<Label className="font-normal">กรรมการ / Committee</Label>
									</div>
									<div className="flex justify-center item-center mb-5">
										<InputForm
											value={`${formData?.committeeSignUrl?.[index]?.name}`}
											label="ชื่อวิทยานิพนธ์ภาษาไทย / Thai thesis title"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
					<hr className="justify-center mx-auto w-[88%] my-5 border-t-2 border-[#eeee]" />

					{/* ส่วนของหัวหน้ากรรมการประจำสำนักวิชา */}
					<div>
						{(user.role === "SUPER_ADMIN" || user.position === "HEAD_OF_INSTITUTE") && (
							<div className="w-[88%] mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
								<div className="text-center">ผลการพิจารณาของคณะกรรมการประจำสำนักวิชา / Institute Committee Decision</div>

								<div className="flex justify-center">
									<div className="flex flex-row items-center m-6 justify-center">
										<Label className="font-normal">การประชุมครั้งที่ / Meeting No.</Label>
										<InputForm value={`${formData?.meetingNo}`} label="Meeting No." />
									</div>

									<div className="flex flex-row items-center m-6 justify-center">
										<Label className="font-normal">วันที่ / This Date/</Label>

										<InputForm
											value={formData?.meetingDate ? new Date(formData?.meetingDate).toLocaleDateString() : ""}
											label="Meeting Date"
										/>
									</div>
								</div>

								<div className="flex item-center justify-center">
									<div className="flex items-center">
										<div className="w-[300px] flex flex-col items-left mb-6 justify-left mx-auto">
											<Label className="font-normal">ผลการพิจารณาการสอบวิทยานพนธ์</Label>
											<RadioGroup disabled className="space-y-1 mt-2">
												<div>
													<RadioGroupItem checked={formData?.resultExam === "excellent"} value="excellent" />
													<Label className="ml-2 font-normal">ดีมาก</Label>
												</div>
												<div>
													<RadioGroupItem checked={formData?.resultExam === "good"} value="good" />
													<Label className="ml-2 font-normal">ผ่าน</Label>
												</div>
												<div>
													<RadioGroupItem checked={formData?.resultExam === "fail"} value="fail" />
													<Label className="ml-2 font-normal">ไม่ผ่าน</Label>
												</div>
											</RadioGroup>
										</div>
									</div>
								</div>
								<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
									<div className="text-center mb-2">ประธานคณะกรรมการ / Head of Committee</div>
									<SignatureDialog
										disable={!!formData?.headOfCommitteeSignUrl}
										signUrl={formData?.headOfCommitteeSignUrl || ""}
										isOpen={false}
									/>
									<InputForm
										value={formData?.headOfCommitteeName || ""}
										label="ลงชื่อประธานคณะกรรมการ / Head of Committee Name"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThesisExamAssessmentFormRead;
