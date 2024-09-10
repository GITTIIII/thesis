"use client";
import { unknown, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import signature from "@/../../public/asset/signature.png";
import ThesisProcessPlan from "../thesisProcessPlan";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import InputForm from "@/components/inputForm/inputForm";
import { IOutlineForm, IProcessPlan, IThesisProgressForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { DatePicker } from "@/components/datePicker/datePicker";

const formSchema = z.object({
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester requierd" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z.string().min(1, { message: "กรุณากรอกปีการศึกษา / Academic year requierd" }),
	gpa: z.string().min(1, { message: "กรุณากรอกคะแนนเฉลี่ยสะสม / GPA requierd" }),
	credits: z.number().min(1, { message: "กรุณากรอกหน่วยกิต / Credits requierd" }),
	date: z.date(),
	dateExam: z.date(),
	studentID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisExamAppointmentFormCreate = () => {
	const router = useRouter();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: approvedForm } = useSWR<IOutlineForm>(`/api/get05ApprovedFormByStdId/${user?.id}`, fetcher);
	const [loading, setLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			trimester: 0,
			academicYear: "",
			gpa: "",
			credits: 0,
			date: undefined as unknown as Date,
			dateExam: undefined as unknown as Date,
			studentID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		console.log(values);
		if (!user?.signatureUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}
		const url = qs.stringifyUrl({
			url: `/api/07ThesisExamAppointmentForm`,
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

	const { reset } = form;

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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}

					<div className="w-full sm:2/4 ">
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
							name="gpa"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											คะเเนนสะสมเฉลี่ย / GPA <span className="text-red-500">*</span>
										</FormLabel>
										<Input {...field} />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="credits"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											หน่วยกิต / Credits <span className="text-red-500">*</span>
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
							name="dateExam"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px] flex flex-col">
										<FormLabel>
											วันที่นัดสอบ / Date of the examination <span className="text-red-500">*</span>
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

						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel className="font-normal">ระดับการศึกษา / Education Level</FormLabel>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem checked={user?.degree === "Master"} value="Master" />
									<FormLabel className="ml-2 font-normal">ปริญญาโท (Master Degree)</FormLabel>
								</div>
								<div>
									<RadioGroupItem checked={user?.degree === "Doctoral"} value="Doctoral" />
									<FormLabel className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</FormLabel>
								</div>
							</RadioGroup>
						</div>
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<div className="w-full sm:w-3/4 mx-auto flex flex-col item-center justify-center rounded-lg mb-2">
							<InputForm
								value={`${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
								label="อาจารย์ที่ปรึกษา / Advisor"
							/>
							<div className="text-center font-semibold mb-2">โครงร่างวิทยานิพนธ์</div>
							<div className="flex flex-row items-center mb-6 justify-center">
								<FormItem className="w-[300px]">
									<FormLabel>
										วันที่อนุมัติโครงร่างวิทยานิพนธ์ / <br />
										Thesis outline approval date
									</FormLabel>
									<Input
										disabled
										value={`${
											approvedForm?.dateOutlineCommitteeSign
												? new Date(approvedForm?.dateOutlineCommitteeSign).toLocaleDateString("th")
												: ""
										}`}
									/>
									<FormMessage />
								</FormItem>
							</div>

							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
						</div>

						<div className="flex flex-col items-center justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button variant="outline" type="button" className="w-60 mt-4 h-max">
								<Image
									src={user?.signatureUrl ? user?.signatureUrl : signature}
									width={100}
									height={100}
									style={{ width: "auto", height: "auto" }}
									alt="signature"
								/>
							</Button>
						</div>
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

export default ThesisExamAppointmentFormCreate;
