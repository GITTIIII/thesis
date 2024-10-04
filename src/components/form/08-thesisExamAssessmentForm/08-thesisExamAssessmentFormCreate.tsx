"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { DatePicker } from "@/components/datePicker/datePicker";
import { IOutlineForm } from "@/interface/form";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";

const formSchema = z.object({
	date: z.date(),
	examDate: z.date(),
	disClosed: z.boolean(),
	studentID: z.number(),
});

const ThesisExamAssessmentFormCreate = ({ user, approvedForm }: { user: IUser; approvedForm: IOutlineForm }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: undefined as unknown as Date,
			examDate: undefined as unknown as Date,
			disClosed: true,
			studentID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		if (!values?.examDate) {
			toast({
				title: "Error",
				description: "กรุณาเลือกวันที่สอบ",
				variant: "destructive",
			});
			setLoading(false);
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

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full name" />
						<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${user?.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${user?.phone} `} label="เบอร์โทรศัพท์ / Telephone" />
						<InputForm value={`${user?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full ">
						<div className="w-full sm:w-3/4 mx-auto flex flex-col item-center justify-center rounded-lg mb-2">
							<div className="text-center font-semibold mb-2">โครงร่างวิทยานิพนธ์</div>
							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis Topic (TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis Topic (EN)" />

							<FormField
								control={form.control}
								name="disClosed"
								render={({ field }) => (
									<div className="flex flex-col mb-6 justify-center items-center">
										<FormItem className="w-[300px]">
											<RadioGroup
												onValueChange={(value) => field.onChange(value === "1")}
												defaultValue={field.value ? "1" : "0"}
												className="flex flex-col space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="1" />
													</FormControl>
													<FormLabel className="font-normal">
														วิทยานิพนธ์เผยแพร่ได้ / <br />
														This Thesis can be disclosed.
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="0" />
													</FormControl>
													<FormLabel className="font-normal">
														วิทยานิพนธ์ปกปิด (โปรดกรอก ทบ.24) / <br />
														This Thesis is subject to nondisclosure (Please attach form No.24).
													</FormLabel>
												</FormItem>
											</RadioGroup>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>

							<FormField
								control={form.control}
								name="examDate"
								render={({ field }) => (
									<div className="flex flex-row items-center mb-6 justify-center">
										<FormItem className="w-[300px] flex flex-col">
											<FormLabel>
												วันที่นัดสอบ / Date of the examination <span className="text-red-500">*</span>
											</FormLabel>
											<DatePicker onDateChange={field.onChange} />
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
							<div className="w-[300px] mx-auto px-4 m-0 text-xs text-justify">
								<span className="font-bold">หมายเหตุ:</span>&nbsp;กรณีนักศึกษามีส่วนที่ต้องปรับปรุงต้องดำเนินการให้แล้วเสร็จ
								<span className="font-bold underline">ภายในระยะเวลา 30 วัน</span>
								และไม่เกินวันสุดท้ายของภาคการศึกษาที่ขอสอบวิทยานิพนธ์ หากดำเนินการไม่ทันภาคการศึกษาดังกล่าว
								นักศึกษาต้องลงทะเบียนรักษาสภาพในภาคการศึกษาถัดไปและกำหนดให้วันที่นักศึกษาส่งเล่มวิทยานิพนธ์เป็นวันที่สำเร็จการศึกษา
							</div>
							<div className="w-[300px] mx-auto px-4 m-0 text-xs text-justify">
								<span className="font-bold">Remask:</span>&nbsp;In the event thesis amendments are required, the
								student&nbsp;
								<span className="font-bold underline">must complete all amendments within 30 days</span>&nbsp; and no later
								than the last day of the term in which the thesis examination took place. Failure to do so will result in
								the student maintaining student status in the following term. The thesis submission date shall be deemed the
								students graduation date.
							</div>
						</div>
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
			</form>
		</Form>
	);
};

export default ThesisExamAssessmentFormCreate;
