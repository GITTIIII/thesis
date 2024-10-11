"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/interface/user";
import { IOutlineCommitteeForm } from "@/interface/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const formSchema = z.object({
	id: z.number(),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester required" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z.number().min(1, { message: "กรุณากรอกปีการศึกษา (พ.ศ.) / Academic year (B.E.) required" }),
	committeeMembers: z
		.array(z.object({ name: z.string().min(1, { message: "กรุณากรอกชื่อกรรมการ / Committee member required" }) }))
		.min(5, { message: "กรุณาเพิ่มกรรมการอย่างน้อย 5 คน / At least 5 committee members required" }),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times required" }),
	examDate: z.date({ message: "กรุณาเลือกวันที่สอบ / Exam's date is required." }),
	headSchoolID: z.number(),
	headSchoolSignUrl: z.string().default(""),
	advisorSignUrl: z.string().default(""),
	instituteComSignUrl: z.string().default(""),
	addNotes: z.array(
		z.object({
			committeeNumber: z.number(),
			meetingNumber: z.number(),
			date: z.date().optional(),
		})
	),

	studentID: z.number(),
});

export default function SuperAdminForm03Update({
	formData,
	user,
	headSchool,
}: {
	formData: IOutlineCommitteeForm;
	user: IUser;
	headSchool: IUser[];
}) {
	const [loading, setLoading] = useState(false);
	const [openHeadSchoolDialog, setOpenHeadSchoolDialog] = useState(false);
	const [openAdvisorDialog, setOpenAdvisorDialog] = useState(false);
	const [openinstituteComDialog, setOpeninstituteComDialog] = useState(false);
	const [showFields, setShowFields] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			times: 0,
			trimester: 0,
			academicYear: 0,
			committeeMembers: [{ name: "" }],
			examDate: undefined as unknown as Date,

			id: 0,
			headSchoolID: 0,
			headSchoolSignUrl: "",
			advisorSignUrl: "",
			instituteComSignUrl: "",
			addNotes: formData.addNotes || [{ committeeNumber: 0, meetingNumber: 0, date: undefined as unknown as Date }],
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
			url: process.env.NEXT_PUBLIC_URL + `/api/03ThesisOutlineCommitteeForm`,
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
		append({ committeeNumber: 0, meetingNumber: 0, date: undefined as unknown as Date });
	};

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	useEffect(() => {
		const errorKeys = Object.keys(errors);
		if (errorKeys.length > 0) {
			handleCancel()
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
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
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full ">
						<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
						<InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
						<div className="m-auto w-[300px] mb-6">
							<Label className="text-sm font-medium">ภาคเรียน / Trimester</Label>
							<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData.trimester === 1} value="1" />
									<Label className="ml-2 font-normal">1</Label>
								</div>
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData.trimester === 2} value="2" />
									<Label className="ml-2 font-normal">2</Label>
								</div>
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData.trimester === 3} value="3" />
									<Label className="ml-2 font-normal">3</Label>
								</div>
							</RadioGroup>
						</div>
						<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา (พ.ศ.) / Academic year (B.E.)" />
						<InputForm
							value={formData?.examDate ? new Date(formData?.examDate).toLocaleDateString("th") : ""}
							label="วันที่สอบ / Date of the examination"
						/>

						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.student.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`}
							label="ชื่อ-นามสกุล / Full name"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program year (B.E.)" />
					</div>

					<div className="w-full ">
						<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
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

						<div className="flex item-center justify-center ">
							<div className="w-full flex flex-col item-center justify-center md:flex-row border-2 rounded-lg py-5 my-5 border-[#eeee] ">
								{(user.role == "SUPER_ADMIN" || user.position == "ADVISOR") && (
									<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
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
											<Label className="mb-2">{`${formData?.headSchool?.firstNameTH} ${formData?.headSchool?.lastNameTH}`}</Label>
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
																					headSchool?.find(
																						(headSchool) => headSchool.id === field.value
																					)?.firstNameTH
																			  } ${
																					headSchool?.find(
																						(headSchool) => headSchool.id === field.value
																					)?.lastNameTH
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
																						field.value === headSchool.id
																							? "opacity-100"
																							: "opacity-0"
																					)}
																				/>
																				{`${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
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
								{user.role == "SUPER_ADMIN" && (
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
}
