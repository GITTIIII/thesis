import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "@/components/inputForm/inputForm";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "../../ui/label";
import signature from "../../../../public/asset/signature.png";
import ThesisProcessPlan from "../thesisProcessPlan";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SignatureCanvas from "react-signature-canvas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IExpert } from "@/interface/expert";
import { DatePicker } from "@/components/datePicker/datePicker";
import useSWR from "swr";

const formSchema = z.object({
	id: z.number(),
	times: z.string(),
	outlineCommitteeID: z.number(),
	outlineCommitteeStatus: z.string(),
	outlineCommitteeComment: z.string(),
	outlineCommitteeSignUrl: z.string(),
	dateOutlineCommitteeSign: z.string(),
	instituteCommitteeID: z.number(),
	instituteCommitteeStatus: z.string(),
	instituteCommitteeComment: z.string(),
	instituteCommitteeSignUrl: z.string(),
	dateInstituteCommitteeSign: z.string(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OutlineFormUpdate = ({ formId }: { formId: number }) => {
	const { data: formData } = useSWR<IOutlineForm>(`/api/get05FormById/${formId}`, fetcher);
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: expert } = useSWR<IExpert[]>("/api/getExpert", fetcher);
	const { data: instituteCommittee } = useSWR<IUser[]>("/api/getInstituteCommittee", fetcher);
	const router = useRouter();
	const { toast } = useToast();
	const [openOutline, setOpenOutline] = useState(false);
	const [openInstitute, setOpenInstitute] = useState(false);
	const [loading, setLoading] = useState(false);

	const sigCanvas = useRef<SignatureCanvas>(null);
	const clear = () => {
		if (sigCanvas.current) {
			sigCanvas.current.clear();
		}
	};

	const handleDrawingSign = () => {
		if (sigCanvas.current?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
			if (openOutline) {
				reset({
					...form.getValues(),
					outlineCommitteeSignUrl: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
				});
			}
			if (openInstitute) {
				reset({
					...form.getValues(),
					instituteCommitteeSignUrl: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
				});
			}
			setOpenOutline(false);
			setOpenInstitute(false);
		}
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			times: "",
			outlineCommitteeID: 0,
			outlineCommitteeStatus: "",
			outlineCommitteeComment: "",
			outlineCommitteeSignUrl: "",
			dateOutlineCommitteeSign: "",

			instituteCommitteeID: 0,
			instituteCommitteeStatus: "",
			instituteCommitteeComment: "",
			instituteCommitteeSignUrl: "",
			dateInstituteCommitteeSign: "",
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
			(values.outlineCommitteeSignUrl == "" && values.outlineCommitteeID != 0) ||
			(values.instituteCommitteeSignUrl == "" && values.instituteCommitteeID != 0)
		) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});

			return;
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
				form.reset();
				router.refresh();
				router.push("/user/table?formType=outlineForm");
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
			id: formId,
		});
	}, [formId]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/table?formType=outlineForm")}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>

				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<h1 className="text-center mb-2 font-bold">ข้อมูลนักศึกษา</h1>
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Full Name"
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

						<InputForm value={`${formData?.student?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program.programYear}`} label="ปีหลักสูตร / Program Year" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<h1 className="text-center mb-2 font-bold">ชื่อโครงร่างวิทยานิพนธ์</h1>
						<InputForm value={`${formData?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
						<InputForm value={`${formData?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
						<InputForm
							value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>
						<InputForm
							value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษาร่วม / Co-advisor"
						/>
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button variant="outline" type="button" className="w-60 my-4 h-max">
								<Image
									src={formData?.student.signatureUrl ? formData?.student.signatureUrl : signature}
									width={200}
									height={100}
									style={{
										width: "auto",
										height: "auto",
									}}
									alt="signature"
								/>
							</Button>
							<Label>{`วันที่ ${formData?.date ? formData?.date : "__________"}`}</Label>
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
								<Label>{formData?.dateOutlineCommitteeSign ? formData.dateOutlineCommitteeSign : "__________"}</Label>
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
										formData?.outlineCommitteeStatus ||
										(user?.role.toString() != "SUPER_ADMIN" && user?.role.toString() != "ADMIN")
											? true
											: false
									}
									className="flex my-6"
								>
									<div className="flex items-center justify-center">
										<RadioGroupItem checked={formData?.outlineCommitteeStatus == "NOT_APPROVED"} value="NOT_APPROVED" />
										<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">ไม่อนุมัติ</div>
									</div>
									<div className="ml-4 mt-0 flex items-center justify-center">
										<RadioGroupItem checked={formData?.outlineCommitteeStatus == "APPROVED"} value="APPROVED" />
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
													(user?.role.toString() != "SUPER_ADMIN" && user?.role.toString() != "ADMIN")
														? true
														: false
												}
												onValueChange={field.onChange}
												className="flex my-4"
											>
												<FormItem className="flex items-center justify-center">
													<RadioGroupItem className="mt-2" value="NOT_APPROVED" />
													<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
														ไม่อนุมัติ
													</div>
												</FormItem>
												<FormItem className="ml-4 mt-0 flex items-center justify-center">
													<RadioGroupItem className="mt-2" value="APPROVED" />
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
								<FormItem className="w-1/2">
									<FormControl>
										<Textarea
											disabled={
												formData?.outlineCommitteeComment ||
												(user?.role.toString() != "SUPER_ADMIN" && user?.role.toString() != "ADMIN")
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
						<Dialog open={openOutline} onOpenChange={setOpenOutline}>
							<DialogTrigger
								onClick={() => setOpenOutline(!openOutline)}
								disabled={
									formData?.outlineCommitteeSignUrl ||
									(user?.role.toString() != "SUPER_ADMIN" && user?.role.toString() != "ADMIN")
										? true
										: false
								}
							>
								<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
									<Image
										src={
											formData?.outlineCommitteeSignUrl
												? formData?.outlineCommitteeSignUrl
												: form.getValues().outlineCommitteeSignUrl
												? form.getValues().outlineCommitteeSignUrl
												: signature
										}
										width={100}
										height={100}
										style={{
											width: "auto",
											height: "auto",
										}}
										alt="signature"
									/>
								</div>
							</DialogTrigger>
							<DialogContent className="w-max">
								<DialogHeader>
									<DialogTitle>ลายเซ็น</DialogTitle>
								</DialogHeader>
								<div className="w-full h-max flex justify-center mb-6 border-2">
									<SignatureCanvas
										ref={sigCanvas}
										backgroundColor="white"
										throttle={8}
										canvasProps={{
											width: 400,
											height: 400,
											className: "sigCanvas",
										}}
									/>
								</div>
								<div className="w-full h-full flex justify-center">
									<Button
										variant="outline"
										type="button"
										onClick={() => clear()}
										className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
									>
										ล้าง
									</Button>
									<Button
										variant="outline"
										type="button"
										onClick={() => handleDrawingSign()}
										className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
									>
										ยืนยัน
									</Button>
								</div>
							</DialogContent>
						</Dialog>
						{formData?.outlineCommitteeID ? (
							<Label className="mb-2">
								{`${formData?.outlineCommittee.prefix}${formData?.outlineCommittee.firstName} ${formData?.outlineCommittee.lastName}`}
							</Label>
						) : (
							<FormField
								control={form.control}
								name="outlineCommitteeID"
								render={({ field }) => (
									<>
										<Popover>
											<PopoverTrigger
												asChild
												disabled={user?.role.toString() != "SUPER_ADMIN" && user?.role.toString() != "ADMIN"}
											>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn("w-[300px] justify-between", !field.value && "text-muted-foreground")}
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
					{(user?.role.toString() == "SUPER_ADMIN" || formData?.instituteCommitteeID) && (
						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="mb-2 font-bold">มติคณะกรรมการประจำสำนักวิชาวิศวกรรมศาสตร์</h1>
							<div className="w-max h-max flex mt-2 items-center">
								<Label className="mr-2">ครั้งที่</Label>
								{formData?.instituteCommitteeID ? (
									<Label>{formData?.times ? formData?.times : "__________"}</Label>
								) : (
									<FormField
										control={form.control}
										name="times"
										render={({ field }) => (
											<div className="w-[100px] flex flex-row items-center justify-center">
												<FormItem>
													<Input {...field} />
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
								)}
							</div>
							<div className="w-max h-max flex mt-2 items-center">
								<Label className="mr-2">วันที่</Label>
								{formData?.instituteCommitteeID ? (
									<Label>
										{formData?.dateInstituteCommitteeSign ? formData.dateInstituteCommitteeSign : "__________"}
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
										disabled={
											formData?.instituteCommitteeStatus || user?.role.toString() != "SUPER_ADMIN" ? true : false
										}
										className="flex my-6"
									>
										<div className="flex items-center justify-center">
											<RadioGroupItem
												checked={formData?.instituteCommitteeStatus == "NOT_APPROVED"}
												value="NOT_APPROVED"
											/>
											<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
												ไม่อนุมัติ
											</div>
										</div>
										<div className="ml-4 mt-0 flex items-center justify-center">
											<RadioGroupItem checked={formData?.instituteCommitteeStatus == "APPROVED"} value="APPROVED" />
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
														formData?.instituteCommitteeStatus || user?.role.toString() != "SUPER_ADMIN"
															? true
															: false
													}
													onValueChange={field.onChange}
													className="flex my-4"
												>
													<FormItem className="flex items-center justify-center">
														<RadioGroupItem className="mt-2" value="NOT_APPROVED" />
														<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
															ไม่อนุมัติ
														</div>
													</FormItem>
													<FormItem className="ml-4 mt-0 flex items-center justify-center">
														<RadioGroupItem className="mt-2" value="APPROVED" />
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
									<FormItem className="w-1/2">
										<FormControl>
											<Textarea
												disabled={
													formData?.instituteCommitteeComment || user?.role.toString() != "SUPER_ADMIN"
														? true
														: false
												}
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
							<Dialog open={openInstitute} onOpenChange={setOpenInstitute}>
								<DialogTrigger
									onClick={() => setOpenInstitute(!openInstitute)}
									disabled={formData?.instituteCommitteeSignUrl || user?.role.toString() != "SUPER_ADMIN" ? true : false}
								>
									<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										<Image
											src={
												formData?.instituteCommitteeSignUrl
													? formData?.instituteCommitteeSignUrl
													: form.getValues().instituteCommitteeSignUrl
													? form.getValues().instituteCommitteeSignUrl
													: signature
											}
											width={100}
											height={100}
											style={{
												width: "auto",
												height: "auto",
											}}
											alt="signature"
										/>
									</div>
								</DialogTrigger>
								<DialogContent className="w-max">
									<DialogHeader>
										<DialogTitle>ลายเซ็น</DialogTitle>
									</DialogHeader>
									<div className="w-full h-max flex justify-center mb-6 border-2">
										<SignatureCanvas
											ref={sigCanvas}
											backgroundColor="white"
											throttle={8}
											canvasProps={{
												width: 400,
												height: 400,
												className: "sigCanvas",
											}}
										/>
									</div>
									<div className="w-full h-full flex justify-center">
										<Button
											variant="outline"
											type="button"
											onClick={() => clear()}
											className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ล้าง
										</Button>
										<Button
											variant="outline"
											type="button"
											onClick={() => handleDrawingSign()}
											className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ยืนยัน
										</Button>
									</div>
								</DialogContent>
							</Dialog>
							{formData?.instituteCommitteeID ? (
								<Label className="mb-2">
									{`${formData?.instituteCommittee.prefix.prefixTH}${formData?.instituteCommittee.firstNameTH} ${formData?.instituteCommittee.lastNameTH}`}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="instituteCommitteeID"
									render={({ field }) => (
										<>
											<Popover>
												<PopoverTrigger asChild disabled={user?.role.toString() != "SUPER_ADMIN"}>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-[180px] justify-between",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value
																? `${
																		instituteCommittee?.find(
																			(instituteCommittee) => instituteCommittee.id === field.value
																		)?.prefix.prefixTH
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
																	value={`${instituteCommittee.prefix.prefixTH}${instituteCommittee.firstNameTH} ${instituteCommittee.lastNameTH}`}
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
																	{`${instituteCommittee.prefix.prefixTH}${instituteCommittee.firstNameTH} ${instituteCommittee.lastNameTH}`}
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
					)}
				</div>

				{(!formData?.outlineCommitteeID && user?.role.toString() === "ADMIN") ||
				(!formData?.instituteCommitteeID && user?.position.toString() === "HEAD_OF_SCHOOL") ||
				user?.role.toString() === "SUPER_ADMIN" ? (
					<div className="w-full flex px-20 mt-4 lg:flex justify-center">
						<Button
							variant="outline"
							type="reset"
							onClick={() => router.push(`/user/table?formType=outlineForm`)}
							className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
						>
							ยกเลิก
						</Button>
						<Button
							disabled={loading}
							variant="outline"
							type="submit"
							className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
						>
							ยืนยัน
						</Button>
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
