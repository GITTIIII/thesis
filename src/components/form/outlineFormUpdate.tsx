import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
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
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "@/components/inputForm/inputForm";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "../ui/label";
import signature from "../../../public/asset/signature.png";

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

async function getOutlineFormById(formId: number): Promise<IOutlineForm> {
	const res = await fetch(`/api/getOutlineFormById/${formId}`, {
		next: { revalidate: 10 },
	});
	return res.json();
}

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

const userPromise = getCurrentUser();

const OutlineFormUpdate = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const { toast } = useToast();
	const user: IUser = use(userPromise);
	const [formData, setFormData] = useState<IOutlineForm>();

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
		if (
			(values.outlineCommitteeStatus == "" &&
				user.position.toString() == "COMMITTEE_OUTLINE") ||
			(values.instituteCommitteeStatus == "" &&
				user.position.toString() == "COMMITTEE_INSTITUTE")
		) {
			toast({
				title: "Error",
				description: "กรุณาเลือกสถานะ",
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
				router.push("/user/table");
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
			user.position.toString() == "COMMITTEE_OUTLINE" &&
			!formData?.outlineCommitteeID
		) {
			reset({
				...form.getValues(),
				outlineCommitteeID: user.id,
				dateOutlineCommitteeSign: currentDate,
			});
		} else if (
			user &&
			user.position.toString() == "COMMITTEE_INSTITUTE" &&
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
		async function fetchData() {
			const data = await getOutlineFormById(formId);
			setFormData(data);
		}
		fetchData();

		reset({
			...form.getValues(),
			id: formId,
		});
	}, [formId]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full h-full bg-white p-4"
			>
				{(formData?.outlineCommitteeID &&
					user?.position.toString() === "COMMITTEE_OUTLINE") ||
				(formData?.instituteCommitteeID &&
					user?.position.toString() === "COMMITTEE_INSTITUTE") ? (
					<div className="w-full flex px-0 lg:px-20 mb-2">
						<Button
							variant="outline"
							type="reset"
							onClick={() => router.push("/user/table")}
							className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
						>
							ย้อนกลับ
						</Button>
					</div>
				) : null}
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<h1 className="text-center mb-2 font-bold">
							ข้อมูลนักศึกษา
						</h1>
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
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem
										checked={
											formData?.student.degree ===
											"Master"
										}
										value="Master"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาโท (Master Degree)
									</FormLabel>
								</div>
								<div>
									<RadioGroupItem
										checked={
											formData?.student.degree ===
											"Doctoral"
										}
										value="Doctoral"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาเอก (Doctoral Degree)
									</FormLabel>
								</div>
							</RadioGroup>
						</div>

						<InputForm
							value={`${formData?.student.school.schoolName}`}
							label="สำนักวิชา / School"
						/>
						<InputForm
							value={`${formData?.student.program.programName}`}
							label="หลักสูตร / Program"
						/>
						<InputForm
							value={`${formData?.student.program.programYear}`}
							label="ปีหลักสูตร / Program Year"
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<h1 className="text-center mb-2 font-bold">
							ชื่อโครงร่างวิทยานิพนธ์
						</h1>
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
								className="w-60 my-4 h-max"
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
							<Label>{`วันที่ ${
								formData?.date ? formData?.date : "__________"
							}`}</Label>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col md:flex-row justify-center mt-4">
					{/* กรรมการโครงร่าง */}
					{user?.role.toString() == "COMMITTEE" && (
						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="mb-2 font-bold">
								ความเห็นของคณะกรรมการพิจารณาโครงร่างวิทยานิพนธ์
							</h1>
							<Label className="mt-2">{`วันที่ ${
								formData?.dateOutlineCommitteeSign
									? formData?.dateOutlineCommitteeSign
									: form.getValues().dateOutlineCommitteeSign
									? form.getValues().dateOutlineCommitteeSign
									: "__________"
							}`}</Label>

							{formData?.outlineCommitteeID ? (
								<div className="flex flex-col items-center justify-center">
									<RadioGroup disabled className="flex my-6">
										<div className="flex items-center justify-center">
											<RadioGroupItem
												checked={
													formData?.outlineCommitteeStatus ==
													"NOT_APPROVED"
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
													formData?.outlineCommitteeStatus ==
													"APPROVED"
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
									name="outlineCommitteeStatus"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioGroup
													disabled={
														user.position.toString() !=
														"COMMITTEE_OUTLINE"
													}
													onValueChange={
														field.onChange
													}
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
														<RadioGroupItem
															className="mt-2"
															value="APPROVED"
														/>
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
										<FormControl>
											<Textarea
												disabled={
													formData?.outlineCommitteeID
														? true
														: false ||
														  (user.position.toString() !=
																"COMMITTEE_OUTLINE" &&
																user.role.toString() !=
																	"SUPER_ADMIN")
												}
												placeholder="ความเห็น..."
												className="resize-none h-full text-md mb-2"
												value={
													formData?.outlineCommitteeComment
														? formData?.outlineCommitteeComment
														: field.value
												}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								variant="outline"
								type="button"
								className="w-60 my-4 h-max"
							>
								<Image
									src={
										formData?.outlineCommittee?.signatureUrl
											? formData?.outlineCommittee
													.signatureUrl
											: user.position.toString() ==
													"COMMITTEE_OUTLINE" &&
											  user.signatureUrl
											? user.signatureUrl
											: signature
									}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>
							{(user.position.toString() == "COMMITTEE_OUTLINE" ||
								formData?.outlineCommitteeID) && (
								<Label className="mb-2">
									{formData?.outlineCommitteeID
										? `${formData?.outlineCommittee.firstName} ${formData?.outlineCommittee.lastName}`
										: `${user.firstName} ${user.lastName}`}
								</Label>
							)}
							<Label className="mb-2">(ประธานคณะกรรมการ)</Label>
						</div>
					)}

					{/* กรรมการสำนักวิชา */}
					{(user?.position.toString() == "COMMITTEE_INSTITUTE" ||
						formData?.instituteCommitteeID) && (
						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="mb-2 font-bold">
								มติคณะกรรมการประจำสำนักวิชาวิศวกรรมศาสตร์
							</h1>
							<Label className="mt-2">{`วันที่ ${
								formData?.dateInstituteCommitteeSign
									? formData?.dateInstituteCommitteeSign
									: form.getValues()
											.dateInstituteCommitteeSign
									? form.getValues()
											.dateInstituteCommitteeSign
									: "__________"
							}`}</Label>

							{formData?.instituteCommitteeID ? (
								<div className="flex flex-col items-center justify-center">
									<RadioGroup
										disabled={
											user.position.toString() !=
												"COMMITTEE_INSTITUTE" ||
											user.role.toString() !=
												"SUPER_ADMIN"
										}
										className="flex my-6"
									>
										<div className="flex items-center justify-center">
											<RadioGroupItem
												checked={
													formData?.instituteCommitteeStatus ==
													"NOT_APPROVED"
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
													formData?.instituteCommitteeStatus ==
													"APPROVED"
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
													onValueChange={
														field.onChange
													}
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
														<RadioGroupItem
															className="mt-2"
															value="APPROVED"
														/>
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
										<FormControl>
											<Textarea
												placeholder="ความเห็น..."
												className="resize-none h-full text-md mb-2"
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
							<Button
								variant="outline"
								type="button"
								className="w-60 my-4 h-max"
							>
								<Image
									src={
										formData?.instituteCommittee
											?.signatureUrl
											? formData?.instituteCommittee
													.signatureUrl
											: user.position.toString() ==
													"COMMITTEE_INSTITUTE" &&
											  user.signatureUrl
											? user.signatureUrl
											: signature
									}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>
							<Label className="mb-2">
								{formData?.instituteCommitteeID
									? `${formData?.instituteCommittee.firstName} ${formData?.instituteCommittee.lastName}`
									: `${user.firstName} ${user.lastName}`}
							</Label>
							<Label className="mb-2">(ประธานคณะกรรมการ)</Label>
						</div>
					)}
				</div>

				{(!formData?.outlineCommitteeID &&
					user?.position.toString() === "COMMITTEE_OUTLINE") ||
				(!formData?.instituteCommitteeID &&
					user?.position.toString() === "COMMITTEE_INSTITUTE") ? (
					<div className="w-full flex px-20 mt-4 lg:flex justify-center">
						<Button
							variant="outline"
							type="reset"
							onClick={() => router.push(`/user/table`)}
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
			<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg mt-4">
				<div className="w-full h-max flex flex-col items-center">
					<Label className="text-sm font-medium mb-2">
						บทคัดย่อ / Abstract
					</Label>
					<Textarea
						className="text-[16px] resize-none 
									w-full md:w-[595px] lg:w-[794px] 
									h-[842px] lg:h-[1123px] 
									p-[16px] 
									md:pt-[108px] lg:pt-[144px] 
									md:pl-[108px] lg:pl-[144px] 
									md:pr-[72px]  lg:pr-[96px] 
									md:pb-[72px]  lg:pb-[96px]"
						value={formData?.abstract}
						disabled
					/>
				</div>
			</div>
		</Form>
	);
};

export default OutlineFormUpdate;
