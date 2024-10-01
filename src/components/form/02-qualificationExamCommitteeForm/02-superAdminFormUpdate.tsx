"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IUser } from "@/interface/user";
import { IQualificationExamCommitteeForm } from "@/interface/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { DatePicker } from "@/components/datePicker/datePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import signature from "../../../../public/asset/signature.png";

const formSchema = z.object({
	id: z.number(),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester requierd" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z.string().min(1, { message: "กรุณากรอกปีการศึกษา (พ.ศ.) / Academic year (B.E.) requierd" }),
	committeeName1: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName2: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName3: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName4: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName5: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	numberStudent: z.number().min(1, { message: "กรุณาระบุจำนวนนักศึกษา / Number of student requierd" }),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times requierd" }),
	examDay: z.date({
		required_error: "กรุณาเลือกวันที่สอบ / Exam date requierd",
	}),
	headSchoolID: z.number(),
	headSchoolSignUrl: z.string(),

	studentID: z.number(),
});

export default function SuperAdminForm02Update({
	formData,
	user,
	headSchool,
}: {
	formData: IQualificationExamCommitteeForm;
	user: IUser;
	headSchool: IUser[];
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [schoolName, setSchoolName] = useState("");
	const router = useRouter();
	const signCanvas = useRef<SignatureCanvas>(null);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			trimester: 0,
			academicYear: "",
			committeeName1: "",
			committeeName2: "",
			committeeName3: "",
			committeeName4: "",
			committeeName5: "",
			numberStudent: 0,
			times: 0,
			examDay: new Date(),
			headSchoolID: 0,
			headSchoolSignUrl: "",

			studentID: 0,
		},
	});

	const clearCanvas = () => {
		if (signCanvas.current) {
			signCanvas.current.clear();
		}
	};

	const handleDrawingSign = () => {
		if (signCanvas.current?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (signCanvas.current && !signCanvas.current.isEmpty()) {
			if (open) {
				reset({
					...form.getValues(),
					headSchoolSignUrl: signCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
				});
			}
			setOpen(false);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		if (values.headSchoolSignUrl == "" && values.headSchoolID != 0) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		const url = qs.stringifyUrl({
			url: `/api/02QualificationExamCommitteeForm`,
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
				router.push("/user/superAdmin/form");
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
		reset(
			formData && {
				...form.getValues(),
				trimester: formData.trimester || 0,
				academicYear: formData.academicYear || "",
				committeeName1: formData.committeeName1 || "",
				committeeName2: formData.committeeName2 || "",
				committeeName3: formData.committeeName3 || "",
				committeeName4: formData.committeeName4 || "",
				committeeName5: formData.committeeName5 || "",
				numberStudent: formData.numberStudent || 0,
				times: formData.times || 0,
				examDay: new Date(formData.examDay) || new Date(),
				headSchoolID: formData.headSchoolID || 0,
				headSchoolSignUrl: formData.headSchoolSignUrl || "",

				studentID: formData.studentID || 0,
			}
		);
		if (user && user.role === "SUPER_ADMIN") {
			reset({
				...form.getValues(),
				id: formData.id,
				numberStudent: 1,
				headSchoolID: formData?.headSchoolID,
				studentID: formData?.studentID,
			});
		}
	}, [form, formData, reset, user]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/superAdmin/form")}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full ">
						<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
						<FormField
							control={form.control}
							name="times"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											สอบครั้งที่ / Exam. No. <span className="text-red-500">*</span>
										</FormLabel>
										<Input
											value={field.value ? field.value : ""}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="trimester"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											ภาคเรียน / Trimester <span className="text-red-500">*</span>
										</FormLabel>
										<Input
											value={field.value ? field.value : ""}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="academicYear"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											ปีการศึกษา (พ.ศ.) / Academic year (B.E.) <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="examDay"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px] flex flex-col">
										<FormLabel>
											วันที่สอบ / Date of the examination <span className="text-red-500">*</span>
										</FormLabel>
										<DatePicker value={field.value} onDateChange={field.onChange} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>

						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.student.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					<div className="w-full ">
						<h1 className="text-center font-semibold mb-2">แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ</h1>
						<div className="flex items-center justify-center text-sm">
							<CircleAlert className="mr-1" />
							สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
							<Button variant="link" className="p-1 text-[#A67436]">
								<Link href="">คลิกที่นี่</Link>
							</Button>
						</div>
						<FormField
							control={form.control}
							name="committeeName1"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											ประธานกรรมการ / Head of the Committee <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="committeeName2"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											กรรมการ / Member of the Committee <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="committeeName3"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											กรรมการ / Member of the Committee <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="committeeName4"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											กรรมการ / Member of the Committee <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="committeeName5"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											กรรมการ / Member of the Committee <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>

						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="font-bold">ลายเซ็นหัวหน้าสาขาวิชา</h1>
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger onClick={() => setOpen(!open)}>
									<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										<Image
											src={form.getValues().headSchoolSignUrl ? form.getValues().headSchoolSignUrl : signature}
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
											ref={signCanvas}
											backgroundColor="white"
											throttle={8}
											canvasProps={{
												width: 400,
												height: 150,
												className: "signCanvas",
											}}
										/>
									</div>
									<div className="w-full h-full flex justify-center">
										<Button
											variant="outline"
											type="button"
											onClick={() => clearCanvas()}
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
							{formData?.headSchoolID ? (
								<Label className="mb-2">
									{`${formData?.headSchool?.prefix?.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="headSchoolID"
									render={({ field }) => (
										<>
											<Popover>
												<PopoverTrigger asChild disabled={user?.role != "SUPER_ADMIN"}>
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
																		headSchool?.find((headSchool) => headSchool?.id === field.value)
																			?.prefix?.prefixTH
																  } ${
																		headSchool?.find((headSchool) => headSchool?.id === field.value)
																			?.firstNameTH
																  } ${
																		headSchool?.find((headSchool) => headSchool?.id === field.value)
																			?.lastNameTH
																  } `
																: "เลือกหัวหน้าสาขา"}
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
																	value={`${headSchool?.prefix?.prefixTH}${headSchool?.firstNameTH} ${headSchool?.lastNameTH}`}
																	key={headSchool?.id}
																	onSelect={() => {
																		form.setValue("headSchoolID", headSchool?.id);
																		setSchoolName(headSchool?.school?.schoolNameTH || "");
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			field.value === headSchool?.id ? "opacity-100" : "opacity-0"
																		)}
																	/>
																	{`${headSchool?.prefix?.prefixTH}${headSchool?.firstNameTH} ${headSchool?.lastNameTH}`}
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
							<Label className="my-2">{`หัวหน้าสาขาวิชา ${
								form.getValues().headSchoolID === user?.id ? user?.school?.schoolNameTH : schoolName
							}`}</Label>
						</div>
					</div>
				</div>
				<div className="w-full flex px-20 mt-4 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/superAdmin/form`)}
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
			</form>
		</Form>
	);
}
