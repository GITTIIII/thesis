import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";

type Form = {
	id: number;
	date: string;
	fullname: string;
	username: string;
	education_level: string;
	school: string;
	program: string;
	program_year: string;
	thesisNameTH: string;
	thesisNameEN: string;
	advisorID: number;
	advisor: User;
	co_advisorID: number;
	coAdvisor: User;
	studentID: number;
	student_signature: string;

	committee_outline_status: string;
	committee_outline_comment: string;
	committee_outline_signature: string;
	date_committee_outline_sign: string;

	committee_institute_status: string;
	committee_institute_comment: string;
	committee_institute_signature: string;
	date_committee_institute_sign: string;
};

type User = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	education_level: string;
	school: string;
	program: string;
	program_year: string;
	advisorID: number;
	co_advisorID: number;
	signatureUrl: string;
};

const formSchema = z.object({
	date: z.string(),
	fullname: z.string(),
	username: z.string(),
	education_level: z.string(),
	school: z.string(),
	program: z.string(),
	program_year: z.string(),
	thesisNameTH: z.string(),
	thesisNameEN: z.string(),
	advisorID: z.number(),
	co_advisorID: z.number(),
	studentID: z.number(),
	student_signature: z.string(),
});

const Form1View = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const [formData, setFormData] = useState<Form | null>(null);
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: "",
			fullname: "",
			username: "",
			education_level: "",
			school: "",
			program: "",
			program_year: "",
			thesisNameTH: "",
			thesisNameEN: "",
			advisorID: 0,
			co_advisorID: 0,
			studentID: 0,
			student_signature: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};

	useEffect(() => {
		fetch(`/api/getForm1/${formId}`)
			.then((res) => res.json())
			.then((data) => setFormData(data));
	}, []);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full h-full bg-white p-4"
			>
				<div className="w-full flex px-20">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/student/table")}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>วันที่ / DATE</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.date}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="fullname"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ชื่อ-นามสกุล / FullName</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.fullname}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>รหัสนักศึกษา / Student-No.</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.username}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="education_level"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ระดับการศึกษา / Education-Level</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem
															checked={formData?.education_level === "Master"}
															value="Master"
														/>
													</FormControl>
													<FormLabel className="font-normal">
														ปริญญาโท (Master Degree)
													</FormLabel>
												</FormItem>

												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem
															checked={formData?.education_level === "Doctoral"}
															value="Doctoral"
														/>
													</FormControl>
													<FormLabel className="font-normal">
														ปริญญาเอก (Doctoral Degree)
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="school"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>สาขาวิชา / School</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.school}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="program"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>หลักสูตร / Program</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.program}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="program_year"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ปีหลักสูตร / ProgramYear</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.program_year}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<div className="text-center">ชื่อโครงร่างวิทยานิพนธ์</div>
						<FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ชื่อภาษาไทย / ThesisName(TH)</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.thesisNameTH}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.thesisNameEN}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="advisorID"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>อาจารย์ที่ปรึกษา / Thesis Advisor</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={formData?.advisor.firstName}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="co_advisorID"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>
											อาจารย์ที่ปรึกษาร่วม(ถ้ามี) / Co-Thesis Advisor (if any)
										</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
												value={
													formData?.coAdvisor
														? formData?.coAdvisor.firstName
														: ""
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
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
										formData?.student_signature
											? formData?.student_signature
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
				<div className="flex flex-col items-center mb-6 justify-center md:flex-row">
					<div className="flex flex-col justify-center items-center px-20">
						<h1 className="mb-2 font-bold">กรรมการโครงร่าง</h1>
						<FormLabel>ลายเซ็น / Signature</FormLabel>
						<Button variant="outline" type="button" className="w-60 mt-4 h-max">
							<Image
								src={
									formData?.committee_outline_signature
										? formData?.committee_outline_signature
										: signature
								}
								width={100}
								height={100}
								alt="signature"
							/>
						</Button>
					</div>

					<div className="flex flex-col justify-center items-center px-20">
						<h1 className="mb-2 font-bold">กรรมการสำนักวิชา</h1>
						<FormLabel>ลายเซ็น / Signature</FormLabel>
						<Button variant="outline" type="button" className="w-60 mt-4 h-max">
							<Image
								src={
									formData?.committee_institute_signature
										? formData?.committee_institute_signature
										: signature
								}
								width={100}
								height={100}
								alt="signature"
							/>
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default Form1View;
