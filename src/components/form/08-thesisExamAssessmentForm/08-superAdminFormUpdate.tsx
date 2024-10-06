"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldArray, useForm } from "react-hook-form";
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

enum ResultExam {
	Excellent = "excellent",
	Pass = "pass",
	Fail = "fail",
}
const formSchema = z.object({
	thesisNameTH: z.string(),
	thesisNameEN: z.string(),
	id: z.number(),
	examinationDate: z.date(),
	disClosed: z.boolean(),
	date: z.date(),
	newNameTH: z.string().optional(),
	newNameEN: z.string().optional(),
	reviseTitle: z.boolean(),
	committeeSignUrl: z
		.array(
			z.object({
				name: z.string().min(1, { message: "กรุณากรอกชื่อกรรมการ / Committee member required" }),
				signUrl: z.string(),
			})
		)
		.min(5, {
			message: "กรุณาเพิ่มกรรมการอย่างน้อย 5 คน / At least 5 committee members required",
		}),
	resultExam: z.enum([ResultExam.Excellent, ResultExam.Pass, ResultExam.Fail]),
	presentationComment: z.string().optional(),
	explanationComment: z.string().optional(),
	answerQuestionsComment: z.string().optional(),
});

const ThesisExamAssessmentFormSuperAdmin = ({ user, formData }: { user: IUser; formData: IExamForm }) => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			thesisNameTH: "",
			thesisNameEN: "",
			id: 0,
			examinationDate: new Date(),
			disClosed: true,
			newNameTH: "",
			newNameEN: "",
			reviseTitle: false,
			committeeSignUrl:
				formData && formData.committeeSignUrl
					? formData.committeeSignUrl
					: [
							{ name: "", signUrl: "" },
							{ name: "", signUrl: "" },
							{ name: "", signUrl: "" },
							{ name: "", signUrl: "" },
							{ name: "", signUrl: "" },
					  ],
			presentationComment: "",
			explanationComment: "",
			answerQuestionsComment: "",
			resultExam: ResultExam.Pass,
		},
	});
	const control = form.control;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "committeeSignUrl",
	});
	const [openDialogs, setOpenDialogs] = useState(Array(fields.length).fill(false));
	const handleSign = (signUrl: string, index: number) => {
		console.log("index", index);
		const updatedCommitteeSignUrl = form.getValues().committeeSignUrl.map((committee, i) => {
			if (i === index) {
				return { ...committee, signUrl: signUrl }; // อัปเดต signUrl ของกรรมการที่เลือก
			}
			return committee; // คืนค่าของกรรมการอื่น  ๆ โดยไม่เปลี่ยนแปลง
		});

		reset({
			...form.getValues(),
			committeeSignUrl: updatedCommitteeSignUrl, // ตั้งค่าอาเรย์ใหม่
		});
		setOpenDialogs((prev) => {
			const newDialogs = [...prev];
			newDialogs[index] = false; // ปิด dialog หลังจากเซ็น
			return newDialogs;
		});
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("formid:", values.id);

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

	const [isChecked, setIsChecked] = useState(false);

	const checkHandler = (checked: boolean) => {
		setIsChecked(!isChecked);
		form.setValue("reviseTitle", checked);
		console.log("check:", isChecked);
	};
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
							label="ชื่อ-นามสกุล / Full name"
						/>
						<InputForm value={`${formData?.student.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${formData?.student.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${formData?.student.phone} `} label="เบอร์โทรศัพท์ / Telephone" />

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
							<InputForm value={`${formData?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
							<InputForm value={`${formData?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />
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
												value={field.value || (formData?.resultExam?.toString() ?? ResultExam.Pass)}
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
																				placeholder="comment..."
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
																				placeholder="comment..."
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
																				placeholder="comment..."
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
							{fields.map((field, index) => (
								<FormField
									key={field.id}
									control={form.control}
									name={`committeeSignUrl.${index}.name`}
									render={({ field }) => (
										<FormItem>
											<div className="flex justify-center flex-col m-5">
												<div className="flex justify-center">
													<SignatureDialog
														signUrl={
															formData?.committeeSignUrl?.[index]?.signUrl
																? formData?.committeeSignUrl?.[index]?.signUrl
																: form.getValues(`committeeSignUrl.${index}.signUrl`)
														}
														onConfirm={(url: string) => handleSign(url, index)}
														isOpen={openDialogs[index]}
														setIsOpen={(isOpen) => {
															setOpenDialogs((prev) => {
																const newDialogs = [...prev];
																newDialogs[index] = isOpen;
																return newDialogs;
															});
														}}
														disable={formData?.committeeSignUrl?.[index]?.signUrl ? true : false}
													/>
												</div>
												<div className="flex justify-center mb-2">
													<FormLabel className="font-normal">กรรมการ / Committee</FormLabel>
												</div>
												<div className="flex justify-center item-center mb-5">
													<Input
														value={field.value || (formData?.committeeSignUrl?.[index].name ?? "")}
														onChange={field.onChange}
														className="w-[300px]"
													/>

													<div className="ml-2">
														{index > 4 && (
															<Button
																type="button"
																onClick={() => remove(index)}
																className="w-[3%] bg-[#fff] hover:text-black hover:bg-white text-[#A67436] border-2 border-[#A67436] rounded-lg"
															>
																ลบ
															</Button>
														)}
													</div>
												</div>
											</div>
											<FormMessage className="flex item-center justify-center" />
										</FormItem>
									)}
								/>
							))}
						</div>
						<div className="w-full flex justify-center">
							<Button
								type="button"
								onClick={() => append({ name: "", signUrl: "" })}
								className="bg-[#A67436] text-white hover:text-black hover:border-2 hover:border-[#A67436] hover:bg-white"
							>
								เพิ่มกรรมการ
							</Button>
						</div>
					</div>
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

export default ThesisExamAssessmentFormSuperAdmin;
