import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
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

const formSchema = z.object({
	date: z.string(),
	times: z.number(),
	trimester: z.number().min(1, { message: "กรุณาระบุภาคเรียน / Trimester requierd" }).max(1),
	academicYear: z.string().min(1, { message: "กรุณากรอกปีการศึกษา / Academic year requierd" }),
	committeeName1: z
		.string()
		.min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName2: z
		.string()
		.min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName3: z
		.string()
		.min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName4: z
		.string()
		.min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	committeeName5: z
		.string()
		.min(1, { message: "กรุณากรอก คำนำหน้า ชื่อ-นามสกุล กรรมการ / Please fill prefix & full name of committee" }),
	numberStudent: z.number().min(1, { message: "กรุณาระบุจำนวนนักศึกษา / Number of student requierd" }),
	examDay: z.string().min(1, { message: "กรุณาระบุวันสอบ / Exam date requierd" }),
	studentID: z.number(),
});

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

const userPromise = getCurrentUser();

const ComprehensiveExamCommitteeFormCreate = () => {
	const router = useRouter();
	const user: IUser = use(userPromise);
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();
	const form = useForm({
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
			url: `/api/outlineForm`,
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
		if (user) {
			reset({
				...form.getValues(),
				studentID: user.id,
				date: currentDate,
			});
		}
	}, [user, reset]);

	console.log(form.getValues());

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<h1 className="mb-2 font-bold text-center">ข้อมูลนักศึกษา</h1>
						<InputForm
							value={
								user.formLanguage == "en"
									? `${user?.firstNameEN} ${user?.lastNameEN}`
									: `${user?.firstNameTH} ${user?.lastNameTH}`
							}
							label="ชื่อ-นามสกุล / Full Name"
						/>
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

						<InputForm
							value={
								user.formLanguage == "en"
									? `${user?.school.schoolNameEN}`
									: `${user?.school.schoolNameTH}`
							}
							label="สาขาวิชา / School"
						/>
						<InputForm
							value={
								user.formLanguage == "en"
									? `${user?.program.programNameEN}`
									: `${user?.program.programNameTH}`
							}
							label="หลักสูตร / Program"
						/>
						<InputForm value={`${user?.program.programYear}`} label="ปีหลักสูตร / Program Year" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</h1>
						{/* <FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>
											ชื่อภาษาไทย / ThesisName(TH) <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input className="text-sm p-2 w-[300px] m-auto  rounded-lg" {...field} />
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
									<FormItem className="w-max">
										<FormLabel>
											ชื่อภาษาอังกฤษ / ThesisName(EN) <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input className="text-sm p-2 w-[300px] m-auto  rounded-lg" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/> */}
						<InputForm
							value={
								user.formLanguage == "en"
									? `${user?.advisor?.firstNameEN} ${user?.advisor?.lastNameEN}`
									: `${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`
							}
							label="อาจารย์ที่ปรึกษา / Advisor"
						/>
						<InputForm
							value={
								user.formLanguage == "en"
									? `${user?.advisor?.firstNameEN} ${user?.advisor?.lastNameEN}`
									: `${user?.advisor?.firstNameTH} ${user?.advisor?.lastNameTH}`
							}
							label="อาจารย์ที่ปรึกษาร่วม / Co-advisor"
						/>
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button variant="outline" type="button" className="w-60 mt-4 h-max">
								<Image
									src={user?.signatureUrl ? user?.signatureUrl : signature}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>
						</div>
					</div>
				</div>
				<div className="w-full h-max">
					{/* <FormField
						control={form.control}
						name="abstract"
						render={({ field }) => (
							<FormItem className="w-full h-auto flex flex-col items-center">
								<FormLabel>บทคัดย่อ / Abstract</FormLabel>
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
					/> */}
				</div>

				<div className="w-full flex mt-4 px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table`)}
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
