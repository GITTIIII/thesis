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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { Textarea } from "../../ui/textarea";
import { CircleAlert } from "lucide-react";
import ThesisProcessPlan from "../thesisProcessPlan";
import { IProcessPlan } from "@/interface/form";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";

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
	abstract: z.string().min(1, { message: "กรุณากรอกบทคัดย่อ / Abstract requierd" }),
	processPlan: z.array(z.any()),
	times: z.number(),
	thesisStartMonth: z.string().min(1, { message: "กรุณาเลือกเดือน / Please select month" }),
	thesisStartYear: z.string().min(1, { message: "กรุณากรอกปี พ.ศ. / Year (B.E.) requierd" }),
	formStatus: z.string(),
	studentID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OutlineFormCreate = () => {
	const router = useRouter();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const [processPlans, setProcessPlans] = useState<IProcessPlan[]>();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: undefined as unknown as Date,
			thesisNameTH: "",
			thesisNameEN: "",
			abstract: "",
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
		if (!user?.signatureUrl) {
			toast({
				title: "เกิดข้อผิดพลาด",
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
			url: `/api/05OutlineForm`,
		});
		const res = await axios.post(url, values);
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
		}
	};

	const { reset } = form;
	const {
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

	useEffect(() => {
		const errorKeys = Object.keys(errors);
		if (errorKeys.length > 0) {
			setIsOpen(false);
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
					<div className="w-full sm:2/4">
						<h1 className="mb-2 font-bold text-center">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full Name" />
						<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / Student ID" />

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

						<InputForm value={`${user?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${user?.program.programYear}`} label="ปีหลักสูตร / Program Year" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</h1>
						<FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-full sm:w-auto">
										<FormLabel>
											ชื่อภาษาไทย / ThesisName(TH) <span className="text-red-500">*</span>
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
											ชื่อภาษาอังกฤษ / ThesisName(EN) <span className="text-red-500">*</span>
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
							value={`${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>
						<InputForm
							value={`${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`}
							label="อาจารย์ที่ปรึกษาร่วม / Co-advisor"
						/>
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button variant="outline" type="button" className="w-60 mt-4 h-max">
								<Image
									src={user?.signatureUrl ? user?.signatureUrl : signature}
									width={200}
									height={100}
									style={{
										width: "auto",
										height: "auto",
									}}
									alt="signature"
								/>
							</Button>
							<Label className="mt-2">{`วันที่ ${
								form.getValues().date ? form.getValues().date.toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>
				</div>
				<div className="w-full h-max mb-6">
					<FormField
						control={form.control}
						name="abstract"
						render={({ field }) => (
							<FormItem className="w-full h-auto flex flex-col items-center">
								<FormLabel>
									บทคัดย่อ / Abstract <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="บทคัดย่อ..."
										className="text-[16px] resize-none 
											w-full md:w-[595px] lg:w-[794px] 
											h-[842px] lg:h-[1123px] 
											p-[16px] 
											md:pt-[108px] lg:pt-[144px] 
											md:pl-[108px] lg:pl-[144px] 
											md:pr-[72px]  lg:pr-[96px] 
											md:pb-[72px]  lg:pb-[96px]"
										value={field.value}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormDescription className="flex items-center">
									{" "}
									<CircleAlert className="mr-1" />
									บทคัดย่อต้องมีความยาวไม่เกิน 1 หน้ากระดาษ
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
						ยืนยันเเล้วไม่สามารถเเก้ไขได้
					</ConfirmDialog>
				</div>
			</form>
		</Form>
	);
};

export default OutlineFormCreate;
