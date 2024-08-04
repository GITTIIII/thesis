import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/datePicker/datePicker";
import useSWR from "swr";

const formSchema = z.object({
	date: z.string(),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times requierd" }),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester requierd" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z.string().min(1, { message: "กรุณากรอกปีการศึกษา / Academic year requierd" }),
	committeeName1: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName2: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName3: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName4: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName5: z.string().min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	numberStudent: z.number().min(1, { message: "กรุณาระบุจำนวนนักศึกษา / Number of student requierd" }),
	examDay: z.string().min(1, { message: "กรุณาเลือกวันที่สอบ / Exam date requierd" }),
	studentID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ComprehensiveExamCommitteeFormCreate = () => {
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: "",
			times: 0,
			trimester: 0,
			academicYear: "",
			committeeName1: "",
			committeeName2: "",
			committeeName3: "",
			committeeName4: "",
			committeeName5: "",
			numberStudent: 0,
			examDay: "",
			studentID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		const url = qs.stringifyUrl({
			url: `/api/01ComprehensiveExamCommitteeForm`,
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
				router.push("/user/table?formType=comprehensiveExamCommitteeForm");
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
		const today = new Date();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();
		const date = today.getDate();
		const currentDate = date + "/" + month + "/" + year;
		if (user) {
			reset({
				...form.getValues(),
				studentID: user.id,
				date: currentDate,
				numberStudent: 1,
			});
		}
	}, [user, reset]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
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
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
						<InputForm value={`${user?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${user?.program.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />
					</div>

					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
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
					</div>
				</div>
				<div className="w-full flex mt-4 px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/table?formType=comprehensiveExamCommitteeForm")}
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
};

export default ComprehensiveExamCommitteeFormCreate;
