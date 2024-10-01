"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { IDelayThesisForm } from "@/interface/form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import qs from "query-string";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { DatePicker } from "@/components/datePicker/datePicker";


const formSchema = z.object({
	id: z.number(),
	instituteSignUrl: z.string(),
	instituteID: z.number(),
	approve: z.string(),
	dayApprove: z.date(),
	timeApprove: z.number(),
});
const DelayDisseminationThesisFormRead = ({
	user,
	formData,
}: {
	user: IUser;
	formData: IDelayThesisForm;
}) => {
	const router = useRouter();
    const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dayApprove: new Date(),
			timeApprove: 0,
			instituteID: 0,
			instituteSignUrl: "",
			approve:"",
            id:0,
		},
	});
	const [openDialog, setOpenDialog] = useState(false);
        const handleSign = (signUrl: string) => {
            reset({
                ...form.getValues(),
                instituteSignUrl: signUrl,
            });
            setOpenDialog(false);
        };

		const onSubmit = async (values: z.infer<typeof formSchema>) => {
			console.log(values);
			setLoading(true);
			if(formData.instituteSignUrl){
				toast({
					title: "Error",
					description: "ไม่สามารถบันทึกข้อมูลซ้ำได้",
					variant: "destructive",
				});
				setLoading(false);
				return;
			}
			if (
				(values.instituteSignUrl == ""  && user.position === "HEAD_OF_INSTITUTE")
			) {
				toast({
					title: "Error",
					description: "ไม่พบลายเซ็น",
					variant: "destructive",
				});
				setLoading(false);
				return;
			}
			const url = qs.stringifyUrl({
				url: `/api/09DelayDisseminationThesisForm`,
			});
			const res = await axios.patch(url, values);
			if (res.status === 200) {
				toast({
					title: "Success",
					description: "บันทึกสำเร็จแล้ว",
					variant: "default",
				});
				setTimeout(() => {
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
		reset({
			...form.getValues(),
			id: formData.id,
            instituteID: formData?.instituteID && formData.instituteID > 0 ? formData.instituteID : user.position==="HEAD_OF_INSTITUTE" ? user.id : 0
		});
		console.log(formData)
	}, [formData]);
	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="w-full flex justify-start">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.back()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center xl:flex-row">
					{/* ฝั่งซ้าย */}

					<div className="w-full  mt-5">
						<InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
						<InputForm value={`${user?.username} `} label="รหัสนักศึกษา / StudentID" />
						<InputForm value={`${user?.email} `} label="อีเมล์ / Email" />
						<InputForm value={`${user?.phone} `} label="เบอร์โทรศัพท์ / Phone Number" />
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
							<InputForm value={`${formData?.headCommitteeName}`} label="" />
						</div>
						<div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
							<div className="text-center mb-5">ชื่อวิทยานิพนธ์</div>
								<InputForm value={`${formData?.thesisNameTH}`} label="ชื่อภาษาไทย / ThesisName(TH)" />
								<InputForm value={`${formData?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / ThesisName(EN)" />
								<InputForm value={`${formData?.publishmentName}`} label="ชื่อวารสารที่ต้องการนำวิทยานิพนธ์ไปตีพิมพ์ / scientific journal name" />
							
								<InputForm value={`${formData?.startDate.toLocaleDateString("th")}`} label="ตั้งแต่วันที่ / Starting Date" />
								<InputForm value={`${formData?.endDate.toLocaleDateString("th")}`} label="ตั้งแต่วันที่ / Starting Date" />
						</div>
						<div className="flex item-center justify-center ">
						<div className="w-3/4 flex flex-col item-center justify-center border-2 rounded-lg py-5 my-5 border-[#eeee] ">
						<div>
						{(user.role == "STUDENT" || user.role == "SUPER_ADMIN" || user.position == "HEAD_OF_INSTITUTE" && formData) && (
							<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
								{/* ลายเซ็นต์นักศึกษา */}
								<div className="text-center mb-2">
									ลายเซ็นต์นักศึกษา / <br />
									Student Signature
								</div>
								<div className="flex item-center justify-center w-full">
								<SignatureDialog signUrl={formData?.studentSignUrl ? formData?.studentSignUrl : ""} disable={true} /></div>
								{/* <Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label> */}
							</div>
						)}</div>
						<div>
						</div>
						</div>
						</div>				
						
						{/* ประธานคณะกรรมการ */}
						<div className="flex item-center justify-center ">
						{(user.role == "STUDENT" || user.role == "SUPER_ADMIN" || user.position == "HEAD_OF_INSTITUTE" && formData) && (
							<div className="w-3/4 flex flex-col item-center justify-center border-2 rounded-lg py-5 my-5 border-[#eeee] ">
								<div className="text-center mb-2">ผลการพิจารณาของคณะกรรมการประจำสำนักวิชา / <br /> Institute Committee Decision</div>
									
									{formData.instituteSignUrl ? 
										<div>
											<InputForm value={`${formData?.timeApprove} `} label="ครั้งที่. / No." />
											<InputForm value={`${formData?.dayApprove}..toLocaleDateString("th") `} label="วันที่ / Date" />
											<div className="flex flex-col items-center mb-6 justify-center">
											<RadioGroup disabled className="space-y-1 mt-2">
												<div>
													<RadioGroupItem checked={formData?.approve === "approve"} value="approve" />
													<Label className="ml-2 font-normal">อนุมัติ / approve</Label>
												</div>
												<div>
													<RadioGroupItem checked={formData?.approve === "disApprove"} value="disApprove" />
													<Label className="ml-2 font-normal">ไม่อนุมัติ / disApprove</Label>
												</div>
											</RadioGroup>
											</div>
											<div className="text-center mb-2">
												ลายเซ็นต์ประธานคณะกรรมการ / <br />
												Head of Committee
											</div>
											<div className="flex item-center justify-center">
											<SignatureDialog signUrl={formData?.instituteSignUrl ? formData?.instituteSignUrl : ""} disable={true} /> </div>
										</div>
									: 

									<div>
									<FormField
										control={form.control}
										name="timeApprove"
										render={({ field }) => (
											<div className="flex flex-row items-center my-5 justify-center">
												<FormItem className="w-[300px]">
													<FormLabel>
														ครั้งที่. / No. <span className="text-red-500">*</span>
													</FormLabel>
													<Input
														value={field.value ? field.value : ""}
														onChange={(e) => field.onChange(Number(e.target.value))}
													/>
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
									<FormField
										control={form.control}
										name="dayApprove"
										render={({ field }) => (
											<div className="flex flex-row items-center justify-center mb-5">
												<FormItem className="w-[300px]">
													<FormLabel>วันที่ / Date </FormLabel>
													<div>
													<DatePicker value={field.value} onDateChange={field.onChange} /></div>
													<FormMessage />
												</FormItem>
											</div>
										)}
									/>
									<FormField
									control={form.control}
									name="approve"
									render={({ field }) => (
										<FormItem className="w-[300px] mx-auto my-5 space-y-3">
										<FormControl>
											<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex flex-row space-y-1"
											>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
												<RadioGroupItem value="approve" />
												</FormControl>
												<FormLabel className="font-normal">
													อนุมัติ / approve
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
												<RadioGroupItem value="disApprove" />
												</FormControl>
												<FormLabel className="font-normal">
													ไม่อนุมัติ / disApprove
												</FormLabel>
											</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
										</FormItem>
									)}
									/>
								<div className="text-center mb-2">
									ลายเซ็นต์ประธานคณะกรรมการ / 
									Head of Committee
								</div>
								<div className="flex justify-center item-center">
								<SignatureDialog
									disable={formData?.instituteSignUrl ? true : false}
									signUrl={formData?.instituteSignUrl? formData?.instituteSignUrl: form.getValues("instituteSignUrl")}
									onConfirm={handleSign}
									isOpen={openDialog}
									setIsOpen={setOpenDialog}
								/>
								</div>
								</div>
									}
							</div>
						)}</div>
					</div>
				</div>
				<div className="w-full flex px-20 mt-4 lg:flex justify-center">
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

export default DelayDisseminationThesisFormRead;
