"use client";
import { z } from "zod";
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

const formSchema = z.object({
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times requierd" }),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester requierd" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	status: z.string(),
	statusComment: z.string(),
	percentage: z.number(),
	percentageComment: z.string(),
	issues: z.string(),
	date: z.date(),
	processPlan: z.array(z.any()),
	studentID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisProgressFormCreate = () => {
	const router = useRouter();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: approvedForm } = useSWR<IOutlineForm>(`/api/get05ApprovedFormByStdId/${user?.id}`, fetcher);
	const { data: last06Form } = useSWR<IThesisProgressForm>(`/api/getLast06FormByStdId/${user?.id}`, fetcher);
	const [processPlans, setProcessPlans] = useState<IProcessPlan[]>();
	const [loading, setLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			times: 0,
			trimester: 0,
			status: "",
			statusComment: "",
			percentage: 0,
			percentageComment: "",
			issues: "",
			date: undefined as unknown as Date,
			processPlan: [],
			studentID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		if (!user?.signatureUrl) {
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
				router.push("/user/table?formType=thesisProgressForm");
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

	const handleRadioChange = (value: string) => {
		if (value === "Adjustments") {
			setIsDisabled(false);
			reset({
				...form.getValues(),
				status: "Adjustments",
			});
		} else if (value === "AsPlaned") {
			setIsDisabled(true);
			reset({
				...form.getValues(),
				status: "AsPlaned",
				statusComment: "",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}

					<div className="w-full sm:2/4 ">
						<FormField
							control={form.control}
							name="times"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-[300px]">
										<FormLabel>
											ครั้งที่ / No. <span className="text-red-500">*</span>
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

						<div>
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
						</div>
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

						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</div>
							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
						</div>
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<InputForm
							value={`${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>

						<div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
							ขอรายงานความคืบหน้าวิทยานิพนธ์ดังนี้
						</div>
						<div className="w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="font-normal text-center mb-5">1. ระดับการดำเนินงาน</div>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<RadioGroup className="space-y-1 mt-2" onValueChange={handleRadioChange}>
											<div>
												<RadioGroupItem value="AsPlaned" />
												<FormLabel className="ml-2 font-normal">เป็นไปตามแผนที่วางไว้ทุกประการ</FormLabel>
											</div>
											<div>
												<RadioGroupItem value="Adjustments" />
												<FormLabel className="ml-2 font-normal mb-6">มีการเปลี่ยนแผนที่วางไว้</FormLabel>
											</div>
										</RadioGroup>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="statusComment"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Textarea
												className="mt-2"
												placeholder="มีการเปลี่ยนแปลงดังนี้..."
												disabled={isDisabled}
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
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
											<FormLabel>คิดเป็นร้อยละการทำงานของเป้าหมาย<span className="text-red-500">*</span></FormLabel>
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
								name="percentageComment"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-auto">
											<FormLabel>โดยสรุปผลได้ดังนี้</FormLabel>
											<FormControl>
												<Textarea
													className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
													placeholder="Type your message here."
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						</div>
						<div className="mt-6 w-full sm:w-max mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="w-full text-center font-normal mb-6">3. ปัญหา อุปสรรค และแนวทางแก้ไข</div>
							<FormField
								control={form.control}
								name="issues"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-auto">
											<FormControl>
												<Textarea
													className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
													placeholder="Type your message here."
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						</div>
						<div className="flex flex-col items-center mt-6 mb-6 justify-center">
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
							<Label className="mt-2">{`วันที่ ${form.getValues().date ? new Date(form.getValues().date).toLocaleDateString("th") : "__________"}`}</Label>
						</div>
					</div>
				</div>
				<hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />

				<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg mt-4">
					<h1 className="mb-2 font-bold text-center">เเผนการดำเนินการจัดทำวิทยานิพนธ์</h1>
					<div className="w-full flex flex-col sm:flex-row justify-center items-center mb-2 ">
						<Label className="font-bold">เริ่มทำวิทธายานิพนธ์ เดือน</Label>
						<Input disabled className="w-max mx-4 my-2 sm:my-0" value={`${approvedForm?.thesisStartMonth}`} />
						<Label className="mx-4 font-bold"> ปี พ.ศ.</Label>
						<Input disabled className="w-max my-2 sm:my-0" value={`${approvedForm?.thesisStartYear}`} />
					</div>
					<div className="w-full h-max overflow-auto flex justify-center">
						{last06Form && approvedForm && (
							<ThesisProcessPlan
								degree={user!.degree}
								canEdit={true}
								processPlans={last06Form.processPlan ? last06Form.processPlan : approvedForm.processPlan}
								setProcessPlans={setProcessPlans}
							/>
						)}
					</div>
				</div>

				<div className="w-full flex mt-4 px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table?formType=thesisProgressForm`)}
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

export default ThesisProgressFormCreate;
