import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import signature from "@../../../public/asset/signature.png";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "@/components/inputForm/inputForm";

type Form = {
	id: number;
	date: string;
	thesisNameTH: string;
	thesisNameEN: string;

	studentID: number;
	student: User;
	advisorID: number;
	advisor: User;
	coAdvisorID: number;
	coAdvisor: User;

	outlineCommitteeID: number;
	outlineCommittee: User;
	outlineCommitteeStatus: string;
	outlineCommitteeComment: string;
	dateOutlineCommitteeSign: string;

	instituteCommitteeID: number;
	instituteCommittee: User;
	instituteCommitteeStatus: string;
	instituteCommitteeComment: string;
	dateInstituteCommitteeSign: string;
};

type User = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	educationLevel: string;
	school: string;
	position: string;
	role: string;
	program: string;
	programYear: string;
	advisorID: number;
	co_advisorID: number;
	signatureUrl: string;
};

const formSchema = z.object({
	id: z.number(),
	outlineCommitteeID: z.number(),
	outlineCommitteeStatus: z.string(),
	outlineCommitteeComment: z.string(),
	dateOutlineCommitteeSign: z.string(),
	instituteCommitteeID: z.number(),
	instituteCommitteeStatus: z.string(),
	instituteCommitteeComment: z.string(),
	dateInstituteCommitteeSign: z.string(),
});

const OutlineFormUpdate = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [formData, setFormData] = useState<Form | null>(null);

	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			outlineCommitteeID: 0,
			outlineCommitteeStatus: "",
			outlineCommitteeComment: "",
			dateOutlineCommitteeSign: "",

			instituteCommitteeID: 0,
			instituteCommitteeStatus: "",
			instituteCommitteeComment: "",
			dateInstituteCommitteeSign: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		if (!user?.signatureUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			return;
		}
		const url = qs.stringifyUrl({
			url: `/api/outlineForm`,
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
				router.push("/user/admin/table");
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
		if (
			user &&
			user.position == "COMMITTEE_OUTLINE" &&
			!formData?.outlineCommitteeID
		) {
			reset({
				...form.getValues(),
				outlineCommitteeID: user.id,
				dateOutlineCommitteeSign: currentDate,
			});
		}
		if (
			user &&
			user.position == "COMMITTEE_INSTITUTE" &&
			!formData?.instituteCommitteeID
		) {
			reset({
				...form.getValues(),
				instituteCommitteeID: user.id,
				dateInstituteCommitteeSign: currentDate,
			});
		}
	}, [user, formData, reset]);

	useEffect(() => {
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => setUser(data));
		fetch(`/api/getOutlineFormById/${formId}`)
			.then((res) => res.json())
			.then((data) => setFormData(data))
			.catch((error) => console.log(error));
		reset({
			...form.getValues(),
			id: formId,
		});
	}, []);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full h-full bg-white p-4"
			>
				{(formData?.outlineCommitteeID &&
					user?.position === "COMMITTEE_OUTLINE") ||
				(formData?.instituteCommitteeID &&
					user?.position === "COMMITTEE_INSTITUTE") ? (
					<div className="w-full flex px-20">
						<Button
							variant="outline"
							type="reset"
							onClick={() => router.push("/user/admin/table")}
							className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
						>
							ย้อนกลับ
						</Button>
					</div>
				) : null}
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<InputForm value={`${formData?.date}`} label="วันที่สร้าง / Date" />

						<InputForm
							value={`${formData?.student.firstName} ${formData?.student.lastName}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm
							value={`${formData?.student.username} `}
							label="รหัสนักศึกษา / StudentID"
						/>

						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel className="font-normal">
								ระดับการศึกษา / Education Level
							</FormLabel>
							<RadioGroup className="space-y-1 mt-2">
								<div>
									<RadioGroupItem
										checked={formData?.student.educationLevel === "Master"}
										value="Master"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาโท (Master Degree)
									</FormLabel>
								</div>
								<div>
									<RadioGroupItem
										checked={formData?.student.educationLevel === "Doctoral"}
										value="Doctoral"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาเอก (Doctoral Degree)
									</FormLabel>
								</div>
							</RadioGroup>
						</div>

						<InputForm
							value={`${formData?.student.school}`}
							label="สำนักวิชา / School"
						/>
						<InputForm
							value={`${formData?.student.program}`}
							label="หลักสูตร / Program"
						/>
						<InputForm
							value={`${formData?.student.programYear}`}
							label="ปีหลักสูตร / Program Year"
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<div className="text-center">ชื่อโครงร่างวิทยานิพนธ์</div>
						<InputForm
							value={`${formData?.thesisNameTH}`}
							label="ชื่อภาษาไทย / ThesisName(TH)"
						/>
						<InputForm
							value={`${formData?.thesisNameEN}`}
							label="ชื่อภาษาอังกฤษ / ThesisName(EN)"
						/>
						<InputForm
							value={`${formData?.advisor.firstName} ${formData?.advisor.lastName}`}
							label="อาจารย์ที่ปรึกษา / Thesis Advisor"
						/>
						<InputForm
							value={
								formData?.coAdvisor
									? `${formData?.coAdvisor.firstName} ${formData?.coAdvisor.lastName}`
									: ""
							}
							label="อาจารย์ที่ปรึกษาร่วม(ถ้ามี) / Co-Thesis Advisor (if any)"
						/>
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button
								variant="outline"
								type="button"
								className="w-60 mt-4 h-max"
							>
								<Image
									src={
										formData?.student.signatureUrl
											? formData?.student.signatureUrl
											: signature
									}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col md:flex-row justify-center mt-4">
					{/* กรรมการโครงร่าง */}
					{user?.role == "COMMITTEE" && (
						<div className="w-full h-max flex flex-col justify-center items-center">
							<FormLabel className="text-lg font-bold">
								กรรมการโครงร่าง
							</FormLabel>
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button
								variant="outline"
								type="button"
								className="w-60 mt-4 h-max"
							>
								<Image
									src={
										formData?.outlineCommittee?.signatureUrl
											? formData?.outlineCommittee.signatureUrl
											: user.position == "COMMITTEE_OUTLINE"
											? user.signatureUrl
											: signature
									}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>

							{formData?.outlineCommitteeID ? (
								<div className="flex flex-col items-center justify-center">
									<RadioGroup className="flex my-6">
										<div className="flex items-center justify-center">
											<RadioGroupItem
												checked={
													formData.outlineCommitteeStatus == "NOT_APPROVED"
												}
												value="NOT_APPROVED"
											/>
											<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
												ไม่อนุมัติ
											</div>
										</div>
										<div className="ml-4 mt-0 flex items-center justify-center">
											<RadioGroupItem
												checked={formData.outlineCommitteeStatus == "APPROVED"}
												value="APPROVED"
											/>
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
													onValueChange={field.onChange}
													className="flex my-4"
												>
													<FormItem className="flex items-center justify-center">
														<RadioGroupItem
															className="mt-2"
															value="NOT_APPROVED"
														/>
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
										<FormLabel>ความเห็นกรรมการโครงร่าง</FormLabel>
										<FormControl>
											<Textarea
												placeholder="ความเห็น..."
												className="resize-none h-full text-md"
												value={
													formData?.instituteCommitteeComment
														? formData?.instituteCommitteeComment
														: field.value
												}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					{/* กรรมการสำนักวิชา */}
					{(user?.position == "COMMITTEE_INSTITUTE" ||
						formData?.instituteCommitteeID) && (
						<div className="w-full h-max flex flex-col justify-center items-center mt-10 md:mt-0">
							<FormLabel className="text-lg font-bold">
								กรรมการสำนักวิชา
							</FormLabel>
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button
								variant="outline"
								type="button"
								className="w-60 mt-4 h-max"
							>
								<Image
									src={
										formData?.instituteCommittee?.signatureUrl
											? formData?.instituteCommittee.signatureUrl
											: user?.position == "COMMITTEE_INSTITUTE"
											? user?.signatureUrl
											: signature
									}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>

							{formData?.instituteCommitteeID ? (
								<div className="flex flex-col items-center justify-center">
									<RadioGroup className="flex my-6">
										<div className="flex items-center justify-center">
											<RadioGroupItem
												checked={
													formData.instituteCommitteeStatus == "NOT_APPROVED"
												}
												value="NOT_APPROVED"
											/>
											<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">
												ไม่อนุมัติ
											</div>
										</div>
										<div className="ml-4 mt-0 flex items-center justify-center">
											<RadioGroupItem
												checked={
													formData.instituteCommitteeStatus == "APPROVED"
												}
												value="APPROVED"
											/>
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
													onValueChange={field.onChange}
													className="flex my-4"
												>
													<FormItem className="flex items-center justify-center">
														<RadioGroupItem
															className="mt-2"
															value="NOT_APPROVED"
														/>
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
										<FormLabel>ความเห็นกรรมการสำนักวิชา</FormLabel>
										<FormControl>
											<Textarea
												placeholder="ความเห็น..."
												className="resize-none h-full text-md"
												value={
													formData?.instituteCommitteeComment
														? formData?.instituteCommitteeComment
														: field.value
												}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>

				{(!formData?.outlineCommitteeID &&
					user?.position === "COMMITTEE_OUTLINE") ||
				(!formData?.instituteCommitteeID &&
					user?.position === "COMMITTEE_INSTITUTE") ? (
					<div className="w-full flex px-20 mt-4 lg:flex justify-center">
						<Button
							variant="outline"
							type="reset"
							onClick={() => router.push(`/user/admin/table`)}
							className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
						>
							ยกเลิก
						</Button>
						<Button
							variant="outline"
							type="submit"
							className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
						>
							ยืนยัน
						</Button>
					</div>
				) : null}
			</form>
		</Form>
	);
};

export default OutlineFormUpdate;
