"use client";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../../ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/datePicker/datePicker";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { IExpert } from "@/interface/expert";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import InputForm from "@/components/inputForm/inputForm";
import ThesisProcessPlan from "../thesisProcessPlan";
import axios from "axios";
import qs from "query-string";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { updateStdFormState } from "@/app/action/updateStdFormState";
import { ICoAdvisorStudents } from "@/interface/coAdvisorStudents";

const formSchema = z.object({
	id: z.number(),
	formStatus: z.string(),
	editComment: z.string(),
	times: z.string(),
	outlineCommitteeID: z.number(),
	outlineCommitteeStatus: z.string(),
	outlineCommitteeComment: z.string(),
	outlineCommitteeSignUrl: z.string(),
	dateOutlineCommitteeSign: z.date().optional(),
	instituteCommitteeID: z.number(),
	instituteCommitteeStatus: z.string(),
	instituteCommitteeComment: z.string(),
	instituteCommitteeSignUrl: z.string(),
	dateInstituteCommitteeSign: z.date().optional(),
});

const OutlineFormUpdate = ({
	formData,
	user,
	expert,
	instituteCommittee,
}: {
	formData: IOutlineForm;
	user: IUser;
	expert: IExpert[];
	instituteCommittee: IUser[];
}) => {
	const router = useRouter();
	const { toast } = useToast();
	const [openOutline, setOpenOutline] = useState(false);
	const [openInstitute, setOpenInstitute] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const handleDrawingSignOutline = (signUrl: string) => {
		reset({
			...form.getValues(),
			outlineCommitteeSignUrl: signUrl,
		});
		setOpenOutline(false);
	};

	const handleDrawingSignInstitute = (signUrl: string) => {
		reset({
			...form.getValues(),
			instituteCommitteeSignUrl: signUrl,
		});
		setOpenInstitute(false);
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			formStatus: "",
			editComment: "",
			times: "",
			outlineCommitteeID: 0,
			outlineCommitteeStatus: "",
			outlineCommitteeComment: "",
			outlineCommitteeSignUrl: "",
			dateOutlineCommitteeSign: undefined as unknown as Date,

			instituteCommitteeID: 0,
			instituteCommitteeStatus: "",
			instituteCommitteeComment: "",
			instituteCommitteeSignUrl: "",
			dateInstituteCommitteeSign: undefined as unknown as Date,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);

		if (
			(values.outlineCommitteeStatus == "" && values.outlineCommitteeID != 0) ||
			(values.instituteCommitteeStatus == "" && values.instituteCommitteeID != 0)
		) {
			toast({
				title: "Error",
				description: "กรุณาเลือกสถานะ",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}
		if (
			(values.outlineCommitteeStatus != "" && values.outlineCommitteeSignUrl == "" && values.outlineCommitteeID != 0) ||
			(values.instituteCommitteeStatus != "" && values.instituteCommitteeSignUrl == "" && values.instituteCommitteeID != 0)
		) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});

			return;
		}

		if (values.outlineCommitteeStatus == "ไม่อนุมัติ" || values.instituteCommitteeStatus == "ไม่อนุมัติ") {
			values.formStatus = "ไม่อนุมัติ";
		} else if (
			(formData?.outlineCommitteeStatus == "อนุมัติ" || values?.outlineCommitteeStatus == "อนุมัติ") &&
			values.instituteCommitteeStatus == "อนุมัติ" &&
			user?.role == "SUPER_ADMIN"
		) {
			values.formStatus = "อนุมัติ";
			values.editComment = "";
			updateStdFormState(formData.studentID);
		} else if (formData?.outlineCommitteeStatus == "อนุมัติ" && values.editComment != "" && user?.role == "SUPER_ADMIN") {
			values.formStatus = "เเก้ไข";
			values.instituteCommitteeID = 0;
			values.instituteCommitteeStatus = "";
			values.instituteCommitteeComment = "";
			values.instituteCommitteeSignUrl = "";
			values.dateInstituteCommitteeSign = undefined as unknown as Date;
		}

		const url = qs.stringifyUrl({
			url: `/api/05OutlineForm`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			setTimeout(() => {
				handleCancel();
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
	} = form;

	useEffect(() => {
		reset({
			...form.getValues(),
			id: formData.id,
			editComment: formData?.editComment ? formData?.editComment : "",
		});
	}, [formData]);

	useEffect(() => {
		reset({
			...form.getValues(),
			formStatus: "",
			times: "",
			instituteCommitteeID: 0,
			instituteCommitteeStatus: "",
			instituteCommitteeComment: "",
			instituteCommitteeSignUrl: "",
			dateInstituteCommitteeSign: undefined,
		});
	}, [form.watch("editComment")]);

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
				{user?.role == "SUPER_ADMIN" && (
					<div className="flex flex-col justify-center md:flex-row my-4">
						<FormField
							control={form.control}
							name="editComment"
							render={({ field }) => (
								<FormItem className="w-full sm:w-1/2">
									<FormControl>
										<Textarea
											disabled={user?.role != "SUPER_ADMIN" ? true : false}
											placeholder="เเก้ไข..."
											className="resize-none h-full text-md mb-2"
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				)}

				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<h1 className="text-center mb-2 font-bold">ข้อมูลนักศึกษา</h1>
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Full name"
						/>
						<InputForm value={`${formData?.student.username} `} label="รหัสนักศึกษา / StudentID" />

						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel className="font-normal">ระดับการศึกษา / Education Level</FormLabel>
							<RadioGroup disabled className="space-y-1 mt-2">
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

						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full">
						<h1 className="text-center mb-2 font-bold">ชื่อโครงร่างวิทยานิพนธ์</h1>
						<InputForm value={`${formData?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
						<InputForm value={`${formData?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />
						<InputForm
							value={`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>
						{formData.student.coAdvisedStudents &&
							formData.student.coAdvisedStudents.length > 0 &&
							formData.student.coAdvisedStudents.map((coAdvisors: ICoAdvisorStudents, index: number) => (
								<InputForm
									key={index}
									value={`${coAdvisors.coAdvisor?.prefix?.prefixTH}${coAdvisors.coAdvisor?.firstNameTH} ${coAdvisors.coAdvisor?.lastNameTH}`}
									label="อาจารย์ที่ปรึกษาร่วม / CoAdvisor"
								/>
							))}
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<SignatureDialog
								disable={true}
								signUrl={formData?.student.signatureUrl ? formData?.student.signatureUrl : ""}
							/>
							<Label>{`วันที่ ${formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"}`}</Label>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col md:flex-row justify-center mt-4">
					{/* กรรมการโครงร่าง */}
					<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold">ความเห็นของคณะกรรมการพิจารณาโครงร่างวิทยานิพนธ์</h1>
						<div className="w-max h-max flex mt-2 items-center">
							<Label className="mr-2">วันที่</Label>
							{formData?.outlineCommitteeID ? (
								<Label>
									{formData?.dateOutlineCommitteeSign
										? new Date(formData.dateOutlineCommitteeSign).toLocaleDateString("th")
										: "__________"}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="dateOutlineCommitteeSign"
									render={({ field }) => (
										<div className="flex flex-row items-center justify-center">
											<FormItem>
												<DatePicker onDateChange={field.onChange} />
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							)}
						</div>
						{formData?.outlineCommitteeID ? (
							<div className="flex flex-col items-center justify-center">
								<RadioGroup
									disabled={
										formData?.outlineCommitteeStatus || (user?.role != "SUPER_ADMIN" && user?.role != "ADMIN")
											? true
											: false
									}
									className="flex my-6"
								>
									<div className="flex items-center justify-center">
										<RadioGroupItem checked={formData?.outlineCommitteeStatus == "ไม่อนุมัติ"} value="ไม่อนุมัติ" />
										<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">ไม่อนุมัติ</div>
									</div>
									<div className="ml-4 mt-0 flex items-center justify-center">
										<RadioGroupItem checked={formData?.outlineCommitteeStatus == "อนุมัติ"} value="อนุมัติ" />
										<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
											อนุมัติ
										</div>
									</div>
								</RadioGroup>
							</div>
						) : (
							<FormField
								control={form.control}
								name="outlineCommitteeStatus"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<RadioGroup
												disabled={
													formData?.outlineCommitteeStatus ||
													(user?.role != "SUPER_ADMIN" && user?.role != "ADMIN")
														? true
														: false
												}
												onValueChange={field.onChange}
												className="flex my-4"
											>
												<FormItem className="flex items-center justify-center">
													<RadioGroupItem className="mt-2" value="ไม่อนุมัติ" />
													<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
														ไม่อนุมัติ
													</div>
												</FormItem>
												<FormItem className="ml-4 mt-0 flex items-center justify-center">
													<RadioGroupItem className="mt-2" value="อนุมัติ" />
													<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
														อนุมัติ
													</div>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="outlineCommitteeComment"
							render={({ field }) => (
								<FormItem className="w-60">
									<FormControl>
										<Textarea
											disabled={
												formData?.outlineCommitteeComment || (user?.role != "SUPER_ADMIN" && user?.role != "ADMIN")
													? true
													: false
											}
											placeholder="ความเห็น..."
											className="resize-none h-full text-md mb-2"
											value={formData?.outlineCommitteeComment ? formData?.outlineCommitteeComment : field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SignatureDialog
							disable={formData?.outlineCommitteeSignUrl ? true : false}
							signUrl={formData?.outlineCommitteeSignUrl || form.getValues("outlineCommitteeSignUrl")}
							onConfirm={handleDrawingSignOutline}
							isOpen={openOutline}
							setIsOpen={setOpenOutline}
						/>
						{formData?.outlineCommitteeID ? (
							<Label className="mb-2">
								{`${formData?.outlineCommittee?.prefix}${formData?.outlineCommittee?.firstName} ${formData?.outlineCommittee?.lastName}`}
							</Label>
						) : (
							<FormField
								control={form.control}
								name="outlineCommitteeID"
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
																	form.setValue("outlineCommitteeID", expert.id);
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

					{/* กรรมการสำนักวิชา */}
					{(user?.role == "SUPER_ADMIN" || formData?.instituteCommitteeID) && (
						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="mb-2 font-bold">มติคณะกรรมการประจำสำนักวิชาวิศวกรรมศาสตร์</h1>
							<div className="w-max h-max flex flex-col sm:flex-row mt-2 items-center">
								<Label className="mr-2">ครั้งที่</Label>
								{formData?.instituteCommitteeID ? (
									<Label>{formData?.times ? formData?.times : "__________"}</Label>
								) : (
									<FormField
										control={form.control}
										name="times"
										render={({ field }) => (
											<div className="w-[75px] flex flex-row items-center justify-center">
												<FormItem>
													<Input {...field} />
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
								)}

								<Label className="mx-2">วันที่</Label>
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
													<DatePicker onDateChange={field.onChange} />
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
								)}
							</div>

							{formData?.instituteCommitteeID ? (
								<div className="flex flex-col items-center justify-center">
									<RadioGroup
										disabled={formData?.instituteCommitteeStatus || user?.role != "SUPER_ADMIN" ? true : false}
										className="flex my-6"
									>
										<div className="flex items-center justify-center">
											<RadioGroupItem
												checked={formData?.instituteCommitteeStatus == "ไม่อนุมัติ"}
												value="ไม่อนุมัติ"
											/>
											<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
												ไม่อนุมัติ
											</div>
										</div>
										<div className="ml-4 mt-0 flex items-center justify-center">
											<RadioGroupItem checked={formData?.instituteCommitteeStatus == "อนุมัติ"} value="อนุมัติ" />
											<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
												อนุมัติ
											</div>
										</div>
									</RadioGroup>
								</div>
							) : (
								<FormField
									control={form.control}
									name="instituteCommitteeStatus"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioGroup
													disabled={
														formData?.instituteCommitteeStatus || user?.role != "SUPER_ADMIN" ? true : false
													}
													onValueChange={field.onChange}
													className="flex my-4"
												>
													<FormItem className="flex items-center justify-center">
														<RadioGroupItem className="mt-2" value="ไม่อนุมัติ" />
														<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
															ไม่อนุมัติ
														</div>
													</FormItem>
													<FormItem className="ml-4 mt-0 flex items-center justify-center">
														<RadioGroupItem className="mt-2" value="อนุมัติ" />
														<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
															อนุมัติ
														</div>
													</FormItem>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

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
												value={
													formData?.instituteCommitteeComment ? formData?.instituteCommitteeComment : field.value
												}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<SignatureDialog
								disable={false}
								signUrl={formData?.instituteCommitteeSignUrl || form.getValues("instituteCommitteeSignUrl")}
								onConfirm={handleDrawingSignInstitute}
								isOpen={openInstitute}
								setIsOpen={setOpenInstitute}
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
															className={cn(
																"w-[300px] justify-between",
																!field.value && "text-muted-foreground"
															)}
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
																			field.value === instituteCommittee.id
																				? "opacity-100"
																				: "opacity-0"
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
					)}
				</div>

				{(!formData?.outlineCommitteeID && user?.role === "ADMIN") ||
				(!formData?.instituteCommitteeID && user?.position === "HEAD_OF_SCHOOL") ||
				user?.role === "SUPER_ADMIN" ? (
					<div className="w-full flex px-20 mt-4 lg:flex justify-center">
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
				) : null}
			</form>
			<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg mt-4">
				<div className="w-full h-max flex flex-col items-center">
					<h1 className="mb-2 font-bold text-center">บทคัดย่อ / Abstract</h1>
					<Textarea
						className="text-[16px] resize-none 
						w-full md:w-[595px] lg:w-[794px] 
						h-[842px] lg:h-[1123px] 
						p-[16px] 
						md:pt-[108px] lg:pt-[144px] 
						md:pl-[108px] lg:pl-[144px] 
						md:pr-[72px]  lg:pr-[96px] 
						md:pb-[72px]  lg:pb-[96px]"
						defaultValue={formData?.abstract}
						disabled
					/>
				</div>
			</div>
			<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg mt-4">
				<h1 className="mb-2 font-bold text-center">เเผนการดำเนินการจัดทำวิทยานิพนธ์</h1>
				<div className="w-full flex justify-center items-center mb-2 ">
					<Label className="font-bold">เริ่มทำวิทธายานิพนธ์ เดือน</Label>
					<Input disabled className="w-max mx-4" value={`${formData?.thesisStartMonth}`} />
					<Label className="mx-4 font-bold"> ปี พ.ศ.</Label>
					<Input disabled className="w-max" value={`${formData?.thesisStartYear}`} />
				</div>
				<div className="w-full h-max overflow-auto flex justify-center">
					{formData && (
						<ThesisProcessPlan canEdit={false} degree={formData?.student.degree} processPlans={formData?.processPlan} />
					)}
				</div>
			</div>
		</Form>
	);
};

export default OutlineFormUpdate;
