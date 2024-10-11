"use client";
import { boolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IUser } from "@/interface/user";
import { ICoAdvisorStudents } from "@/interface/coAdvisorStudents";
import { DatePicker } from "@/components/datePicker/datePicker";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ICertificate } from "@/interface/certificate";
import UserCertificate from "@/components/profile/userCertificate";

const formSchema = z.object({
	date: z.date(),
	studentID: z.number(),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times required" }),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester required" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z
		.string()
		.min(1, { message: "กรุณากรอกปีการศึกษา (พ.ศ.) / Academic year (B.E.) required" })
		.regex(/^25\d{2}$/, {
			message: "กรุณากรอกปีการศึกษา (พ.ศ.) ที่ถูกต้อง (เช่น 2566) / Please enter a valid academic year (e.g., 2566)",
		}),
	committeeMembers: z
		.array(
			z.object({
				name: z.string().min(1, { message: "กรุณากรอกชื่อกรรมการ / Committee member required" }),
			})
		)
		.min(5, {
			message: "กรุณาเพิ่มกรรมการอย่างน้อย 5 คน / At least 5 committee members required",
		}),
	examDate: z.date(),
	OROG: z.boolean(),
});

const ThesisOutlineCommitteeFormCreate = ({ user }: { user: IUser }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [hasOROG, setHasOROG] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: undefined as unknown as Date,
			times: 0,
			trimester: 0,
			academicYear: "",
			committeeMembers: [{ name: "" }, { name: "" }, { name: "" }, { name: "" }, { name: "" }],
			examDate: undefined as unknown as Date,
			studentID: 0,
			OROG: false,
		},
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "committeeMembers",
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		try {
			const url = qs.stringifyUrl({ url: process.env.NEXT_PUBLIC_URL + `/api/03ThesisOutlineCommitteeForm` });
			const res = await axios.post(url, values);
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
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const today = new Date();
		if (user) {
			reset({
				...form.getValues(),
				studentID: user.id,
				date: today,
			});
		}
	}, [user, reset]);

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	useEffect(() => {
		const errorKeys = Object.keys(errors);
		if (errorKeys.length > 0) {
			handleCancel()
			const firstErrorField = errorKeys[0] as keyof typeof errors;
			const firstErrorMessage = errors[firstErrorField]?.message;
			console.log(errors);
			toast({
				title: "เกิดข้อผิดพลาด",
				description: firstErrorMessage,
				variant: "destructive",
			});
		}
	}, [errors]);

	// useEffect(() => {
	//     const fetchCertificates = async () => {
	//         const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/checkCertificate01ByStdId`);
	//         if(response.data === "found"){
	// 			setHasOROG(true)
	// 			reset({
	// 				...form.getValues(),
	// 				OROG: true,
	// 			});
	// 			console.log("f")
	// 		}else{
	// 			null
	// 			console.log("n")
	// 		}
	// 		console.log("certificate:",response.data)
	//     };
	//     fetchCertificates();
	// }, []);
	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
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
								<div className="flex flex-col mb-6 justify-center items-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											ภาคเรียนที่ / Trimester <span className="text-red-500">*</span>
										</FormLabel>
										<RadioGroup
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value.toString()}
											className="flex flex-col space-y-1"
										>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="1" />
												</FormControl>
												<FormLabel className="font-normal">1</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="2" />
												</FormControl>
												<FormLabel className="font-normal">2</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="3" />
												</FormControl>
												<FormLabel className="font-normal">3</FormLabel>
											</FormItem>
										</RadioGroup>
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
										<Input value={field.value ? field.value : ""} onChange={(e) => field.onChange(e.target.value)} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="examDate"
							render={({ field }) => (
								<div className="flex items-center mb-6 justify-center">
									<FormItem className="w-[300px] flex flex-col">
										<FormLabel>
											วันที่สอบ / Exams date <span className="text-red-500">*</span>
										</FormLabel>
										<DatePicker onDateChange={field.onChange} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<h1 className="text-center font-semibold mb-2">รายละเอียดนักศึกษา</h1>
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full name" />
						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${user?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
						<InputForm
							value={`${user?.advisor?.prefix?.prefixTH}${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / The Advisor"
						/>
						{user?.coAdvisedStudents &&
							user.coAdvisedStudents.length > 0 &&
							user.coAdvisedStudents.map((coAdvisors: ICoAdvisorStudents, index: number) => (
								<InputForm
									key={index}
									value={`${coAdvisors.coAdvisor?.prefix?.prefixTH}${coAdvisors.coAdvisor?.firstNameTH} ${coAdvisors.coAdvisor?.lastNameTH}`}
									label="อาจารย์ที่ปรึกษาร่วม / CoAdvisor"
								/>
							))}
					</div>

					<div className="w-full ">
						<div className="w-full flex justify-center item-center flex-col h-auto border-2 rounded-lg py-5 border-[#eeee]">
							<h1 className="text-center font-semibold mb-2">แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์</h1>
							<div className="flex items-center justify-center text-sm">
								<CircleAlert className="mr-1" />
								สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
								<Button variant="link" type="button" className="p-1 text-[#A67436]">
									<Link href="/user/expertTable" target="_blank">
										คลิกที่นี่
									</Link>
								</Button>
							</div>
							<div>
								{fields.map((field, index) => (
									<FormField
										key={field.id}
										control={form.control}
										name={`committeeMembers.${index}.name`}
										render={({ field }) => (
											<FormItem className="m-5 w-full flex flex-col justify-center">
												{" "}
												{/* เปลี่ยนเป็น flex-col */}
												<div className="flex items-center justify-center space-x-3">
													<Input
														value={field.value ? field.value : ""}
														onChange={field.onChange}
														className="w-[300px]"
													/>
													{index > 4 && (
														<Button
															type="button"
															onClick={() => remove(index)}
															className="bg-[#fff] hover:text-black hover:bg-white text-[#A67436] border-2 border-[#A67436] rounded-lg"
														>
															ลบ
														</Button>
													)}
												</div>
												<FormMessage className="flex item-center justify-center" />
											</FormItem>
										)}
									/>
								))}
								<div className="w-full flex justify-center items-center">
									<Button
										type="button"
										onClick={() => append({ name: "" })}
										className="bg-[#A67436] text-white hover:text-black hover:border-2 hover:border-[#A67436] hover:bg-white"
									>
										เพิ่มกรรมการ
									</Button>
								</div>
							</div>
						</div>
						<div className="w-full flex justify-center item-center flex-col h-auto border-2 rounded-lg py-5 my-5 border-[#eeee]">
							<div>
								{hasOROG && (
									<div>
										<FormLabel className="font-bold">{`ทุน OROG ${
											user?.degree == "Master"
												? `(ป.โท วารสารระดับชาติ หรือ ประชุมวิชาการระดับนานาชาติ)`
												: `(ป.เอก วารสารระดับนานาชาติ)`
										}`}</FormLabel>

										<UserCertificate canUpload={false} user={user} certificateType="1" />
									</div>
								)}
								<div>
									<FormField
										control={form.control}
										name="OROG"
										render={({ field }) => (
											<div className="flex flex-col mb-6 justify-center items-center">
												<h1 className="text-center font-semibold mb-2">หมายเหตุ / Note</h1>
												<FormItem className="w-[400px]">
													{/*  */}
													<RadioGroup
														onValueChange={(value) => field.onChange(value === "Yes")}
														className="flex flex-col space-y-1"
													>
														<FormItem className="flex items-center space-x-3 space-y-1">
															<FormControl>
																<RadioGroupItem value="No" />
															</FormControl>
															<FormLabel className="font-normal leading-5 text-red-500">
																นักศึกษาบัณฑิตศึกษาไม่ได้รับทุน OROG / <br />
																Graduate students do not receive OROG scholarships.
															</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-1">
															<FormControl>
																<RadioGroupItem value="Yes" />
															</FormControl>
															<FormLabel className="font-normal leading-5 text-red-500">
																นักศึกษาบัณฑิตศึกษาเป็นผู้ได้รับทุน OROG (ทั้งนี้
																อาจารย์ที่ปรึกษาวิทยานิพนธ์หลักต้องเป็นอาจารย์ผู้ขอใช้สิทธิ์รับทุนการศึกษาให้กับ
																นักศึกษาเท่านั้น หากชื่อไม่ตรงกัน
																นักศึกษาต้องสิ้นสุดสภาพการรับทุนตามประกาศทุน OROG ตามข้อ 11.8) <br />
																Graduate students are OROG scholarship recipients. (However, the main thesis
																advisor must be a teacher who only applies for the scholarship for students.
																If the names dont match The student must terminate the condition of
																receiving the scholarship according to the OROG scholarship announcement
																under item 11.8.)
															</FormLabel>
														</FormItem>
													</RadioGroup>
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

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
			</form>
		</Form>
	);
};

export default ThesisOutlineCommitteeFormCreate;
