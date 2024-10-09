"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { IOutlineForm, IThesisExamAppointmentForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DatePicker } from "@/components/datePicker/datePicker";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { Checkbox } from "@/components/ui/checkbox";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "@/components/inputForm/inputForm";
import UserCertificate from "@/components/profile/userCertificate";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { updateStdFormState } from "@/app/action/updateStdFormState";

const formSchema = z.object({
	id: z.number(),
	has01Certificate: z.boolean().default(false).optional(),
	has02Certificate: z.boolean().default(false).optional(),
	has03Certificate: z.boolean().default(false).optional(),
	hasOtherCertificate: z.boolean().default(false).optional(),

	presentationFund: z.boolean().default(false).optional(),
	presentationFundSignUrl: z.string(),
	researchProjectFund: z.boolean().default(false).optional(),
	researchProjectFundSignUrl: z.string(),
	turnitinVerified: z.boolean().default(false).optional(),
	turnitinVerifiedSignUrl: z.string(),

	advisorSignUrl: z.string(),
	dateAdvisor: z.date().optional(),

	headSchoolComment: z.string(),
	headSchoolSignUrl: z.string(),
	dateHeadSchool: z.date().optional(),
	headSchoolID: z.number(),
});

const ThesisProgressFormUpdate = ({
	formData,
	user,
	approvedForm,
	headSchool,
}: {
	formData: IThesisExamAppointmentForm;
	user: IUser;
	approvedForm: IOutlineForm;
	headSchool: IUser[];
}) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [openSign1, setOpenSign1] = useState(false);
	const [openSign2, setOpenSign2] = useState(false);
	const [openAdvisor, setOpenAdvisor] = useState(false);
	const [openHeadSchool, setOpenHeadSchool] = useState(false);
	const { toast } = useToast();

	const handleDrawingSign1 = (signUrl: string) => {
		reset({
			...form.getValues(),
			presentationFundSignUrl: signUrl,
		});
		setOpenSign1(false);
	};

	const handleDrawingSign2 = (signUrl: string) => {
		reset({
			...form.getValues(),
			researchProjectFundSignUrl: signUrl,
		});
		setOpenSign2(false);
	};

	const handleDrawingSignAdvisor = (signUrl: string) => {
		reset({
			...form.getValues(),
			advisorSignUrl: signUrl,
		});
		setOpenAdvisor(false);
	};

	const handleDrawingSignHeadSchool = (signUrl: string) => {
		reset({
			...form.getValues(),
			headSchoolSignUrl: signUrl,
		});
		setOpenHeadSchool(false);
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			has01Certificate: false,
			has02Certificate: false,
			has03Certificate: false,
			hasOtherCertificate: false,

			presentationFund: false,
			presentationFundSignUrl: "",
			researchProjectFund: false,
			researchProjectFundSignUrl: "",
			turnitinVerified: false,
			turnitinVerifiedSignUrl: "",

			advisorSignUrl: "",
			dateAdvisor: undefined as unknown as Date,

			headSchoolComment: "",
			headSchoolSignUrl: "",
			dateHeadSchool: undefined as unknown as Date,
			headSchoolID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		setLoading(true);
		if (
			(values.advisorSignUrl == "" && values.dateAdvisor != undefined) ||
			(values.headSchoolSignUrl == "" && values.headSchoolID != 0)
		) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/07ThesisExamAppointmentForm`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			if (values.headSchoolID) {
				await updateStdFormState(formData.studentID);
			}
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

	const { reset } = form;

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
				<div className="flex flex-col justify-center md:flex-row mb-4">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
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
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.gpa}`} label="คะเเนนสะสมเฉลี่ย / GPA" />
						<InputForm value={`${formData?.credits}`} label="หน่วยกิต / Credits" />

						<InputForm value={`${formData?.student?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Full name"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />

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
								value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
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

							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />
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
									alt="signature"
									className={formData?.student.signatureUrl ? "w-[300px] h-auto" : ""}
								/>
							</Button>
							<Label className="mt-4">{`วันที่ ${
								formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>

					<hr className="่่justify-center mx-auto w-full sm:w-max my-5 border-t-2 border-[#eeee]" />
				</div>
				<div className="w-full xl:w-1/2 h-full mx-auto bg-white p-4 flex flex-col gap-4">
					<h1 className="text-center font-semibold">นักศึกษาได้รับทุนการศึกษา ดังนี้ (เกณฑ์ขั้นต่ำพร้อมแนบเอกสารประกอบ)</h1>
					<div>
						<FormField
							control={form.control}
							name="has01Certificate"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.has01Certificate}
											checked={formData?.has01Certificate || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>{`ทุน OROG ${
										user?.degree == "Master"
											? `(ป.โท วารสารระดับชาติ หรือ ประชุมวิชาการระดับนานาชาติ)`
											: `(ป.เอก วารสารระดับนานาชาติ)`
									}`}</FormLabel>
								</FormItem>
							)}
						/>
						<UserCertificate canUpload={false} user={formData?.student} certificateType="1" />
					</div>
					<div>
						<FormField
							control={form.control}
							name="has02Certificate"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.has02Certificate}
											checked={formData?.has02Certificate || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>{`ทุนกิตติบัณฑิต / ทุนวิเทศบัณฑิต ${
										user?.degree == "Master"
											? `(ป.โท ประชุมวิชาการระดับชาติ / นานาชาติ เเละ วารสารระดับชาติ / นานาชาติ)`
											: `(ป.เอก นำเสนอผลงานระดับชาติ / นานาชาติ เเละ วารสารระดับนานาชาติ)`
									}`}</FormLabel>
								</FormItem>
							)}
						/>
						<UserCertificate canUpload={false} user={formData?.student} certificateType="2" />
					</div>
					<div>
						<FormField
							control={form.control}
							name="has03Certificate"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.has03Certificate}
											checked={formData?.has03Certificate || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>{`ทุนศักยภาพ / ทุนเรียนดี / ทุนส่วนตัว ${
										user?.degree == "Master" ? `(ป.โท ประชุมวิชาการระดับชาติ)` : `(ป.เอก วารสารระดับชาติ)`
									}`}</FormLabel>
								</FormItem>
							)}
						/>
						<UserCertificate canUpload={false} user={formData?.student} certificateType="3" />
					</div>
					<div>
						<FormField
							control={form.control}
							name="hasOtherCertificate"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.hasOtherCertificate}
											checked={formData?.hasOtherCertificate || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>{`ทุนอื่น ๆ`}</FormLabel>
								</FormItem>
							)}
						/>
						<UserCertificate canUpload={false} user={formData?.student} certificateType="4" />
					</div>
					<div className="flex flex-col justify-center items-center">
						<FormField
							control={form.control}
							name="presentationFund"
							render={({ field }) => (
								<FormItem className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.presentationFund}
											checked={formData?.presentationFund || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>ไม่ติดค้างการรายงานทุนนำเสนอผลงาน</FormLabel>
								</FormItem>
							)}
						/>
						<SignatureDialog
							userSignUrl={user.role == "ADMIN" && user.position !== "NONE" ? user.signatureUrl : ""}
							disable={false}
							signUrl={formData?.presentationFundSignUrl || form.getValues("presentationFundSignUrl")}
							onConfirm={handleDrawingSign1}
							isOpen={openSign1}
							setIsOpen={setOpenSign1}
						/>
						<Label>{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
						<div className="w-max h-max flex mt-2 mb-4 items-center">
							<Label className="mr-2">วันที่</Label>
							{formData?.dateAdvisor ? (
								<Label>
									{formData?.dateAdvisor ? new Date(formData?.dateAdvisor).toLocaleDateString("th") : "__________"}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="dateAdvisor"
									render={({ field }) => (
										<div className="flex flex-row items-center justify-center">
											<FormItem>
												<DatePicker value={field.value} onDateChange={field.onChange} />
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							)}
						</div>
						<FormField
							control={form.control}
							name="researchProjectFund"
							render={({ field }) => (
								<FormItem className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.researchProjectFund}
											checked={formData?.researchProjectFund || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>ไม่ติดค้างการรายงานทุนอุดหนุนโครงการวิจัยเพื่อทำวิทยานิพนธ์ระดับบัณฑิตศึกษา</FormLabel>
								</FormItem>
							)}
						/>
						<SignatureDialog
							userSignUrl={user.role == "ADMIN" && user.position !== "NONE" ? user.signatureUrl : ""}
							disable={false}
							signUrl={formData?.researchProjectFundSignUrl || form.getValues("researchProjectFundSignUrl")}
							onConfirm={handleDrawingSign2}
							isOpen={openSign2}
							setIsOpen={setOpenSign2}
						/>
						<Label>{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
						<div className="w-max h-max flex mt-2 items-center">
							<Label className="mr-2">วันที่</Label>
							{formData?.dateAdvisor ? (
								<Label>
									{formData?.dateAdvisor ? new Date(formData?.dateAdvisor).toLocaleDateString("th") : "__________"}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="dateAdvisor"
									render={({ field }) => (
										<div className="flex flex-row items-center justify-center">
											<FormItem>
												<DatePicker value={field.value} onDateChange={field.onChange} />
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
							)}
						</div>
					</div>
					<div>
						<FormField
							control={form.control}
							name="turnitinVerified"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox
											disabled={formData?.turnitinVerified}
											checked={formData?.turnitinVerified || field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>
										ผ่านการตรวจสอบการคัดลอกวิทยานิพนธ์จากระบบ Turnitin <span className="underline">พร้อมแนบเอกสาร</span>
									</FormLabel>
								</FormItem>
							)}
						/>
						<UserCertificate canUpload={false} user={formData?.student} certificateType="5" />
					</div>
					<div className="w-full flex flex-col md:flex-row justify-center mt-4">
						{/* อาจารย์ที่ปรึกษา */}
						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="mb-2 font-bold text-center">ความเห็นของอาจารย์ที่ปรึกษา</h1>
							<FormField
								control={form.control}
								name="turnitinVerified"
								render={({ field }) => (
									<FormItem className="w-max flex flex-row items-center space-x-3 space-y-0 mb-2 rounded-md border p-4 shadow">
										<FormControl>
											<Checkbox
												disabled={formData?.turnitinVerified}
												checked={formData?.turnitinVerified || field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>ผ่านการตรวจสอบจากระบบ Turnitin</FormLabel>
									</FormItem>
								)}
							/>
							<SignatureDialog
								userSignUrl={user.role == "ADMIN" && user.position !== "NONE" ? user.signatureUrl : ""}
								disable={formData?.advisorSignUrl ? true : false}
								signUrl={formData?.advisorSignUrl || form.getValues("advisorSignUrl")}
								onConfirm={handleDrawingSignAdvisor}
								isOpen={openAdvisor}
								setIsOpen={setOpenAdvisor}
							/>
							<Label>{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>

							<div className="w-max h-max flex mt-2 items-center">
								<Label className="mr-2">วันที่</Label>
								{formData?.dateAdvisor ? (
									<Label>
										{formData?.dateAdvisor ? new Date(formData?.dateAdvisor).toLocaleDateString("th") : "__________"}
									</Label>
								) : (
									<FormField
										control={form.control}
										name="dateAdvisor"
										render={({ field }) => (
											<div className="flex flex-row items-center justify-center">
												<FormItem>
													<DatePicker value={field.value} onDateChange={field.onChange} />
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
								)}
							</div>
						</div>

						{/* หัวหน้าสาขา */}
						{(user?.position === "HEAD_OF_SCHOOL" || user?.role === "SUPER_ADMIN") && (
							<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
								<h1 className="mb-2 font-bold text-center">ความเห็นของหัวหน้าสาขาวิชา</h1>
								<FormField
									control={form.control}
									name="headSchoolComment"
									render={({ field }) => (
										<FormItem className="w-full h-max">
											<FormControl>
												<Input
													className="text-sm p-4 w-full h-[50px] m-auto shadow rounded-lg mb-2"
													placeholder="ความเห็น..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<SignatureDialog
									userSignUrl={user.position == "HEAD_OF_SCHOOL" ? user.signatureUrl : ""}
									disable={formData?.headSchoolSignUrl ? true : false}
									signUrl={formData?.headSchoolSignUrl || form.getValues("headSchoolSignUrl")}
									onConfirm={handleDrawingSignHeadSchool}
									isOpen={openHeadSchool}
									setIsOpen={setOpenHeadSchool}
								/>
								{formData?.headSchoolID ? (
									<Label>{`${formData?.headSchool?.prefix?.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`}</Label>
								) : (
									<FormField
										control={form.control}
										name="headSchoolID"
										render={({ field }) => (
											<>
												<Popover>
													<PopoverTrigger
														asChild
														disabled={user?.position != "HEAD_OF_SCHOOL" && user?.role != "SUPER_ADMIN"}
													>
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
																			headSchool?.find((headSchool) => headSchool.id === field.value)
																				?.prefix?.prefixTH
																	  }${
																			headSchool?.find((headSchool) => headSchool.id === field.value)
																				?.firstNameTH
																	  } ${
																			headSchool?.find((headSchool) => headSchool.id === field.value)
																				?.lastNameTH
																	  } `
																	: "ค้นหาหัวหน้าสาขา"}
																<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-full p-0">
														<Command>
															<CommandInput placeholder="ค้นหาหัวหน้าสาขา" />
															<CommandList>
																<CommandEmpty>ไม่พบหัวหน้าสาขา</CommandEmpty>
																{headSchool?.map((headSchool) => (
																	<CommandItem
																		value={`${headSchool.prefix?.prefixTH}${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
																		key={headSchool.id}
																		onSelect={() => {
																			form.setValue("headSchoolID", headSchool.id);
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value === headSchool.id ? "opacity-100" : "opacity-0"
																			)}
																		/>
																		{`${headSchool.prefix?.prefixTH}${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
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
								<div className="w-max h-max flex mt-2 items-center">
									<Label className="mr-2">วันที่</Label>
									{formData?.dateHeadSchool ? (
										<Label>
											{formData?.dateHeadSchool
												? new Date(formData?.dateHeadSchool).toLocaleDateString("th")
												: "__________"}
										</Label>
									) : (
										<FormField
											control={form.control}
											name="dateHeadSchool"
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
							</div>
						)}
					</div>
				</div>
				{(formData?.student.advisorID == user?.id && user?.position === "ADVISOR") ||
				(!formData?.headSchoolID && user?.position === "HEAD_OF_SCHOOL") ||
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
		</Form>
	);
};

export default ThesisProgressFormUpdate;
