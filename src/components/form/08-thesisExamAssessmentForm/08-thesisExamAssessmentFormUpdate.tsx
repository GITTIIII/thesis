"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import { Checkbox } from "@/components/ui/checkbox";
import { IExamForm } from "@/interface/form";
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { DatePicker } from "@/components/datePicker/datePicker";

enum ResultExam {
	Excellent = "excellent",
	Pass = "pass",
	Fail = "fail",
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const formSchema = z.object({
	id: z.number(),
	approve: z.boolean(),
	headOfCommitteeSignUrl: z.string(),
	dateOfDecision: z.date(),
	resultExam: z.enum([ResultExam.Excellent, ResultExam.Pass, ResultExam.Fail]),
	presentationComment: z.string().optional(),
	explanationComment: z.string().optional(),
	answerQuestionsComment: z.string().optional(),
	meetingNo: z.number(),
	meetingDate: z.date(),
	headOfCommitteeName: z.string(),
});

async function getUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}
const userPromise = getUser();

const ThesisExamAssessmentFormUpdate = ({ user, formData }: { user: IUser; formData: IExamForm }) => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dateOfDecision: formData?.dateOfDecision ? formData.dateOfDecision : new Date(),
			headOfCommitteeSignUrl: formData?.headOfCommitteeSignUrl || "",
			approve: formData?.approve !== undefined ? Boolean(formData.approve) : false, // แปลงเป็น boolean แบบ primitive
			id: formData?.id || 0,
			presentationComment: formData?.presentationComment || "",
			explanationComment: formData?.explanationComment || "",
			answerQuestionsComment: formData?.answerQuestionsComment || "",
			resultExam: ResultExam.Pass,
			meetingNo: formData?.meetingNo || 0,
			meetingDate: formData?.meetingDate || new Date(),
			headOfCommitteeName: formData?.headOfCommitteeName || "",
		},
	});

	const [openDialog, setOpenDialog] = useState(false);
	const handleSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			headOfCommitteeSignUrl: signUrl,
		});
		setOpenDialog(false);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("values:", values);

		const url = qs.stringifyUrl({
			url: `/api/08ThesisExamForm`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			setTimeout(() => {
				form.reset();
				router.refresh();
				router.push("/user/table");
			}, 1000);
		} else {
			toast({
				title: "Error",
				description: res.statusText,
				variant: "destructive",
			});
		}
	};

	const { reset } = form;

	useEffect(() => {
		reset({
			...form.getValues(),
			id: formData ? formData.id : undefined,
		});
	}, [formData]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
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
					{/* ฝั่งซ้าย */}

					<div className="w-full  mt-5">
						<InputForm
							value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${formData?.student.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${formData?.student.phone} `} label="เบอร์โทรศัพท์ / Phone Number" />

						<div className="w-[300px] flex flex-col items-left mb-6 justify-left mx-auto">
							<FormLabel className="text-sm">ระดับการศึกษา / Education Level</FormLabel>
							<RadioGroup className="space-y-1 mt-2">
								<div>
									<RadioGroupItem checked={formData?.student.degree === "Master"} value="Master" />
									<FormLabel className="ml-2 font-normal">ปริญญาโท (Master Degree)</FormLabel>
								</div>
								<div>
									<RadioGroupItem checked={formData?.student.degree === "Doctoral"} value="Doctoral" />
									<FormLabel className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</FormLabel>
								</div>
							</RadioGroup>
						</div>
						<InputForm value={`${formData?.student.school?.schoolNameTH}`} label="สาขาวิชา / School Of" />
						<InputForm value={`${formData?.student.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
						<InputForm value={`${formData?.student.program?.programNameTH}`} label="หลักสูตร / Program" />

						<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
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
							<InputForm
								value={`${formData?.examinationDate ? new Date(formData?.examinationDate).toLocaleDateString("th") : ""}`}
								label="วันที่สอบ / This Examination Date"
							/>
						</div>

						<div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
							ผลการพิจารณาการสอบวิทยานพนธ์ / Results of Examination
						</div>
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg my-5 border-[#eeee] ">
							<FormField
								control={form.control}
								name="resultExam"
								render={({ field }) => (
									<FormItem className="space-y-3 flex felx-col justify-center item-center mt-5">
										<FormControl>
											<RadioGroup
												value={field.value || (formData?.resultExam ?? ResultExam.Pass)}
												onValueChange={(value) => {
													field.onChange(value);
												}}
												className="flex flex-col space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="excellent" />
													</FormControl>
													<FormLabel className="font-normal">ดีมาก / Excellent</FormLabel>
												</FormItem>
												{field.value === "excellent" && (
													<div>
														<FormField
															control={form.control}
															name="presentationComment"
															render={({ field }) => (
																<div className="flex flex-row items-center mt-5 justify-center">
																	<FormItem className="w-auto">
																		<FormLabel>การนำเสนอ / Presentation</FormLabel>
																		<FormControl>
																			<Textarea
																				className="text-sm p-2 w-[300px] rounded-lg"
																				{...field}
																				placeholder="ความเห็น..."
																				value={
																					formData?.presentationComment
																						? formData?.presentationComment
																						: field.value
																				}
																				onChange={field.onChange}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																</div>
															)}
														/>
														<FormField
															control={form.control}
															name="explanationComment"
															render={({ field }) => (
																<div className="flex flex-row items-center mt-5 justify-center">
																	<FormItem className="w-auto">
																		<FormLabel>การนำเสนอ / Presentation</FormLabel>
																		<FormControl>
																			<Textarea
																				className="text-sm p-2 w-[300px] rounded-lg"
																				{...field}
																				placeholder="ความเห็น..."
																				value={
																					formData?.explanationComment
																						? formData?.explanationComment
																						: field.value
																				}
																				onChange={field.onChange}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																</div>
															)}
														/>
														<FormField
															control={form.control}
															name="answerQuestionsComment"
															render={({ field }) => (
																<div className="flex flex-row items-center mt-5 justify-center">
																	<FormItem className="w-auto">
																		<FormLabel>การนำเสนอ / Presentation</FormLabel>
																		<FormControl>
																			<Textarea
																				className="text-sm p-2 w-[300px] rounded-lg"
																				{...field}
																				placeholder="ความเห็น..."
																				value={
																					formData?.answerQuestionsComment
																						? formData?.answerQuestionsComment
																						: field.value
																				}
																				onChange={field.onChange}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																</div>
															)}
														/>
													</div>
												)}
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="pass" />
													</FormControl>
													<FormLabel className="font-normal">ผ่าน / Pass</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="fail" />
													</FormControl>
													<FormLabel className="font-normal">ไม่ผ่าน / Fail</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex w-full justify-center item-center mt-5">
								<div className="w-[300px] items-top flex space-x-2 mt-2 ">
									{formData?.reviseTitle ? (
										<div className=" mx-auto p-5 flex flex-col item-center justify-center">
											<div>
												<div className="items-top flex space-x-2 mt-2 ">
													<Checkbox checked={!!formData?.reviseTitle} />
													<div className="grid gap-1.5 leading-none">
														<Label className="ml-2 font-normal mb-6">
															ปรับเปลี่ยนชื่อวิทยานิพนธ์ / <br />
															if the thesis title requires revision, <br />
															provide both revised Thai and English titles.
														</Label>
													</div>
												</div>
												<InputForm
													value={`${formData?.newNameTH}`}
													label="ชื่อวิทยานิพนธ์ภาษาไทย / Thai thesis title"
												/>
												<InputForm
													value={`${formData?.newNameEN}`}
													label="ชื่อวิทยานิพนธ์อังกฤษ / English thesis title"
												/>
											</div>
										</div>
									) : undefined}
								</div>
							</div>
						</div>
					</div>
				</div>
				<hr className="justify-center mx-auto w-[88%] my-5 border-t-2 border-[#eeee]" />
				{/* signurl committee */}
				<div className="flex flex-col">
					<div className="text-center">แบบประเมินการสอบวิทยานิพนธ์ (ต่อ) / Thesis Examination Assessment Form (continued)</div>
					<div>
						<div className="w-full flex flex-row flex-wrap item-center justify-center">
							{formData?.committeeSignUrl?.map((field, index) => (
								<div className="flex justify-center flex-col m-5 px-5">
									<div className="flex justify-center">
										<SignatureDialog
											signUrl={
												formData?.committeeSignUrl?.[index]?.signUrl
													? formData?.committeeSignUrl?.[index]?.signUrl
													: ""
											}
											isOpen={false}
											disable={formData?.committeeSignUrl?.[index]?.signUrl ? true : false}
										/>
									</div>
									<div className="flex justify-center mb-2">
										<FormLabel className="font-normal">กรรมการ / Committee</FormLabel>
									</div>
									<div className="flex justify-center item-center mb-5">
										<Input
											value={field.value || (formData?.committeeSignUrl?.[index].name ?? "")}
											className="w-[300px]"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<hr className="justify-center mx-auto w-[88%] my-5 border-t-2 border-[#eeee]" />

				{/* ส่วนของหัวหน้ากรรมการประจำสำนักวิชา */}

				<div>
					{(user.role == "SUPER_ADMIN" || user.position == "HEAD_OF_INSTITUTE") && (
						<div className="w-[88%] mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center">ผลการพิจารณาของคณะกรรมการประจำสำนักวิชา / Institute Committee Decision</div>

							<div className="flex justify-center">
								<FormField
									control={form.control}
									name="meetingNo"
									render={({ field }) => (
										<div className="flex flex-row items-center m-6 justify-center">
											<FormItem className="w-auto">
												<FormLabel>การประชุมครั้งที่ / Meeting No.</FormLabel>
												<FormControl>
													<div className="w-[300px]">
														<Input
															type="number"
															value={
																formData?.meetingNo ? formData?.meetingNo : field.value ? field.value : ""
															}
															onChange={(e) => field.onChange(Number(e.target.value))}
															placeholder="Meeting No."
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
								<FormField
									control={form.control}
									name="meetingDate"
									render={({ field }) => (
										<div className="flex flex-row items-center m-6 justify-center">
											<FormItem className="w-auto">
												<FormLabel>วันที่ / This Date</FormLabel>
												<FormControl>
													<div>
														<DatePicker
															onDateChange={field.onChange}
															value={field.value ? new Date(field.value) : undefined}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							</div>

							<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
								<div className="text-center mb-2">ประธานคณะกรรมการ / Head of Committee</div>
								<SignatureDialog
									disable={formData?.headOfCommitteeSignUrl ? true : false}
									signUrl={
										formData?.headOfCommitteeSignUrl
											? formData?.headOfCommitteeSignUrl
											: form.getValues("headOfCommitteeSignUrl")
									}
									onConfirm={handleSign}
									isOpen={openDialog}
									setIsOpen={setOpenDialog}
								/>
								<FormField
									control={form.control}
									name="headOfCommitteeName"
									render={({ field }) => (
										<div className="flex flex-row items-center justify-center">
											<FormItem className="">
												<FormLabel>ลงชื่อประธานคณะกรรมการ / Head of Committee Name.</FormLabel>
												<FormControl className="w-auto flex flex-col item-center justify-center">
													<div className="w-[300px] flex item-center justify-center">
														<Input
															type="text"
															value={
																formData?.headOfCommitteeName
																	? formData?.headOfCommitteeName
																	: field.value
																	? field.value
																	: ""
															}
															onChange={(e) => field.onChange(e.target.value)}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							</div>
							<div className="flex item-center justify-center">
								{formData?.approve ? (
									<FormField
										control={form.control}
										name="approve"
										render={({ field }) => (
											<FormItem className="space-y-3 flex item-center">
												<FormControl>
													<RadioGroup
														value={formData.approve ? "approve" : "disApprove"}
														onValueChange={(value) => field.onChange(value === "approve")}
														className="flex flex-col space-y-3 item-center justify-center"
													>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="approve" />
															</FormControl>
															<FormLabel className="font-normal">เห็นชอบ / Approve</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="disApprove" />
															</FormControl>
															<FormLabel className="font-normal">ไม่เห็นชอบ / Disapprove</FormLabel>
														</FormItem>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								) : (
									<FormField
										control={form.control}
										name="approve"
										render={({ field }) => (
											<FormItem className="space-y-3 flex item-center">
												<FormControl>
													<RadioGroup
														value={field.value === true ? "approve" : "disApprove"}
														onValueChange={(value) => field.onChange(value === "approve")}
														className="flex flex-col space-y-3 item-center justify-center"
													>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="approve" />
															</FormControl>
															<FormLabel className="font-normal">เห็นชอบ / Approve</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="disApprove" />
															</FormControl>
															<FormLabel className="font-normal">ไม่เห็นชอบ / Disapprove</FormLabel>
														</FormItem>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						</div>
					)}
				</div>
				<div className="w-full flex px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/student/table`)}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
					>
						ยกเลิก
					</Button>
					<Button
						variant="outline"
						type="submit"
						className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
					>
						ยืนยัน
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ThesisExamAssessmentFormUpdate;
