"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/datePicker/datePicker";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
	date: z.date(),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times requierd" }),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester requierd" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z
		.string()
		.min(1, { message: "กรุณากรอกปีการศึกษา (พ.ศ.) / Academic year (B.E.) required" })
		.regex(/^25\d{2}$/, {
			message: "กรุณากรอกปีการศึกษา (พ.ศ.) ที่ถูกต้อง (เช่น 2566) / Please enter a valid academic year (e.g., 2566)",
		}),
	committeeName1: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName2: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName3: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName4: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName5: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	numberStudent: z.number().min(1, { message: "กรุณาระบุจำนวนนักศึกษา / Number of student requierd" }),
	examDay: z.date(),
	studentID: z.number(),
});

const QualificationExamCommitteeFormCreate = ({ user }: { user: IUser }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: undefined as unknown as Date,
			times: 0,
			trimester: 0,
			academicYear: "",
			committeeName1: "",
			committeeName2: "",
			committeeName3: "",
			committeeName4: "",
			committeeName5: "",
			numberStudent: 0,
			examDay: undefined as unknown as Date,
			studentID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/02QualificationExamCommitteeForm`,
		});
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
	};

	const {
		reset,
		formState: { errors },
	} = form;

	useEffect(() => {
		const today = new Date();
		if (user) {
			reset({
				...form.getValues(),
				studentID: user.id,
				date: today,
				numberStudent: 1,
			});
		}
	}, [user, reset, form]);

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	useEffect(() => {
		const errorKeys = Object.keys(errors);
		if (errorKeys.length > 0) {
			handleCancel();
			const firstErrorField = errorKeys[0] as keyof typeof errors;
			const firstErrorMessage = errors[firstErrorField]?.message;
			
			toast({
				title: "เกิดข้อผิดพลาด",
				description: firstErrorMessage,
				variant: "destructive",
			});
		}
	}, [errors, toast]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full">
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
										<DatePicker onDateChange={field.onChange} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full name" />
						<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${user?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					<div className="w-full">
						<h1 className="text-center font-semibold mb-2">แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ</h1>
						<div className="flex items-center justify-center text-sm">
							<CircleAlert className="mr-1" />
							สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
							<Button variant="link" className="p-1 text-[#A67436]">
								<Link href="/user/expertTable">คลิกที่นี่</Link>
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
					</div>
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

export default QualificationExamCommitteeFormCreate;
