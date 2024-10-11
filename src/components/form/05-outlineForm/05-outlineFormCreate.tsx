"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IProcessPlan } from "@/interface/form";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { ICoAdvisorStudents } from "@/interface/coAdvisorStudents";
import { checkForZero, checkPlannedWorkSum } from "@/lib/utils";
import { X } from "lucide-react";
import ThesisProcessPlan from "../thesisProcessPlan";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import pdfIcon from "@/../../public/asset/pdf.png";
import Image from "next/image";
import uploadOrange from "@../../../public/asset/uploadOrange.png";
import { Document, Page, pdfjs } from "react-pdf";

const defaultProcessPlans: IProcessPlan[] = [
	{
		step: "ทบทวนการศึกษา รวมข้อมูลรวมทั้งสำรวจปริทัศน์วรรณกรรมและงานวิจัยที่เกี่ยวข้อง",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "สรุปผลการศึกษาเเละจัดทำข้อเสนอเเนะ",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "จัดทำวิทยานิพนธ์",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "สอบวิทยานิพนธ์",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "ปริมาณงานที่วางแผนไว้ (%)",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "ปริมาณงานที่ทำได้จริง (%)",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "งานสะสมที่วางแผนไว้ (%)",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		step: "งานสะสมที่ทำได้จริง (%)",
		months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
];

const MONTHS = [
	"มกราคม",
	"กุมภาพันธ์",
	"มีนาคม",
	"เมษายน",
	"พฤษภาคม",
	"มิถุนายน",
	"กรกฎาคม",
	"สิงหาคม",
	"กันยายน",
	"ตุลาคม",
	"พฤศจิกายน",
	"ธันวาคม",
];

const formSchema = z.object({
	date: z.date(),
	thesisNameTH: z.string().min(1, { message: "กรุณากรอกชื่อวิทยานิพนธ์ / Thesis name requierd" }),
	thesisNameEN: z.string().toUpperCase().min(1, { message: "กรุณากรอกชื่อวิทยานิพนธ์ / Thesis name requierd" }),
	abstractFile: z
		.instanceof(File)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: "ไฟล์ต้องมีขนาดไม่เกิน 5MB.",
		})
		.refine((file) => ["application/pdf"].includes(file.type), {
			message: "ประเภทไฟล์ต้องเป็น PDF เท่านั้น",
		}),
	processPlan: z.array(z.any()),
	times: z.number(),
	thesisStartMonth: z.string().min(1, { message: "กรุณาเลือกเดือน / Please select month" }),
	thesisStartYear: z
		.string()
		.min(1, { message: "กรุณากรอกปี พ.ศ. / Year (B.E.) required" })
		.regex(/^25\d{2}$/, {
			message: "กรุณากรอกปี พ.ศ. ที่ถูกต้อง (เช่น 2566) / Please enter a valid year (e.g., 2566)",
		}),
	formStatus: z.string(),
	studentID: z.number(),
});

const OutlineFormCreate = ({ user }: { user: IUser }) => {
	const router = useRouter();
	const [processPlans, setProcessPlans] = useState<IProcessPlan[]>();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [fileName, setFileName] = useState("No selected File");
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: undefined as unknown as Date,
			thesisNameTH: "",
			thesisNameEN: "",
			abstractFile: undefined as unknown as File,
			processPlan: [],
			times: 0,
			thesisStartMonth: "",
			thesisStartYear: "",
			formStatus: "",
			studentID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		if (!values.abstractFile) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: "ไม่พบไฟล์บทคัดย่อ / No abstract file",
				variant: "destructive",
			});
			handleCancel();

			return;
		}
		if (checkForZero(processPlans!)) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: `กรุณาตรวจสอบและกรอกข้อมูลในช่องผลรวมปริมาณงานที่วางแผนไว้ให้ครบ`,
				variant: "destructive",
			});
			handleCancel();

			return;
		}
		const checkSum = checkPlannedWorkSum(processPlans!);
		if (!checkSum[0]) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: `ผลรวมปริมาณงานที่วางแผนไว้ไม่เท่ากับ 100%, ผลรวมที่ได้คือ: ${Number(checkSum[1] || 0)}%`,
				variant: "destructive",
			});
			handleCancel();

			return;
		}
		if (!user?.signatureUrl) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			handleCancel();
			return;
		}
		if (processPlans) {
			values.processPlan = processPlans;
		}

		const formData = new FormData();
		if (values.date) {
			formData.append("date", values.date.toISOString());
		} else {
			formData.append("date", "");
		}
		formData.append("thesisNameTH", values.thesisNameTH);
		formData.append("thesisNameEN", values.thesisNameEN);
		if (values.abstractFile) {
			formData.append("abstractFile", values.abstractFile);
		} else {
			formData.append("abstractFile", "");
		}
		formData.append("processPlan", JSON.stringify(values.processPlan));
		formData.append("thesisStartMonth", values.thesisStartMonth);
		formData.append("thesisStartYear", values.thesisStartYear);
		formData.append("formStatus", values.formStatus);
		formData.append("studentID", values.studentID.toString());

		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/05OutlineForm`,
		});
		const res = await axios.post(url, formData);
		try {
			if (res.status === 200) {
				toast({
					title: "Success",
					description: "บันทึกสำเร็จแล้ว",
					variant: "default",
				});
				setTimeout(() => {
					setFileName("No selected File");
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
		} catch (err) {
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
				formStatus: "รอดำเนินการ",
				studentID: user.id,
				date: today,
			});
		}
	}, [user, reset]);

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
	}, [errors]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<h1 className="mb-2 font-bold text-center">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full name" />
						<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / Student ID" />

						<div className="m-auto w-[300px] mb-6">
							<FormLabel className="text-sm font-medium">ระดับการศึกษา / Education Level</FormLabel>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={user?.degree === "Master"} value="Master" />
									<FormLabel className="ml-2 font-normal">ปริญญาโท (Master Degree)</FormLabel>
								</div>
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={user?.degree === "Doctoral"} value="Doctoral" />
									<FormLabel className="ml-2 font-normal">ปริญญาเอก (Doctoral Degree)</FormLabel>
								</div>
							</RadioGroup>
						</div>
						<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${user?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full">
						<h1 className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</h1>
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
											<Input className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg" {...field} />
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
											<Input className="text-sm p-2 w-full sm:w-[300px] m-auto  rounded-lg" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<InputForm
							value={`${user?.advisor?.prefix?.prefixTH}${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
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
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<SignatureDialog
								signUrl={user?.signatureUrl && user.role === "STUDENT" ? user?.signatureUrl : ""}
								disable={true}
							/>
							<Label>{`วันที่ ${
								form.getValues().date ? form.getValues().date.toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>
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
					{form.getValues("abstractFile") && form.getValues("abstractFile").type === "application/pdf" && (
						<div className="my-2 rounded-lg border overflow-auto w-full md:w-max  h-[842px] lg:h-max ">
							<Document file={form.getValues("abstractFile")}>
								<Page pageNumber={1} width={794} height={1123} renderAnnotationLayer={false} renderTextLayer={false} />
							</Document>
						</div>
					)}
				</div>

				<h1 className="mb-2 font-bold text-center">เเผนการดำเนินการจัดทำวิทยานิพนธ์</h1>
				<div className="w-full flex flex-col sm:flex-row  justify-center items-center mb-2">
					<Label className="my-2 sm:my-0 font-bold">เริ่มทำวิทธายานิพนธ์ เดือน</Label>
					<FormField
						control={form.control}
						name="thesisStartMonth"
						render={({ field }) => (
							<FormItem className="flex flex-col justify-center">
								<FormControl>
									<Select onValueChange={(value) => field.onChange(value)} value={field.value}>
										<SelectTrigger className="w-[140px] mx-4">
											<SelectValue placeholder="" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{MONTHS.map((month) => (
													<SelectItem key={month} value={month}>
														{month}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Label className="sm:mx-4 my-2 sm:my-0 font-bold"> ปี พ.ศ.</Label>
					<FormField
						control={form.control}
						name="thesisStartYear"
						render={({ field }) => (
							<FormItem className="flex flex-col justify-center">
								<FormControl>
									<Input className="w-[80px]" value={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="w-full h-auto overflow-auto">
					{user && (
						<ThesisProcessPlan
							degree={user!.degree}
							canEdit={true}
							processPlans={defaultProcessPlans}
							setProcessPlans={setProcessPlans}
						/>
					)}
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

export default OutlineFormCreate;
