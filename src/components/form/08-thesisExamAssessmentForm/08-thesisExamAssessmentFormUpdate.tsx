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
import { Label } from "@/components/ui/label";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { DatePicker } from "@/components/datePicker/datePicker";
import { IOutlineForm, IThesisExamAssessmentForm } from "@/interface/form";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { IExpert } from "@/interface/expert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, Trash, Trash2, Trash2Icon, X } from "lucide-react";

const formSchema = z.object({
	id: z.number(),
	result: z.string(),
	presentationComment: z.string().optional(),
	explanationComment: z.string().optional(),
	answerQuestionComment: z.string().optional(),
	failComment: z.string().optional(),

	reviseTitle: z.boolean().optional(),
	newThesisNameTH: z.string().optional(),
	newThesisNameEN: z.string().optional(),

	headOfCommitteeID: z.number(),
	headOfCommitteeSignUrl: z.string(),
	advisorSignUrl: z.string(),
	coAdvisors: z.array(
		z
			.object({
				coAdvisor: z.object({
					coAdvisorID: z.number().optional(),
					signatureUrl: z.string().optional(),
				}),
			})
			.optional()
	),
	committees: z.array(
		z
			.object({
				committee: z.object({
					committeeID: z.number().optional(),
					signatureUrl: z.string().optional(),
				}),
			})
			.optional()
	),

	times: z.string(),
	dateInstituteCommitteeSign: z.date().optional(),
	instituteCommitteeStatus: z.string(),
	instituteCommitteeComment: z.string().optional(),
	instituteCommitteeSignUrl: z.string(),
	instituteCommitteeID: z.number(),
});

const ThesisExamAssessmentFormUpdate = ({
	user,
	formData,
	approvedForm,
	expert,
	instituteCommittee,
	adminNotNone,
}: {
	user: IUser;
	formData: IThesisExamAssessmentForm;
	approvedForm: IOutlineForm;
	expert: IExpert[];
	instituteCommittee: IUser[];
	adminNotNone: IUser[];
}) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openHeadOfCommitteeDialog, setOpenHeadOfCommitteeDialog] = useState(false);
	const [openAdvisorDialog, setOpenAdvisorDialog] = useState(false);
	const [openCoAdvisorDialog, setOpenCoAdvisorDialog] = useState<{ [key: number]: boolean }>({});
	const [openCommitteeDialog, setOpenCommitteeDialog] = useState<{ [key: number]: boolean }>({});
	const [openinstituteComDialog, setOpeninstituteComDialog] = useState(false);
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			result: "",
			presentationComment: "",
			explanationComment: "",
			answerQuestionComment: "",
			failComment: "",

			reviseTitle: false,
			newThesisNameTH: "",
			newThesisNameEN: "",

			headOfCommitteeID: 0,
			headOfCommitteeSignUrl: "",
			advisorSignUrl: "",
			coAdvisors: [
				{
					coAdvisor: {
						coAdvisorID: 0,
						signatureUrl: "",
					},
				},
			],
			committees: [
				{
					committee: {
						committeeID: 0,
						signatureUrl: "",
					},
				},
			],

			times: "",
			dateInstituteCommitteeSign: undefined as unknown as Date,
			instituteCommitteeStatus: "",
			instituteCommitteeComment: "",
			instituteCommitteeSignUrl: "",
			instituteCommitteeID: 0,
		},
	});

	const handleDrawingHeadOfCommitteeSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			headOfCommitteeSignUrl: signUrl,
		});
		setOpenHeadOfCommitteeDialog(false);
	};

	const handleDrawingAdvisorSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			advisorSignUrl: signUrl,
		});
		setOpenAdvisorDialog(false);
	};

	const handleDrawingCoAdvisorSign = (signUrl: string, index: number) => {
		const coAdvisors = form.getValues().coAdvisors.map((coAdvisor, i) => {
			if (i === index) {
				return {
					...coAdvisor,
					coAdvisor: {
						coAdvisorID: coAdvisor.coAdvisor.coAdvisorID,
						signatureUrl: signUrl,
					},
				};
			}
			return coAdvisor;
		});

		form.setValue("coAdvisors", coAdvisors, { shouldValidate: true });

		toggleCoAdvisorDialog(index, false);
	};

	const handleDrawingCommitteeSign = (signUrl: string, index: number) => {
		const committees = form.getValues().committees.map((committee, i) => {
			console.log(index);
			if (i === index) {
				return {
					...committee,
					committee: {
						committeeID: committee.committee.committeeID,
						signatureUrl: signUrl,
					},
				};
			}
			return committee;
		});

		form.setValue("committees", committees, { shouldValidate: true });

		toggleCommitteeDialog(index, false);
	};

	const handleDrawingSignInstitute = (signUrl: string) => {
		reset({
			...form.getValues(),
			instituteCommitteeSignUrl: signUrl,
		});
		setOpeninstituteComDialog(false);
	};

	const toggleCoAdvisorDialog = (index: number, isOpen: boolean) => {
		setOpenCoAdvisorDialog((prevState) => ({
			...prevState,
			[index]: isOpen,
		}));
	};

	const toggleCommitteeDialog = (index: number, isOpen: boolean) => {
		setOpenCommitteeDialog((prevState) => ({
			...prevState,
			[index]: isOpen,
		}));
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		const url = qs.stringifyUrl({
			url: `/api/08ThesisExamAssessmentForm`,
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
				router.back();
			}, 1000);
		} else {
			toast({
				title: "Error",
				description: res.statusText,
				variant: "destructive",
			});
		}
	};

	const {
		reset,
		formState: { errors },
		control,
	} = form;

	const {
		fields: coAdvisorFields,
		append: coAdvisorAppend,
		remove: coAdvisorRemove,
	} = useFieldArray({
		control,
		name: "coAdvisors",
	});

	const {
		fields: committeeFields,
		append: committeeAppend,
		remove: committeeRemove,
	} = useFieldArray({
		control,
		name: "committees",
	});

	useEffect(() => {
		reset({
			...form.getValues(),
			id: formData.id,
		});
	}, [formData]);

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	useEffect(() => {
		const errorKeys = Object.keys(errors);
		if (errorKeys.length > 0) {
			setIsOpen(false);
			const firstErrorField = errorKeys[0] as keyof typeof errors;
			const firstErrorMessage = errors[firstErrorField]?.message;
			toast({
				title: "เกิดข้อผิดพลาด",
				description: firstErrorMessage,
				variant: "destructive",
			});
			console.log(errors);
		}
	}, [errors]);

	useEffect(() => {
		console.log(form.getValues());
	}, [form.watch()]);

	useEffect(() => {
		if (form.getValues("result") !== "ดีมาก") {
			reset({
				...form.getValues(),
				presentationComment: "",
				explanationComment: "",
				answerQuestionComment: "",
			});
		}
		if (form.getValues("result") !== "ไม่ผ่าน") {
			reset({
				...form.getValues(),
				failComment: "",
			});
		}
		if (!form.getValues("reviseTitle")) {
			reset({
				...form.getValues(),
				newThesisNameTH: "",
				newThesisNameEN: "",
			});
		}
	}, [form.watch("result"), form.watch("reviseTitle")]);

	useEffect(() => {
		if (Array.isArray(formData?.student?.coAdvisedStudents)) {
			reset({
				...form.getValues(),
				coAdvisors: [],
			});

			formData.student.coAdvisedStudents.forEach((coAdvisorStudent) => {
				coAdvisorAppend({
					coAdvisor: {
						coAdvisorID: coAdvisorStudent?.coAdvisorID || 0,
						signatureUrl: coAdvisorStudent?.coAdvisor?.signatureUrl || "",
					},
				});
			});
		}
	}, [formData, coAdvisorAppend, reset, form]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 rounded-xl">
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
				<div className="flex flex-col justify-center md:flex-row mb-4">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm
							value={`${formData.student.firstNameTH} ${formData.student.lastNameTH}`}
							label="ชื่อ-นามสกุล / Full name"
						/>
						<InputForm value={`${formData.student.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${formData.student.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${formData.student.phone} `} label="เบอร์โทรศัพท์ / Telephone" />
						<InputForm value={`${formData.student.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData.student.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full ">
						<div className="w-full sm:w-3/4 mx-auto flex flex-col item-center justify-center rounded-lg mb-2">
							<div className="text-center font-semibold mb-2">โครงร่างวิทยานิพนธ์</div>
							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />

							<div className="m-auto w-full sm:w-[300px] mb-6">
								<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
									<div className="flex items-center space-x-3 space-y-0">
										<RadioGroupItem checked={formData.disClosed} value="1" />
										<Label className="font-normal">
											วิทยานิพนธ์เผยแพร่ได้ / <br />
											This Thesis can be disclosed.
										</Label>
									</div>
									<div className="flex items-center space-x-3 space-y-0">
										<RadioGroupItem checked={!formData.disClosed} value="2" />
										<Label className="ml-2 font-normal">
											วิทยานิพนธ์ปกปิด (โปรดกรอก ทบ.24) / <br />
											This Thesis is subject to nondisclosure (Please attach form No.24).
										</Label>
									</div>
								</RadioGroup>
							</div>
							<InputForm
								value={`${formData.examDate.toLocaleDateString("th")}`}
								label="วันที่นัดสอบ / Date of the examination"
							/>
						</div>
					</div>
				</div>

				<div className="w-full xl:w-1/2 h-full mx-auto bg-white p-4 flex flex-col items-center gap-4">
					<h1 className="text-center font-semibold">ผลการพิจารณาการสอบวิทยานิพนธ์ / Results of Thesis Examination</h1>
					{formData?.headOfCommitteeID ? (
						<div className="w-full sm:w-[300px] flex justify-center">
							<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData?.result == "ดีมาก"} value="ดีมาก" />
									<Label className="ml-2 font-normal">ดีมาก / Excellent</Label>
								</div>
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData?.result == "ผ่าน"} value="ผ่าน" />
									<Label className="ml-2 font-normal">ผ่าน / Pass</Label>
								</div>
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData?.result == "ไม่ผ่าน"} value="ไม่ผ่าน" />
									<Label className="ml-2 font-normal">ไม่ผ่าน / Fail</Label>
								</div>
							</RadioGroup>
						</div>
					) : (
						<FormField
							control={form.control}
							name="result"
							render={({ field }) => (
								<div>
									<FormItem className="w-full sm:w-[300px] flex justify-center">
										<RadioGroup
											onValueChange={(value) => field.onChange(value)}
											defaultValue={field.value.toString()}
											className="flex flex-col space-y-1"
										>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="ดีมาก" />
												</FormControl>
												<FormLabel className="font-normal">ดีมาก / Excellent</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="ผ่าน" />
												</FormControl>
												<FormLabel className="font-normal">ผ่าน / Pass</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="ไม่ผ่าน" />
												</FormControl>
												<FormLabel className="font-normal">ไม่ผ่าน / Fail</FormLabel>
											</FormItem>
										</RadioGroup>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
					)}

					{(formData?.result != "ผ่าน" || (form.getValues("result") != "ผ่าน" && form.getValues("result") != "")) && (
						<>
							<h1 className="text-center font-semibold">
								ความเห็นของคณะกรรมการสอบวิทยานิพนธ์ ในกรณีที่ผลการพิจารณาดีมากหรือไม่ผ่าน / <br />
								Comments of thesis examining committee, in case of excellent or fail results{" "}
							</h1>
							{(formData?.result == "ดีมาก" || form.getValues("result") == "ดีมาก") &&
								(formData.result == "ดีมาก" ? (
									<>
										<InputForm value={`${formData.presentationComment} `} label="การนำเสนอ / Presentation" />
										<InputForm value={`${formData.explanationComment} `} label="การอธิบาย / Explanation" />
										<InputForm value={`${formData.answerQuestionComment} `} label="การตอบคำถาม / Answer question" />
									</>
								) : (
									<>
										<FormField
											control={form.control}
											name="presentationComment"
											render={({ field }) => (
												<div className="flex flex-row items-center mb-2 justify-center">
													<FormItem className="w-full sm:w-auto">
														<FormLabel>
															การนำเสนอ / Presentation <span className="text-red-500">*</span>
														</FormLabel>
														<FormControl>
															<Input
																className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
																{...field}
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
												<div className="flex flex-row items-center mb-2 justify-center">
													<FormItem className="w-full sm:w-auto">
														<FormLabel>
															การอธิบาย / Explanation <span className="text-red-500">*</span>
														</FormLabel>
														<FormControl>
															<Input
																className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="answerQuestionComment"
											render={({ field }) => (
												<div className="flex flex-row items-center mb-2 justify-center">
													<FormItem className="w-full sm:w-auto">
														<FormLabel>
															การตอบคำถาม / Answer question <span className="text-red-500">*</span>
														</FormLabel>
														<FormControl>
															<Input
																className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												</div>
											)}
										/>
									</>
								))}
							{(formData.result == "ไม่ผ่าน" || form.getValues("result") == "ไม่ผ่าน") &&
								(formData.result == "ไม่ผ่าน" ? (
									<InputForm value={`${formData.failComment}`} label="" />
								) : (
									<FormField
										control={form.control}
										name="failComment"
										render={({ field }) => (
											<div className="flex flex-row items-center mb-2 justify-center">
												<FormItem className="w-full sm:w-auto">
													<FormControl>
														<Input className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
								))}
						</>
					)}
					<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
					<FormField
						control={form.control}
						name="reviseTitle"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-3 space-y-0 my-2">
								<FormControl>
									<Checkbox
										disabled={formData.reviseTitle != undefined ? true : false}
										checked={formData.reviseTitle || field.value}
										onCheckedChange={(checked) => field.onChange(checked)}
									/>
								</FormControl>
								<FormLabel>ปรับเปลี่ยนชื่อวิทยานิพนธ์ / Revise thesis title</FormLabel>
							</FormItem>
						)}
					/>
					{(formData.reviseTitle != undefined || form.getValues("reviseTitle")) &&
						(formData.reviseTitle ? (
							<>
								<InputForm value={`${formData.newThesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
								<InputForm value={`${formData.newThesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />
							</>
						) : (
							<>
								<FormField
									control={form.control}
									name="newThesisNameTH"
									render={({ field }) => (
										<div className="flex flex-row items-center mb-2 justify-center">
											<FormItem className="w-full sm:w-auto">
												<FormLabel>
													ชื่อภาษาไทย / Thesis name (TH) <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
								<FormField
									control={form.control}
									name="newThesisNameEN"
									render={({ field }) => (
										<div className="flex flex-row items-center mb-2 justify-center">
											<FormItem className="w-full sm:w-auto">
												<FormLabel>
													ชื่อภาษาอังกฤษ / Thesis name (EN) <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							</>
						))}
					<div className="w-full mx-auto px-4 m-0 text-xs text-justify">
						<span className="font-bold">หมายเหตุ:</span>&nbsp;กรณีนักศึกษามีส่วนที่ต้องปรับปรุงต้องดำเนินการให้แล้วเสร็จ
						<span className="font-bold underline">ภายในระยะเวลา 30 วัน</span>
						และไม่เกินวันสุดท้ายของภาคการศึกษาที่ขอสอบวิทยานิพนธ์ หากดำเนินการไม่ทันภาคการศึกษาดังกล่าว
						นักศึกษาต้องลงทะเบียนรักษาสภาพในภาคการศึกษาถัดไปและกำหนดให้วันที่นักศึกษาส่งเล่มวิทยานิพนธ์เป็นวันที่สำเร็จการศึกษา
					</div>
					<div className="w-full mx-auto px-4 m-0 text-xs text-justify">
						<span className="font-bold">Remask:</span>&nbsp;In the event thesis amendments are required, the student&nbsp;
						<span className="font-bold underline">must complete all amendments within 30 days</span>&nbsp; and no later than the
						last day of the term in which the thesis examination took place. Failure to do so will result in the student
						maintaining student status in the following term. The thesis submission date shall be deemed the students graduation
						date.
					</div>
					<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
					{(user.role == "ADMIN" || user.role == "SUPER_ADMIN") && (
						<>
							<div className="h-max flex flex-col justify-center  items-center lg:px-20">
								<SignatureDialog
									disable={formData?.headOfCommitteeSignUrl ? true : false}
									signUrl={formData?.headOfCommitteeSignUrl || form.getValues("headOfCommitteeSignUrl")}
									onConfirm={handleDrawingHeadOfCommitteeSign}
									isOpen={openHeadOfCommitteeDialog}
									setIsOpen={setOpenHeadOfCommitteeDialog}
								/>
								{formData?.headOfCommitteeID ? (
									<Label className="mb-2">
										{`${formData?.headOfCommittee?.prefix}${formData?.headOfCommittee?.firstName} ${formData?.headOfCommittee?.lastName}`}
									</Label>
								) : (
									<FormField
										control={form.control}
										name="headOfCommitteeID"
										render={({ field }) => (
											<>
												<Popover>
													<PopoverTrigger asChild disabled={user?.role != "SUPER_ADMIN" && user?.role != "ADMIN"}>
														<FormControl>
															<Button
																variant="outline"
																role="combobox"
																className={cn(
																	"w-full sm:w-[300px] justify-between",
																	!field.value && "text-muted-foreground"
																)}
															>
																{field.value
																	? `${expert?.find((expert) => expert.id === field.value)?.prefix}${
																			expert?.find((expert) => expert.id === field.value)?.firstName
																	  } ${expert?.find((expert) => expert.id === field.value)?.lastName} `
																	: "เลือกประธานกรรมการ"}
																<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-full p-0">
														<Command>
															<CommandInput placeholder="ค้นหากรรมการ" />
															<CommandList>
																<CommandEmpty>ไม่พบกรรมการ</CommandEmpty>
																{expert?.map((expert) => (
																	<CommandItem
																		value={`${expert.prefix}${expert.firstName} ${expert.lastName}`}
																		key={expert.id}
																		onSelect={() => {
																			form.setValue("headOfCommitteeID", expert.id);
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value === expert.id ? "opacity-100" : "opacity-0"
																			)}
																		/>
																		{`${expert.prefix}${expert.firstName} ${expert.lastName}`}
																	</CommandItem>
																))}
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</>
										)}
									/>
								)}
								<Label className="my-2">{`(ประธานคณะกรรมการ)`}</Label>
							</div>
							<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
							<div className="h-max flex flex-col justify-center  items-center lg:px-20">
								<SignatureDialog
									userSignUrl={user.role == "ADMIN" && user.position !== "NONE" ? user.signatureUrl : ""}
									disable={formData?.advisorSignUrl ? true : false}
									signUrl={formData?.advisorSignUrl || form.getValues("advisorSignUrl")}
									onConfirm={handleDrawingAdvisorSign}
									isOpen={openAdvisorDialog}
									setIsOpen={setOpenAdvisorDialog}
								/>
								<Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
								<Label className="my-2">{`(อาจารย์ที่ปรึกษาวิทยานิพนธ์)`}</Label>
							</div>
							<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
							{Array.isArray(formData?.student?.coAdvisedStudents) &&
								formData.student.coAdvisedStudents.map((coAdvisorStudent, index) => (
									<div key={index} className="h-max flex flex-col justify-center items-center lg:px-20">
										{coAdvisorStudent?.coAdvisor && (
											<div className="flex flex-col items-center space-y-2">
												<SignatureDialog
													userSignUrl={user.role === "ADMIN" && user.position !== "NONE" ? user.signatureUrl : ""}
													disable={
														formData?.coAdvisors && formData?.coAdvisors[index]?.coAdvisor?.signatureUrl
															? true
															: false
													}
													signUrl={
														formData?.coAdvisors
															? formData?.coAdvisors[index]?.coAdvisor?.signatureUrl
															: (form.getValues(`coAdvisors.${index}.coAdvisor.signatureUrl`) as string)
													}
													onConfirm={(signUrl: string) => {
														console.log("Confirming signature for index:", index);
														handleDrawingCoAdvisorSign(signUrl, index);
													}}
													index={index}
													isOpen={openCoAdvisorDialog[index] || false}
													setIsOpen={(isOpen) => toggleCoAdvisorDialog(index, isOpen)}
												/>
												<Label className="mb-2">
													{`${coAdvisorStudent?.coAdvisor?.prefix?.prefixTH || ""} ${
														coAdvisorStudent?.coAdvisor?.firstNameTH || ""
													} ${coAdvisorStudent?.coAdvisor?.lastNameTH || ""}`}
												</Label>
												<Label className="my-2">(อาจารย์ที่ปรึกษาวิทยานิพนธ์ร่วม)</Label>
											</div>
										)}
									</div>
								))}
							<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
							{committeeFields.map((committeeField, index) => (
								<div key={committeeField.id} className="h-max flex flex-col justify-center items-center lg:px-20">
									<SignatureDialog
										userSignUrl={user.role === "ADMIN" && user.position !== "NONE" ? user.signatureUrl : ""}
										disable={!!formData.headOfCommitteeID}
										signUrl={
											formData.headOfCommitteeID && formData?.committees
												? formData?.committees[index]?.committee?.signatureUrl
												: (form.getValues(`committees.${index}.committee.signatureUrl`) as string)
										}
										onConfirm={(signUrl: string) => handleDrawingCommitteeSign(signUrl, index)}
										index={index}
										isOpen={openCommitteeDialog[index] || false}
										setIsOpen={(isOpen) => toggleCommitteeDialog(index, isOpen)}
									/>
									{formData?.committees?.[index] ? (
										<Label className="mb-2">
											{(() => {
												const expertFound = expert.find(
													(exp: IExpert) => exp.id === formData?.committees?.[index]?.committee.committeeID
												);

												return expertFound
													? `${expertFound.prefix || ""} ${expertFound.firstName || ""} ${
															expertFound.lastName || ""
													  }`
													: "";
											})()}
										</Label>
									) : (
										<FormField
											control={form.control}
											name={`committees.${index}.committee.committeeID`}
											render={({ field }) => (
												<>
													<Popover>
														<PopoverTrigger
															asChild
															disabled={user?.role != "SUPER_ADMIN" && user?.role != "ADMIN"}
														>
															<FormControl>
																<Button
																	variant="outline"
																	role="combobox"
																	className={cn(
																		"w-full sm:w-[300px] justify-between",
																		!field.value && "text-muted-foreground"
																	)}
																>
																	{field.value
																		? `${expert?.find((expert) => expert.id === field.value)?.prefix}${
																				expert?.find((expert) => expert.id === field.value)
																					?.firstName
																		  } ${
																				expert?.find((expert) => expert.id === field.value)
																					?.lastName
																		  } `
																		: "เลือกประธานกรรมการ"}
																	<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="w-full p-0">
															<Command>
																<CommandInput placeholder="ค้นหากรรมการ" />
																<CommandList>
																	<CommandEmpty>ไม่พบกรรมการ</CommandEmpty>
																	{expert?.map((expert) => (
																		<CommandItem
																			value={`${expert.prefix}${expert.firstName} ${expert.lastName}`}
																			key={expert.id}
																			onSelect={() => {
																				form.setValue(
																					`committees.${index}.committee.committeeID`,
																					expert.id
																				);
																			}}
																		>
																			<Check
																				className={cn(
																					"mr-2 h-4 w-4",
																					field.value === expert.id ? "opacity-100" : "opacity-0"
																				)}
																			/>
																			{`${expert.prefix}${expert.firstName} ${expert.lastName}`}
																		</CommandItem>
																	))}
																</CommandList>
															</Command>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</>
											)}
										/>
									)}
									<Label className="mt-2">(คณะกรรมการ)</Label>

									{/* Remove Button */}
									{committeeFields.length > 1 && (
										<Button
											type="button"
											variant="destructive"
											onClick={() => committeeRemove(index)}
											className="h-max p-0 my-2"
										>
											<X className="h-5 w-5" />
										</Button>
									)}
								</div>
							))}

							{!formData.headOfCommitteeID && (
								<Button
									type="button"
									onClick={() => committeeAppend({ committee: { committeeID: 0, signatureUrl: "" } })}
									className="h-max p-2 text-xs"
								>
									<Plus className="h-5 w-5" /> เพิ่มลายเซ็นกรรมการ
								</Button>
							)}
							<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
						</>
					)}
				</div>
				<div className="w-full xl:w-1/2 h-full mx-auto bg-white p-4 flex flex-col items-center gap-4">
					<h1 className="text-center font-semibold">
						ผลการพิจารณาของคณะกรรมการประจำสำนักวิชา <br />
						Institute Committee Decision
					</h1>
					<div className="w-max h-max flex flex-col sm:flex-row mt-2 items-center">
						<Label className="mr-2">ครั้งที่ / Meeting no.</Label>
						{formData?.instituteCommitteeID ? (
							<Label>{formData?.times ? formData?.times : "__________"}</Label>
						) : (
							<FormField
								control={form.control}
								name="times"
								render={({ field }) => (
									<div className="w-[75px] flex flex-row items-center justify-center">
										<FormItem>
											<Input disabled={user.role != "SUPER_ADMIN"} {...field} />
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						)}

						<Label className="mx-2">วันที่ / Date</Label>
						{formData?.instituteCommitteeID ? (
							<Label>
								{formData?.dateInstituteCommitteeSign
									? new Date(formData.dateInstituteCommitteeSign).toLocaleDateString("th")
									: "__________"}
							</Label>
						) : (
							<FormField
								control={form.control}
								name="dateInstituteCommitteeSign"
								render={({ field }) => (
									<div className="flex flex-row items-center justify-center">
										<FormItem>
											<DatePicker disabled={user.role != "SUPER_ADMIN"} onDateChange={field.onChange} />
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						)}
					</div>

					<FormField
						control={form.control}
						name="instituteCommitteeStatus"
						render={({ field }) => (
							<div>
								<FormItem className="w-full sm:w-[300px] flex justify-center">
									<RadioGroup
										disabled={user.role != "SUPER_ADMIN"}
										onValueChange={(value) => field.onChange(value)}
										defaultValue={field.value.toString()}
										className="flex flex-col space-y-1"
									>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="เห็นชอบ" />
											</FormControl>
											<FormLabel className="font-normal">เห็นชอบ / Approve</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="ไม่เห็นชอบ" />
											</FormControl>
											<FormLabel className="font-normal">ไม่เห็นชอบ / Disapprove</FormLabel>
										</FormItem>
									</RadioGroup>
									<FormMessage />
								</FormItem>
							</div>
						)}
					/>

					<FormField
						control={form.control}
						name="instituteCommitteeComment"
						render={({ field }) => (
							<FormItem className="w-60">
								<FormControl>
									<Textarea
										disabled={formData?.instituteCommitteeComment || user?.role != "SUPER_ADMIN" ? true : false}
										placeholder="ความเห็น..."
										className="resize-none h-full text-md mb-2"
										value={formData?.instituteCommitteeComment ? formData?.instituteCommitteeComment : field.value}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<SignatureDialog
						disable={user.role != "SUPER_ADMIN"}
						signUrl={formData?.instituteCommitteeSignUrl || form.getValues("instituteCommitteeSignUrl")}
						onConfirm={handleDrawingSignInstitute}
						isOpen={openinstituteComDialog}
						setIsOpen={setOpeninstituteComDialog}
					/>
					{formData?.instituteCommitteeID ? (
						<Label className="mb-2">
							{`${formData?.instituteCommittee?.prefix?.prefixTH}${formData?.instituteCommittee?.firstNameTH} ${formData?.instituteCommittee?.lastNameTH}`}
						</Label>
					) : (
						<FormField
							control={form.control}
							name="instituteCommitteeID"
							render={({ field }) => (
								<>
									<Popover>
										<PopoverTrigger asChild disabled={user?.role != "SUPER_ADMIN"}>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn("w-[300px] justify-between", !field.value && "text-muted-foreground")}
												>
													{field.value
														? `${
																instituteCommittee?.find(
																	(instituteCommittee) => instituteCommittee.id === field.value
																)?.prefix?.prefixTH
														  } ${
																instituteCommittee?.find(
																	(instituteCommittee) => instituteCommittee.id === field.value
																)?.firstNameTH
														  } ${
																instituteCommittee?.find(
																	(instituteCommittee) => instituteCommittee.id === field.value
																)?.lastNameTH
														  } `
														: "เลือกประธานกรรมการ"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-full p-0">
											<Command>
												<CommandInput placeholder="ค้นหากรรมการ" />
												<CommandList>
													<CommandEmpty>ไม่พบกรรมการ</CommandEmpty>
													{instituteCommittee?.map((instituteCommittee) => (
														<CommandItem
															value={`${instituteCommittee?.prefix?.prefixTH}${instituteCommittee.firstNameTH} ${instituteCommittee.lastNameTH}`}
															key={instituteCommittee.id}
															onSelect={() => {
																form.setValue("instituteCommitteeID", instituteCommittee.id);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	field.value === instituteCommittee.id ? "opacity-100" : "opacity-0"
																)}
															/>
															{`${instituteCommittee?.prefix?.prefixTH}${instituteCommittee?.firstNameTH} ${instituteCommittee.lastNameTH}`}
														</CommandItem>
													))}
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</>
							)}
						/>
					)}
					<Label className="my-2">{`(คณบดี)`}</Label>
				</div>

				<div className="w-full flex mt-4 px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.back()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
					>
						ยกเลิก
					</Button>
					<ConfirmDialog
						lebel="ยืนยัน"
						title="ยืนยัน"
						loading={loading}
						onConfirm={form.handleSubmit(onSubmit)}
						onCancel={handleCancel}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
					>
						กรุณาตรวจสอบข้อมูลอย่างละเอียดอีกครั้ง หลังจากการยืนยัน จะไม่สามารถแก้ไขข้อมูลนี้ได้
					</ConfirmDialog>
				</div>
			</form>
		</Form>
	);
};

export default ThesisExamAssessmentFormUpdate;
