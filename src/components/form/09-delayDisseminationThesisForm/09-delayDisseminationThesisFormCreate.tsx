import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import { DatePicker } from "@/components/datePicker/datePicker";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";

const formSchema = z.object({
	thesisNameTH: z.string(),
	thesisNameEN: z.string().toUpperCase(),
	studentID: z.number(),
	publishmentName:z.string(),
	date:z.date(),
	studentSignUrl:z.string(),
	startDate:z.date(),
	endDate:z.date(),
	headCommitteeName:z.string(),
});

async function getUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}


const userPromise = getUser();

const DelayDisseminationThesisFormCreate = () => {
	const router = useRouter();
	const user: IUser = use(userPromise);
	const [openSign, setOpenSign] = useState(false);
	const { toast } = useToast();
	
	const handleDrawingSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			studentSignUrl: signUrl,
		});
		setOpenSign(false);
	};
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			thesisNameTH: "",
			thesisNameEN: "",
			studentID: 0,
			publishmentName:"",
			studentSignUrl:"",
			headCommitteeName:"",
			startDate:new Date(),
			endDate:new Date()
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("values:", values)
		const url = qs.stringifyUrl({
			url: `/api/09DelayDisseminationThesisForm`,
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

	

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center xl:flex-row">
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
						<div>
							<div className="text-center my-5">เรียนประธานคณะกรรมการ / To Head of Committee</div>
							<FormField
								control={form.control}
								name="headCommitteeName"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-auto">
											<FormLabel>ชื่อประธารคณะกรรมการ / Head of Committee name</FormLabel>
											<FormControl>
												<Input className="text-sm p-2 w-[300px] m-auto  rounded-lg" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
						</div>
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
												<Input className="text-sm p-2 w-[300px] m-auto  rounded-lg"{...field} />
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
							<FormField
								control={form.control}
								name="publishmentName"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-auto">
											<FormLabel>ชื่อวารสารที่ต้องการนำวิทยานิพนธ์ไปตีพิมพ์ / scientific journal name</FormLabel>
											<FormControl>
												<Input className="text-sm p-2 w-[300px] m-auto  rounded-lg" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
							<div className="flex flex-row justify-center">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<div className="flex flex-row ">
										<FormItem className="w-auto">
											<FormLabel>ตั้งแต่วันที่ / Starting Date</FormLabel>
											<FormControl>
												<div>
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
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<div className="flex flex-row ">
										<FormItem className="w-auto">
											<FormLabel>จนถึงวันที่ / Until Date</FormLabel>
											<FormControl>
												<div>
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
						</div>
					</div>
					<div className="flex item-center justify-center ">
					<div className="w-3/4 flex flex-col item-center justify-center md:flex-row border-2 rounded-lg py-5 my-5 border-[#eeee] ">
						{(user.role == "STUDENT") && (
							<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
								{/* อาจารย์ที่ปรึกษา */}
								<div className="text-center mb-2">
									ลายเซ็นต์นักศึกษา / <br />
									Student Signature
								</div>
								<SignatureDialog
											signUrl={form.getValues("studentSignUrl")}
											onConfirm={handleDrawingSign}
											isOpen={openSign}
											setIsOpen={setOpenSign} disable={false}								/>
								{/* <Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label> */}
							</div>
						)}
						</div>
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

export default DelayDisseminationThesisFormCreate;
