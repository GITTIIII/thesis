"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "../../ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import { IExamCommitteeForm } from "@/interface/form";
import { DatePicker } from "@/components/datePicker/datePicker";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import Link from "next/link";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { updateStdFormState } from "@/app/action/updateStdFormState";

const addNoteSchema = z.object({
	committeeNumber: z.number().optional(),
	meetingNumber: z.number().optional(),
	date: z.date().optional(),
});

const formSchema = z.object({
	id: z.number(),
	headSchoolID: z.number(),
	headSchoolSignUrl: z.string().default(""),
	advisorSignUrl: z.string().default(""),
	instituteComSignUrl: z.string().default(""),
	addNotes: z.array(addNoteSchema),
});

const ExameCommitteeFormUpdate = ({ formData, user, headSchool }: { formData: IExamCommitteeForm; user: IUser; headSchool: IUser[] }) => {
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [openHeadSchoolDialog, setOpenHeadSchoolDialog] = useState(false);
	const [openAdvisorDialog, setOpenAdvisorDialog] = useState(false);
	const [openinstituteComDialog, setOpeninstituteComDialog] = useState(false);
	const [showFields, setShowFields] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	const handleDrawingAdvisorSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			advisorSignUrl: signUrl,
		});
		setOpenAdvisorDialog(false);
	};
	const handleDrawingInstituteComSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			instituteComSignUrl: signUrl,
		});
		setOpeninstituteComDialog(false);
	};
	const handleDrawingHeadSchoolSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			headSchoolSignUrl: signUrl,
		});
		setOpenHeadSchoolDialog(false);
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			headSchoolID: 0,
			headSchoolSignUrl: "",
			advisorSignUrl: "",
			instituteComSignUrl: "",
			addNotes: [{ committeeNumber: 0, meetingNumber: 0, date: undefined }],
		},
	});

	const {
		reset,
		control,
		formState: { errors },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "addNotes",
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("Submitting form with values:", values);
		setLoading(true);
		if (values.addNotes[0].committeeNumber == 0 && values.addNotes[0].meetingNumber == 0) {
			values.addNotes = [];
		}
		if (
			(values.advisorSignUrl == "" && user.role == "ADVISOR") ||
			(values.headSchoolSignUrl == "" && values.headSchoolID != 0) ||
			(values.instituteComSignUrl == "" && user.role == "SUPER_ADMIN")
		) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			handleCancel();
			return;
		}

		const url = qs.stringifyUrl({
			url: `/api/04ThesisExamCommitteeForm`,
		});

		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			if (values.headSchoolID) {
				updateStdFormState(formData.studentID);
			}
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

	useEffect(() => {
		reset({
			id: formData.id,
			headSchoolID: user.position === "HEAD_OF_SCHOOL" ? user.id : 0,
		});
	}, [formData, user]);

	const handleAddNote = () => {
		setShowFields(true);
		append({ committeeNumber: 0, meetingNumber: 0, date: undefined });
	};

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
			console.log(errors);
		}
	}, [errors]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.back()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				{/* ฝั่งซ้าย */}
				<div className="flex flex-col justify-center md:flex-row ">
					<div className="w-full ">
						<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
						<InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
						<InputForm value={`${formData?.trimester}`} label="ภาคเรียน / Trimester" />
						<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา (พ.ศ.) / Academic year (B.E.)" />
						<InputForm
							value={formData?.examDate ? new Date(formData?.examDate).toLocaleDateString("th") : ""}
							label="วันที่สอบ / Date of the examination"
						/>

						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.student.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					{/* ฝั่งขวา */}

					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการวิทยานิพนธ์</h1>

						<div className="flex items-center justify-center text-sm">
							<CircleAlert className="mr-1" />
							สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
							<Button type="button" variant="link" className="p-1 text-[#A67436]">
								<Link target="_blank" href="/user/expertTable">
									คลิกที่นี่
								</Link>
							</Button>
						</div>
						{formData?.committeeMembers.map((member, index) => (
							<InputForm key={index} value={`${member.name}`} label="กรรมการ / Committee" />
						))}
					</div>
				</div>
				<div className="flex item-center justify-center ">
					<div className="w-full flex flex-col item-center justify-center md:flex-row rounded-lg py-5 my-5 ">
						{(formData?.advisorSignUrl ||
							user.role == "SUPER_ADMIN" ||
							user.position == "ADVISOR" ||
							user.position == "HEAD_OF_SCHOOL") && (
							<div className="w-full sm:1/3 flex flex-col items-center mb-6 ">
								{/* อาจารย์ที่ปรึกษา */}
								<div className="text-center mb-2">
									อาจารย์ที่ปรึกษา / <br />
									Thesis advisor
								</div>
								<SignatureDialog
									signUrl={formData?.advisorSignUrl || form.getValues("advisorSignUrl")}
									disable={formData?.advisorSignUrl ? true : false}
									onConfirm={handleDrawingAdvisorSign}
									isOpen={openAdvisorDialog}
									setIsOpen={setOpenAdvisorDialog}
								/>
								<Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
							</div>
						)}

						{/* หัวหน้าสาขาวิชา */}
						{(user.role == "SUPER_ADMIN" || user.position == "HEAD_OF_SCHOOL") && (
							<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
								<div className="text-center mb-2">
									หัวหน้าสาขาวิชา / <br />
									Head of the School
								</div>
								<SignatureDialog
									disable={formData?.headSchoolSignUrl ? true : false}
									signUrl={formData?.headSchoolSignUrl || form.getValues("headSchoolSignUrl")}
									onConfirm={handleDrawingHeadSchoolSign}
									isOpen={openHeadSchoolDialog}
									setIsOpen={setOpenHeadSchoolDialog}
								/>
								{formData?.headSchoolID ? (
									<Label className="mb-2">{`${formData?.headSchool?.prefix?.prefixTH}${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`}</Label>
								) : (
									<FormField
										control={form.control}
										name="headSchoolID"
										render={({ field }) => (
											<>
												<Popover>
													<PopoverTrigger
														asChild
														disabled={user?.position != "HEAD_OF_SCHOOL" && user?.role != "SUPER_ADMIN"}
													>
														<FormControl>
															<Button
																variant="outline"
																role="combobox"
																className={cn(
																	"w-[180px] justify-between",
																	!field.value && "text-muted-foreground"
																)}
															>
																{field.value
																	? `${
																			headSchool?.find((headSchool) => headSchool.id === field.value)
																				?.prefix?.prefixTH
																	  }${
																			headSchool?.find((headSchool) => headSchool.id === field.value)
																				?.firstNameTH
																	  } ${
																			headSchool?.find((headSchool) => headSchool.id === field.value)
																				?.lastNameTH
																	  } `
																	: "ค้นหาหัวหน้าสาขา"}
																<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-full p-0">
														<Command>
															<CommandInput placeholder="ค้นหาหัวหน้าสาขา" />
															<CommandList>
																<CommandEmpty>ไม่พบหัวหน้าสาขา</CommandEmpty>
																{headSchool?.map((headSchool) => (
																	<CommandItem
																		value={`${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
																		key={headSchool.id}
																		onSelect={() => {
																			form.setValue("headSchoolID", headSchool.id);
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value === headSchool.id ? "opacity-100" : "opacity-0"
																			)}
																		/>
																		{`${headSchool.prefix?.prefixTH}${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
																	</CommandItem>
																))}
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</>
										)}
									/>
								)}
							</div>
						)}

						{/* ประธานคณะทำงานวิชาการ */}
						{(user.role == "SUPER_ADMIN" || user.position == "HEAD_OF_INSTITUTE") && (
							<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
								<div className="text-center mb-2">
									ประธานคณะทำงานวิชาการ / <br />
									Associate Dean for Academic Affairs
								</div>
								<SignatureDialog
									disable={formData?.instituteComSignUrl ? true : false}
									signUrl={formData?.instituteComSignUrl || form.getValues("instituteComSignUrl")}
									onConfirm={handleDrawingInstituteComSign}
									isOpen={openinstituteComDialog}
									setIsOpen={setOpeninstituteComDialog}
								/>
							</div>
						)}
					</div>
				</div>
				<div className="w-3/4 text-sm mx-auto p-5 border-2 rounded-lg my-5 border-[#eeee]">
					<div className="font-bold underline text-center my-2">หมายเหตุ / Note</div>
					<div className="flex flex-col items-center justify-center md:flex-row">
						<div className="w-full sm:w-3/4 flex flex-col justify-center items-center ml-4">
							{formData?.addNotes &&
								formData.addNotes.map(
									(field, index) =>
										// Ensure to check the conditions correctly before rendering the component
										field.committeeNumber &&
										field.meetingNumber &&
										field.date && (
											<div key={index} className="mb-4 flex flex-col md:flex-row justify-center">
												<div className="mb-4 flex flex-row justify-center items-center">
													<label className="block text-gray-700 mx-2">กรรมการลำดับที่</label>
													<input
														type="text"
														value={`${field.committeeNumber}`}
														readOnly
														className="mt-1 block w-[80px] p-2 border border-gray-300 rounded-md"
													/>
												</div>
												<div className="mb-4 flex flex-row justify-center items-center">
													<label className="block text-gray-700 mx-2">ในการประชุมครั้งที่</label>
													<input
														type="text"
														value={`${field.meetingNumber}`}
														readOnly
														className="mt-1 block w-[80px] p-2 border border-gray-300 rounded-md"
													/>
												</div>
												<div className="mb-4 flex flex-row justify-center items-center">
													<label className="block text-gray-700 mx-2">เมื่อวันที่</label>
													<input
														type="text"
														value={`${new Date(field.date).toLocaleDateString("th")}`}
														readOnly
														className="mt-1 block w-[95px] p-2 border border-gray-300 rounded-md"
													/>
												</div>
											</div>
										)
								)}

							{showFields &&
								fields.map((field, index) => (
									<FormItem key={field.id} className="m-5 w-full">
										<div className="flex flex-wrap items-center justify-center space-x-3 whitespace-nowrap">
											<FormField
												control={form.control}
												name={`addNotes.${index}.committeeNumber`}
												render={({ field }) => (
													<div className="flex items-center space-x-2 my-2">
														<FormLabel>กรรมการลำดับที่</FormLabel>
														<Input
															type="number"
															min={0}
															value={field.value || ""}
															onChange={(e) => field.onChange(Number(e.target.value))}
															className="w-[80px]"
														/>
													</div>
												)}
											/>
											<FormField
												control={form.control}
												name={`addNotes.${index}.meetingNumber`}
												render={({ field }) => (
													<div className="flex items-center space-x-2 my-2">
														<FormLabel>ในการประชุมครั้งที่</FormLabel>
														<Input
															type="number"
															min={0}
															value={field.value || ""}
															onChange={(e) => field.onChange(Number(e.target.value))}
															className="w-[80px]"
														/>
													</div>
												)}
											/>
											<FormField
												control={form.control}
												name={`addNotes.${index}.date`}
												render={({ field }) => (
													<div className="flex items-center space-x-2 my-2">
														<FormLabel>เมื่อวันที่</FormLabel>
														<DatePicker
															onDateChange={(date) => field.onChange(date)}
															value={field.value || undefined}
														/>
													</div>
												)}
											/>
											<Button
												type="button"
												onClick={() => remove(index)}
												className="bg-[#fff] hover:text-black hover:bg-white text-[#A67436] border-2 border-[#A67436] rounded-lg"
											>
												ลบ
											</Button>
										</div>
									</FormItem>
								))}
							<div className="w-full flex justify-center items-center mx-auto">
								<Button
									type="button"
									onClick={handleAddNote}
									className="bg-[#A67436] text-white hover:text-black hover:border-2 hover:border-[#A67436] hover:bg-white"
								>
									{showFields ? "เพิ่มหมายเหตุ" : "แก้ไขหมายเหตุ"}
								</Button>
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

export default ExameCommitteeFormUpdate;
