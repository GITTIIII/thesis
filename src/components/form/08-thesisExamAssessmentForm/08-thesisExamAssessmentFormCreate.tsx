import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/datePicker/datePicker";

const formSchema = z.object({
	thesisNameTH: z.string(),
	thesisNameEN: z.string(),
	studentID: z.number(),
	examinationDate:z.date(),
	disClosed:z.boolean(),
	date:z.date(),
	newNameTH: z.string().optional(), 
  	newNameEN: z.string().optional(), 
	reviseTitle: z.boolean(),
});

async function getUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

async function getAllAdvisor() {
	const res = await fetch("/api/getAdvisor");
	return res.json();
}

const userPromise = getUser();

const ThesisExamAssessmentFormCreate = () => {
	const router = useRouter();
	const user: IUser = use(userPromise);
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			thesisNameTH: "",
			thesisNameEN: "",
			studentID: 0,
			examinationDate: new Date(),
			disClosed:true,
			newNameTH:"",
			newNameEN:"",
			reviseTitle: false,
		},
	});
	const disclosed = form.watch('disClosed');

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("values:", values)
		if (values.disClosed===true && (values.newNameEN === undefined || values.newNameTH === undefined)) {
			toast({
				title: "Error",
				description: "กรุณากรอกชื่อวิท",
				variant: "destructive",
			});
			return;
		}
		const url = qs.stringifyUrl({
			url: `/api/08ThesisExamForm`,
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
		if (user) {
			reset({
				...form.getValues(),
				studentID: user.id,
			});
		}
	}, [user, reset]);
	useEffect(() => {
		const today = new Date();
		if (user && user.role === "STUDENT") {
			reset({
				...form.getValues(),
				studentID: user.id,
				date: today,
			});
		}
	}, [user, reset]);

	
	const [isChecked, setIsChecked] = useState(false)

  	const checkHandler = (checked: boolean) => {
    	setIsChecked(!isChecked)
		form.setValue('reviseTitle', checked)
		console.log("check:",isChecked)
  	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}

					<div className="w-full  mt-5">
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
						<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${user?.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${user?.phone} `} label="เบอร์โทรศัพท์ / Phone Number" />

						<div className="w-[300px] flex flex-col items-left mb-6 justify-left mx-auto">
							<FormLabel className="text-sm">ระดับการศึกษา / Education Level</FormLabel>
							<RadioGroup className="space-y-1 mt-2">
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
						<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School Of" />
						<InputForm value={`${user?.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
						<InputForm value={`${user?.program?.programNameTH}`} label="หลักสูตร / Program" />

						<InputForm value={`${user?.program?.programYear}`} label="ปีหลักสูตร / Program Year" />
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full ">
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center mb-5">ชื่อวิทยานิพนธ์</div>
							<FormField
								control={form.control}
								name="thesisNameTH"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-auto">
											<FormLabel>ชื่อภาษาไทย / ThesisName(TH)</FormLabel>
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
										<FormItem className="w-auto">
											<FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
											<FormControl>
												<Input className="text-sm p-2 w-[300px] m-auto  rounded-lg" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
							<RadioGroup
								className="space-y-1 mt-2 justify-center"
								value={disclosed ? 'disclosed' : 'nondisclosure'}
								onValueChange={(value) => form.setValue('disClosed', value === 'disclosed')}
								>
								<div className="w-[300px]">
									<RadioGroupItem value="disclosed" {...form.register('disClosed')} />
									<FormLabel className="ml-2 text-sm">
									วิทยานิพนธ์เผยแพร่ได้ / <br /> This Thesis can be disclosed.
									</FormLabel>
								</div>
								<div>
									<RadioGroupItem value="nondisclosure" {...form.register('disClosed')} />
									<FormLabel className="ml-2 text-sm mb-6">
									วิทยานิพนธ์ปกปิด (โปรดกรอก ทบ.24) / <br /> This Thesis is subject to nondisclosure <br />
									(Please attach form No.24).
									</FormLabel>
								</div>
							</RadioGroup>

							<FormField
								control={form.control}
								name="examinationDate"
								render={({ field }) => (
									<div className="flex flex-row items-center my-6 justify-center">
										<FormItem className="w-auto">
											<FormLabel>วันที่สอบ / This Examination Date</FormLabel>
											<FormControl>
												<div className="w-[300px]">
													<DatePicker
														onDateChange={field.onChange}
														value={field.value ? new Date(field.value) : undefined}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
							<div className="px-4 m-0 text-xs text-justify">
								<span className="font-bold">หมายเหตุ:</span>&nbsp;กรณีนักศึกษามีส่วนที่ต้องปรับปรุง
								ต้องดำเนินการให้แล้วเสร็จ
								<span className="font-bold underline">ภายในระยะเวลา 30 วัน</span>
								และไม่เกินวันสุดท้ายของภาคการศึกษาที่ขอสอบวิทยานิพนธ์ หากดำเนินการไม่ทันภาคการศึกษาดังกล่าว
								นักศึกษาต้องลงทะเบียนรักษาสภาพในภาคการศึกษาถัดไป
								และกำหนดให้วันที่นักศึกษาส่งเล่มวิทยานิพนธ์เป็นวันที่สำเร็จการศึกษา
							</div>
							<div className="px-4 m-0 text-xs text-justify">
								<span className="font-bold">Remask:</span>&nbsp;In the event thesis amendments are required, the
								student&nbsp;
								<span className="font-bold underline">must complete all amendments within 30 days</span>
								&nbsp; and no later than the last day of the term in which the thesis examination took place. Failure to do
								so will result in the student maintaining student status in the following term. The thesis submission date
								shall be deemed the students graduation date.
							</div>
						</div>
						{/* <div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
							ผลการพิจารณาการสอบวิทยานพนธ์ / Results of Examination
						</div> */}
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg my-5 border-[#eeee]">
							{/* <RadioGroup className="space-y-1 mt-2 justify-center">
								<div className="w-[300px]">
									<RadioGroupItem value="Excellent" />
									<FormLabel className="ml-2 font-normal">ดีมาก / Excellent</FormLabel>
								</div>
								<div className="w-[300px]">
									<RadioGroupItem value="Pass" />
									<FormLabel className="ml-2 font-normal">ผ่าน / Pass</FormLabel>
								</div>
								<div className="w-[300px]">
									<RadioGroupItem value="Fail" />
									<FormLabel className="ml-2 font-normal">ไม่ผ่าน / Fail</FormLabel>
								</div>
								</RadioGroup> */}
								<div>
									<div className="items-top flex space-x-2 mt-2 justify-center item-center">
									<Checkbox 
										value="ReviseTile" 
										checked={form.watch('reviseTitle')} 
										onCheckedChange={checkHandler} 
										/>
										<div className="grid gap-1.5 leading-none">
											<FormLabel className="ml-2 font-normal mb-6">
												ปรับเปลี่ยนชื่อวิทยานิพนธ์ / <br />
												if the thesis title requires revision, <br />
												provide both revised Thai and English titles.
											</FormLabel>
										</div>
										</div>
									</div>
							<FormField
								control={form.control}
								name="newNameTH"
								render={({ field }) => (
									<div className="flex flex-row items-center mt-5 justify-center">
										<FormItem className="w-auto">
											<FormLabel>ชื่อวิทยานิพนธ์ภาษาไทย / Thai thesis title</FormLabel>
											<FormControl>
												<Input
													type="int"
													className="text-sm p-2 w-[300px] rounded-lg"
													disabled={!isChecked}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>

							<FormField
								control={form.control}
								name="newNameEN"
								render={({ field }) => (
									<div className="flex flex-row items-center my-5 justify-center">
										<FormItem className="w-auto">
											<FormLabel>ชื่อวิทยานิพนธ์อังกฤษ / English thesis title</FormLabel>
											<FormControl>
												<Input
													type="text"
													className="text-sm p-2 w-[300px] rounded-lg"
													disabled={!isChecked}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						</div>
					</div>
				</div>
				<hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />

				<div className="w-full flex px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/student/table`)}
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
			</form>
		</Form>
	);
};

export default ThesisExamAssessmentFormCreate;
