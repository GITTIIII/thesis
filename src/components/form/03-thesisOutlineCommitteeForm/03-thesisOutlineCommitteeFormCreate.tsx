import { z } from "zod";
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IUser } from "@/interface/user";
import { ICoAdvisorStudents } from "@/interface/coAdvisorStudents";
import { DatePicker } from "@/components/datePicker/datePicker";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";

const formSchema = z.object({
	date: z.date(),
	studentID: z.number(),
	advisorID: z.number(),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times required" }),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester required" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z.number().min(1, { message: "กรุณากรอกปีการศึกษา / Academic year required" }),
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
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisOutlineCommitteeFormCreate = () => {
	const router = useRouter();
	const { toast } = useToast();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: undefined as unknown as Date,
			studentID: 0,
			advisorID: 0,
			times: 0,
			trimester: 0,
			academicYear: 0,
			committeeMembers: [{ name: "" }],
			examDate: undefined as unknown as Date,
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
		console.log("Form values: ", values);

		try {
			const url = qs.stringifyUrl({ url: `/api/03ThesisOutlineCommitteeForm` });
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
				advisorID: user.advisorID,
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
			setIsOpen(false);
			const firstErrorField = errorKeys[0] as keyof typeof errors;
			const firstErrorMessage = errors[firstErrorField]?.message;
			console.log(errors)
			toast({
				title: "เกิดข้อผิดพลาด",
				description: firstErrorMessage,
				variant: "destructive",
			});
		}
	}, [errors]);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full sm:2/4">
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
											ปีการศึกษา / Academic year <span className="text-red-500">*</span>
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
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full Name" />
						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm value={`${user?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${user?.program.programYear}`} label="ปีหลักสูตร / Program Year" />
						<InputForm
							value={`${user?.advisor.firstNameTH} ${user?.advisor.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / The Advisor"
						/>
						{user?.coAdvisedStudents &&
							user.coAdvisedStudents.length > 0 &&
							user.coAdvisedStudents.map((member: ICoAdvisorStudents, index: number) => (
								<InputForm
									key={index}
									value={`${member.coAdvisor.firstNameTH} ${member.coAdvisor.lastNameTH}`}
									label="อาจารย์ที่ปรึกษาร่วม / CoAdvisor"
								/>
							))}
					</div>

					<div className="w-full sm:2/4">
						<div className="w-full flex justify-center item-center flex-col h-auto border-2 rounded-lg py-5 border-[#eeee]">
							<h1 className="text-center font-semibold mb-2">แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทบยานิพนธ์</h1>
							<div className="flex items-center justify-center text-sm">
								<CircleAlert className="mr-1" />
								สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
								<Button variant="link" type="button" className="p-1 text-[#A67436]">
									<Link href="/user/expertTable">คลิกที่นี่</Link>
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
													<Button
														type="button"
														onClick={() => remove(index)}
														className="bg-[#fff] hover:text-black hover:bg-white text-[#A67436] border-2 border-[#A67436] rounded-lg"
													>
														ลบ
													</Button>
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
						ยืนยันเเล้วไม่สามารถเเก้ไขได้
					</ConfirmDialog>
				</div>
			</form>
		</Form>
	);
};

export default ThesisOutlineCommitteeFormCreate;