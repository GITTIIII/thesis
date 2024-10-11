"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../ui/textarea";
import { IOutlineForm } from "@/interface/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { IUser } from "@/interface/user";
import { X } from "lucide-react";
import InputForm from "@/components/inputForm/inputForm";
import ThesisProcessPlan from "../thesisProcessPlan";
import axios from "axios";
import qs from "query-string";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { checkForZero, checkPlannedWorkSum } from "@/lib/utils";
import { Document, Page, pdfjs } from "react-pdf";
import pdfIcon from "@/../../public/asset/pdf.png";
import Image from "next/image";
import uploadOrange from "@../../../public/asset/uploadOrange.png";

const formSchema = z.object({
	id: z.number(),
	thesisNameTH: z.string(),
	thesisNameEN: z.string().toUpperCase(),
	abstractFile: z
		.instanceof(File)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: "ไฟล์ต้องมีขนาดไม่เกิน 5MB.",
		})
		.refine((file) => ["application/pdf"].includes(file.type), {
			message: "ประเภทไฟล์ต้องเป็น PDF เท่านั้น",
		})
		.optional(),
	formStatus: z.string(),
});

const OutlineFormUpdateStd = ({ formData, user }: { formData: IOutlineForm; user: IUser }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [fileName, setFileName] = useState("No selected File");
	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			thesisNameTH: "",
			thesisNameEN: "",
			abstractFile: undefined as unknown as File,
			formStatus: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		if (checkForZero(formData?.processPlan)) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: `กรุณาตรวจสอบและกรอกข้อมูลในช่องผลรวมปริมาณงานที่วางแผนไว้ให้ครบ`,
				variant: "destructive",
			});
			handleCancel();

			return;
		}
		const checkSum = checkPlannedWorkSum(formData?.processPlan);
		if (!checkSum[0]) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: `ผลรวมปริมาณงานที่วางแผนไว้ไม่เท่ากับ 100%, ผลรวมที่ได้คือ: ${Number(checkSum[1] || 0)}%`,
				variant: "destructive",
			});
			handleCancel();

			return;
		}
		values.formStatus = "เเก้ไขเเล้ว";
		const formDataUpdate = new FormData();
		formDataUpdate.append("id", values.id.toString() || "0");
		formDataUpdate.append("thesisNameTH", values.thesisNameTH || "");
		formDataUpdate.append("thesisNameEN", values.thesisNameEN || "");
		if (values.abstractFile) {
			formDataUpdate.append("abstractFile", values.abstractFile);
		} else {
			formDataUpdate.append("abstractFile", "");
		}
		formDataUpdate.append("formStatus", values.formStatus || "");

		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/05OutlineForm`,
		});
		const res = await axios.patch(url, formDataUpdate);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			setTimeout(() => {
				setIsOpen(false);
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
			handleCancel();
		}
	};

	const {
		reset,
		formState: { errors },
	} = form;

	useEffect(() => {
		reset({
			...form.getValues(),
			id: formData.id,
			thesisNameTH: formData?.thesisNameTH,
			thesisNameEN: formData?.thesisNameEN,
		});
	}, [formData]);

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
			console.log(errors);
			toast({
				title: "เกิดข้อผิดพลาด",
				description: firstErrorMessage,
				variant: "destructive",
			});
		}
	}, [errors]);

	pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

	console.log(process.env.NEXT_PUBLIC_URL + `/api/getFileUrl/abstract/${formData.abstractFileName}`);
	console.log(formData.abstractFileName);
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="w-full flex px-0 xl:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.back()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row my-4">
					<FormItem className="w-full sm:w-1/2">
						<FormControl>
							<Textarea
								disabled
								className="resize-none h-full text-md mb-2"
								value={formData?.editComment ? formData?.editComment : ""}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<div className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</div>

						<InputForm
							value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`}
							label="ชื่อ-นามสกุล / Full name"
						/>
						<InputForm value={`${formData?.student?.username}`} label="รหัสนักศึกษา / StudentID" />
						<div className="flex flex-col items-center mb-6 justify-center">
							<Label className="font-normal">ระดับการศึกษา / Education Level</Label>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem checked={formData?.student?.degree === "Master"} value="Master" />
									<Label className="ml-2 font-normal">ปริญญาโท (Master Degree)</Label>
								</div>
								<div>
									<RadioGroupItem checked={formData?.student?.degree === "Doctoral"} value="Doctoral" />
									<Label className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</Label>
								</div>
							</RadioGroup>
						</div>

						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full">
						<div className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</div>
						<FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-full sm:w-auto">
										<FormLabel>
											ชื่อภาษาไทย / Thesis name (TH) <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
												value={field.value}
												onChange={field.onChange}
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
									<FormItem className="w-full sm:w-auto">
										<FormLabel>
											ชื่อภาษาอังกฤษ / Thesis name (EN) <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<InputForm
							value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>
						<InputForm
							value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษาร่วม / Co-advisor"
						/>
						<div className="flex flex-col items-center mt-6 justify-center">
							<Label>ลายเซ็น / Signature</Label>
							<SignatureDialog
								signUrl={formData?.student.signatureUrl ? formData?.student.signatureUrl : ""}
								disable={true}
							/>
							<Label className="mt-2">{`วันที่ ${
								formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center mt-4 sm:mt-0 mb-6 justify-center md:flex-row">
					<div className="flex flex-col justify-center items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold">ความเห็นของคณะกรรมการพิจารณาโครงร่างวิทยานิพนธ์</h1>
						<Label className="mt-2">{`วันที่ ${
							formData?.dateOutlineCommitteeSign
								? new Date(formData?.dateOutlineCommitteeSign).toLocaleDateString("th")
								: "__________"
						}`}</Label>
						<div className="flex flex-col items-center justify-center">
							<RadioGroup disabled className="flex my-6">
								<div className="flex items-center justify-center">
									<RadioGroupItem checked={formData?.outlineCommitteeStatus == "ไม่อนุมัติ"} value="ไม่อนุมัติ" />
									<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">ไม่อนุมัติ</div>
								</div>
								<div className="ml-4 mt-0 flex items-center justify-center">
									<RadioGroupItem checked={formData?.outlineCommitteeStatus == "อนุมัติ"} value="อนุมัติ" />
									<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
										อนุมัติ
									</div>
								</div>
							</RadioGroup>
						</div>
						<div>
							<Textarea
								disabled
								placeholder="ความเห็น..."
								className="resize-none h-full text-md mb-2"
								defaultValue={formData?.outlineCommitteeComment}
							/>
						</div>
						<SignatureDialog
							disable={true}
							signUrl={formData?.outlineCommitteeSignUrl ? formData?.outlineCommitteeSignUrl : ""}
						/>
						<Label className="mb-2">
							{formData?.outlineCommittee
								? `${formData?.outlineCommittee.prefix}${formData?.outlineCommittee.firstName} ${formData?.outlineCommittee.lastName}`
								: ""}
						</Label>
						<Label className="mb-2">{`(ประธานคณะกรรมการ)`}</Label>
					</div>

					<div className="flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
						<h1 className="mb-2 font-bold">มติคณะกรรมการประจำสำนักวิชาวิศวกรรมศาสตร์</h1>
						<Label className="mt-2">{`ครั้งที่ ${formData?.times ? formData?.times : "__"}  วันที่ ${
							formData?.dateInstituteCommitteeSign
								? new Date(formData?.dateInstituteCommitteeSign).toLocaleDateString("th")
								: "__________"
						}`}</Label>
						<div className="flex flex-col items-center justify-center">
							<RadioGroup disabled className="flex my-6">
								<div className="flex items-center justify-center">
									<RadioGroupItem checked={formData?.instituteCommitteeStatus == "ไม่อนุมัติ"} value="ไม่อนุมัติ" />
									<div className="py-1 px-2 ml-2 border-2 border-[#A67436] rounded-xl text-[#A67436]">ไม่อนุมัติ</div>
								</div>
								<div className="ml-4 mt-0 flex items-center justify-center">
									<RadioGroupItem checked={formData?.instituteCommitteeStatus == "อนุมัติ"} value="อนุมัติ" />
									<div className="py-1 ml-2 px-4 border-2 border-[#A67436] bg-[#A67436] rounded-xl text-white">
										อนุมัติ
									</div>
								</div>
							</RadioGroup>
						</div>
						<div>
							<Textarea
								disabled
								placeholder="ความเห็น..."
								className="resize-none h-full text-md mb-2"
								defaultValue={formData?.instituteCommitteeComment}
							/>
						</div>
						<SignatureDialog
							disable={true}
							signUrl={formData?.instituteCommitteeSignUrl ? formData?.instituteCommitteeSignUrl : ""}
						/>
						<Label className="mb-2">
							{formData?.instituteCommittee
								? `${formData?.instituteCommittee?.prefix?.prefixTH}${formData?.instituteCommittee.firstNameTH} ${formData?.instituteCommittee.lastNameTH}`
								: ""}
						</Label>
						<Label className="mb-2">{`(ประธานคณะกรรมการ)`}</Label>
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

				<div className="w-full h-max my-6 flex flex-col justify-center items-center">
					<FormLabel className="my-2">
						บทคัดย่อ / Abstract <span className="text-red-500">*</span>
					</FormLabel>
					<FormField
						control={form.control}
						name="abstractFile"
						render={({ field }) => (
							<FormItem
								onClick={() => document.querySelector<HTMLInputElement>(".input-field")?.click()}
								className="h-[300px] w-full sm:w-1/2 flex flex-col justify-center items-center border-2 border-dashed border-[#F26522] cursor-pointer rounded-xl hover:bg-accent"
							>
								<Image src={uploadOrange} width={64} height={64} alt="jpeg" />
								<label>เลือกไฟล์ / Browse File</label>
								<FormControl>
									<Input
										type="file"
										className="hidden input-field"
										onChange={(e) => {
											const files = e.target.files;
											if (files && files.length > 0) {
												field.onChange(files[0]);
												setFileName(files[0].name);
											}
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="w-full sm:w-1/2 flex mt-2 justify-center items-center">
						{form.getValues("abstractFile") && (
							<div>
								{form.getValues("abstractFile").type === "application/pdf" && (
									<Image className="w-[32px] h-auto" src={pdfIcon} width={100} height={100} alt="pdf" />
								)}
							</div>
						)}
						<label className="ml-2 text-sm">{fileName}</label>
						{form.getValues("abstractFile") && (
							<X
								className="ml-auto hover:cursor-pointer hover:text-[#F26522]"
								onClick={() => {
									setFileName("No selected File");
									form.setValue("abstractFile", undefined as unknown as File);
								}}
							/>
						)}
					</div>
					{(formData.abstractFileName ||
						(form.getValues("abstractFile") && form.getValues("abstractFile").type === "application/pdf")) && (
						<div className="my-2 rounded-lg border overflow-auto w-full md:w-max  h-[842px] lg:h-max ">
							<Document
								file={
									form.getValues("abstractFile") && form.getValues("abstractFile").type === "application/pdf"
										? form.getValues("abstractFile")
										: process.env.NEXT_PUBLIC_URL + `/api/getFileUrl/abstract/${formData.abstractFileName}`
								}
							>
								<Page pageNumber={1} width={794} height={1123} renderAnnotationLayer={false} renderTextLayer={false} />
							</Document>
						</div>
					)}
				</div>
				<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg mt-4">
					<h1 className="mb-2 font-bold text-center">เเผนการดำเนินการจัดทำวิทยานิพนธ์</h1>
					<div className="w-full flex justify-center items-center mb-2 ">
						<Label className="font-bold">เริ่มทำวิทธายานิพนธ์ เดือน</Label>
						<Input disabled className="w-max mx-4" value={`${formData?.thesisStartMonth}`} />
						<Label className="mx-4 font-bold"> ปี พ.ศ.</Label>
						<Input disabled className="w-max" value={`${formData?.thesisStartYear}`} />
					</div>
					<div className="w-full h-max overflow-auto flex justify-center">
						{formData && (
							<ThesisProcessPlan canEdit={false} degree={formData?.student.degree} processPlans={formData?.processPlan} />
						)}
					</div>
				</div>
			</form>
		</Form>
	);
};

export default OutlineFormUpdateStd;
