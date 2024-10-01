"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { IOutlineForm, IProcessPlan, IThesisProgressForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DatePicker } from "@/components/datePicker/datePicker";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import ThesisProcessPlan from "../thesisProcessPlan";
import axios from "axios";
import qs from "query-string";
import InputForm from "@/components/inputForm/inputForm";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { updateStdFormState } from "@/app/action/updateStdFormState";

const formSchema = z.object({
	id: z.number(),
	percentage: z.number(),
	processPlan: z.array(z.any()),
	assessmentResult: z.string(),
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
	last06Form,
}: {
	formData: IThesisProgressForm;
	user: IUser;
	approvedForm: IOutlineForm;
	headSchool: IUser[];
	last06Form?: IThesisProgressForm;
}) => {
	const router = useRouter();
	const [processPlans, setProcessPlans] = useState<IProcessPlan[]>();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [openAdvisor, setOpenAdvisor] = useState(false);
	const [openHeadSchool, setOpenHeadSchool] = useState(false);
	const { toast } = useToast();

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
			percentage: 0,
			processPlan: [],
			assessmentResult: "",
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
		if (processPlans) {
			values.processPlan = processPlans;
		}
		const url = qs.stringifyUrl({
			url: `/api/06ThesisProgressForm`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			if (values.headSchoolID && !last06Form) {
				updateStdFormState(formData.studentID);
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
			percentage: formData?.percentage ? formData?.percentage : 0,
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
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<InputForm value={`${formData?.times} `} label="ครั้งที่ / No." />

						<InputForm value={`${formData?.trimester} `} label="ภาคเรียน / Trimester" />

						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />

						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel className="font-normal">ระดับการศึกษา / Education Level</FormLabel>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem checked={formData?.student?.degree === "Master"} value="Master" />
									<FormLabel className="ml-2 font-normal">ปริญญาโท (Master Degree)</FormLabel>
								</div>
								<div>
									<RadioGroupItem checked={formData?.student?.degree === "Doctoral"} value="Doctoral" />
									<FormLabel className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</FormLabel>
								</div>
							</RadioGroup>
						</div>

						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</div>
							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
						</div>
					</div>
					<div className="border-l border-[#eeee]"></div>
					{/* ฝั่งขวา */}
					<div className="w-full">
						<InputForm
							value={`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student.advisor?.firstNameTH} ${formData?.student.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>

						<div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
							ขอรายงานความคืบหน้าวิทยานิพนธ์ดังนี้
						</div>
						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="font-normal text-center mb-5">1. ระดับการดำเนินงาน</div>

							<RadioGroup className="space-y-1 mt-2" disabled>
								<div>
									<RadioGroupItem value="AsPlaned" checked={formData?.status == "เป็นไปตามแผนที่วางไว้ทุกประการ"} />
									<Label className="ml-2 font-normal">เป็นไปตามแผนที่วางไว้ทุกประการ</Label>
								</div>
								<div>
									<RadioGroupItem value="Adjustments" checked={formData?.status == "มีการเปลี่ยนแผนที่วางไว้"} />
									<Label className="ml-2 font-normal mb-6">มีการเปลี่ยนแผนที่วางไว้</Label>
								</div>
							</RadioGroup>
							<Textarea
								className="mt-2"
								placeholder="มีการเปลี่ยนแปลงดังนี้..."
								disabled
								defaultValue={formData?.statusComment}
							/>
						</div>
						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="w-full text-center font-normal mb-6">2. ผลการดำเนินงานที่ผ่านมาในครั้งนี้</div>

							<FormField
								control={form.control}
								name="percentage"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-auto">
											<FormLabel>คิดเป็นร้อยละการทำงานของเป้าหมาย</FormLabel>
											<Input
												disabled={user?.position != "ADVISOR"}
												value={field.value ? field.value : ""}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>

							<div className="flex flex-col items-center mb-6 justify-center">
								<FormLabel className="mb-2">โดยสรุปผลได้ดังนี้</FormLabel>
								<Textarea
									className="text-sm p-2 w-[300px] m-auto  rounded-lg"
									placeholder="Type your message here."
									disabled
									defaultValue={formData?.percentageComment}
								/>
							</div>
						</div>
						<div className="mt-6 w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="w-full text-center font-normal mb-6">3. ปัญหา อุปสรรค และแนวทางแก้ไข</div>

							<div className="flex flex-row items-center mb-6 justify-center">
								<Textarea
									className="text-sm p-2 w-[300px] m-auto  rounded-lg"
									placeholder="Type your message here."
									defaultValue={formData?.issues}
									disabled
								/>
							</div>
						</div>
						<div className="flex flex-col items-center mt-6 mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<SignatureDialog
								disable={false}
								signUrl={formData?.student.signatureUrl ? formData?.student.signatureUrl : ""}
							/>
							<Label className="mt-4">{`วันที่ ${
								formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>
				</div>
				<hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />

				{/* อาจารย์ที่ปรึกษา */}
				<div className="w-full flex flex-col sm:flex-row">
					<div className="w-full h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold text-center">ผลการประเมินความคืบหน้าของการทำวิทยานิพนธ์โดยอาจารย์ที่ปรึกษา</h1>
						<FormField
							control={form.control}
							name="assessmentResult"
							render={({ field }) => (
								<FormItem className="w-3/4 h-[100px]">
									<FormControl>
										<Textarea
											disabled={
												formData?.assessmentResult
													? true
													: false ||
													  (user?.position != "ADVISOR" &&
															user?.position != "HEAD_OF_SCHOOL" &&
															user?.role != "SUPER_ADMIN")
											}
											placeholder="ความเห็น..."
											className="resize-none h-full text-md mb-2"
											value={formData?.assessmentResult ? formData?.assessmentResult : field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SignatureDialog
							disable={formData?.advisorSignUrl ? true : false}
							signUrl={formData?.advisorSignUrl || form.getValues("advisorSignUrl")}
							onConfirm={handleDrawingSignAdvisor}
							isOpen={openAdvisor}
							setIsOpen={setOpenAdvisor}
						/>
						<Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>

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
												<DatePicker onDateChange={field.onChange} />
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
						<div className="w-full h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="mb-2 font-bold text-center">ความเห็นของหัวหน้าสาขาวิชา</h1>
							<FormField
								control={form.control}
								name="headSchoolComment"
								render={({ field }) => (
									<FormItem className="w-3/4 h-[100px]">
										<FormControl>
											<Textarea
												disabled={
													formData?.headSchoolComment
														? true
														: false || (user?.position != "HEAD_OF_SCHOOL" && user?.role != "SUPER_ADMIN")
												}
												placeholder="ความเห็น..."
												className="resize-none h-full text-md mb-2"
												value={formData?.headSchoolComment ? formData?.headSchoolComment : field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<SignatureDialog
								disable={formData?.headSchoolSignUrl ? true : false}
								signUrl={formData?.headSchoolSignUrl || form.getValues("headSchoolSignUrl")}
								onConfirm={handleDrawingSignHeadSchool}
								isOpen={openHeadSchool}
								setIsOpen={setOpenHeadSchool}
							/>
							{formData?.headSchoolID ? (
								<Label className="mb-2">{`${formData?.headSchool?.prefix?.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`}</Label>
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
				<hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />
				<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
					<h1 className="mb-2 font-bold text-center">เเผนการดำเนินการจัดทำวิทยานิพนธ์</h1>
					<div className="w-full flex flex-col sm:flex-row justify-center items-center mb-2 ">
						<Label className="font-bold">เริ่มทำวิทธายานิพนธ์ เดือน</Label>
						<Input disabled className="w-max mx-4 my-2 sm:my-0" value={`${approvedForm?.thesisStartMonth}`} />
						<Label className="mx-4 font-bold"> ปี พ.ศ.</Label>
						<Input disabled className="w-max my-2 sm:my-0" value={`${approvedForm?.thesisStartYear}`} />
					</div>
					<div className="w-full h-max overflow-auto flex justify-center">
						{formData && (
							<ThesisProcessPlan
								degree={user!.degree}
								canEdit={user?.position === "ADVISOR"}
								processPlans={formData?.processPlan}
								setProcessPlans={setProcessPlans}
							/>
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
