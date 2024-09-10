import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import { IComprehensiveExamCommitteeForm } from "@/interface/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IUser } from "@/interface/user";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import axios from "axios";
import InputForm from "../../inputForm/inputForm";
import Link from "next/link";
import useSWR from "swr";
import qs from "query-string";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
	id: z.number(),
	headSchoolID: z.number(),
	headSchoolSignUrl: z.string(),
});

const ComprehensiveExamCommitteeFormUpdate = ({ formId }: { formId: number }) => {
	const { data: formData, isLoading } = useSWR<IComprehensiveExamCommitteeForm>(`/api/get01FormById/${formId}`, fetcher);
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: headSchool } = useSWR<IUser[]>("/api/getHeadSchool", fetcher);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [openSign, setOpenSign] = useState(false);
	const [schoolName, setSchoolName] = useState("");
	const router = useRouter();
	const { toast } = useToast();

	const handleDrawingSign = (signUrl: string) => {
		reset({
			...form.getValues(),
			headSchoolSignUrl: signUrl,
		});
		setOpenSign(false);
		console.log(signUrl);
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			headSchoolID: 0,
			headSchoolSignUrl: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		if (values.headSchoolSignUrl == "" && values.headSchoolID != 0) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}
		const url = qs.stringifyUrl({
			url: `/api/01ComprehensiveExamCommitteeForm`,
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

	const { reset } = form;

	useEffect(() => {
		reset({
			...form.getValues(),
			id: formId,
		});
		if (user && user.position === "HEAD_OF_SCHOOL") {
			reset({
				...form.getValues(),
				headSchoolID: user.id,
			});
		}
	}, [formId]);

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.back()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full">
						<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
						<InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
						<InputForm value={`${formData?.trimester}`} label="ภาคเรียน / Trimester" />
						<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา / Academic year" />
						<InputForm
							value={formData?.examDay ? new Date(formData?.examDay).toLocaleDateString("th") : ""}
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
						<InputForm value={`${formData?.student.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />
					</div>

					<div className="w-full">
						<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
						<div className="flex items-center justify-center text-sm">
							<CircleAlert className="mr-1" />
							สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
							<Button variant="link" className="p-1 text-[#A67436]">
								<Link href="/user/expertTable">คลิกที่นี่</Link>
							</Button>
						</div>
						<InputForm value={`${formData?.committeeName1}`} label="ประธานกรรมการ / Head of the Committee" />
						<InputForm value={`${formData?.committeeName2}`} label="กรรมการ / Member of the Committee" />
						<InputForm value={`${formData?.committeeName3}`} label="กรรมการ / Member of the Committee" />
						<InputForm value={`${formData?.committeeName4}`} label="กรรมการ / Member of the Committee" />
						<InputForm value={`${formData?.committeeName5}`} label="กรรมการ / Member of the Committee" />

						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="font-bold">ลายเซ็นหัวหน้าสาขาวิชา</h1>
							<SignatureDialog
								signUrl={form.getValues("headSchoolSignUrl")}
								onConfirm={handleDrawingSign}
								isOpen={openSign}
								setIsOpen={setOpenSign}
							/>
							{formData?.headSchoolID ? (
								<Label className="mb-2">
									{`${formData?.headschool?.prefix.prefixTH}${formData?.headschool?.firstNameTH} ${formData?.headschool?.lastNameTH}`}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="headSchoolID"
									render={({ field }) => (
										<>
											<Popover>
												<PopoverTrigger asChild disabled={user?.role != "SUPER_ADMIN"}>
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
																		headSchool?.find((headSchool) => headschool?.id === field.value)
																			?.prefix.prefixTH
																  } ${
																		headSchool?.find((headSchool) => headschool?.id === field.value)
																			?.firstNameTH
																  } ${
																		headSchool?.find((headSchool) => headschool?.id === field.value)
																			?.lastNameTH
																  } `
																: "เลือกหัวหน้าสาขา"}
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
																	value={`${headschool?.prefix.prefixTH}${headschool?.firstNameTH} ${headschool?.lastNameTH}`}
																	key={headschool?.id}
																	onSelect={() => {
																		form.setValue("headSchoolID", headschool?.id);
																		setSchoolName(headschool?.school?.schoolNameTH);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			field.value === headschool?.id ? "opacity-100" : "opacity-0"
																		)}
																	/>
																	{`${headschool?.prefix.prefixTH}${headschool?.firstNameTH} ${headschool?.lastNameTH}`}
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
							<Label className="my-2">{`หัวหน้าสาขาวิชา ${
								form.getValues().headSchoolID === user?.id ? user.school?.schoolNameTH : schoolName
							}`}</Label>
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

export default ComprehensiveExamCommitteeFormUpdate;
