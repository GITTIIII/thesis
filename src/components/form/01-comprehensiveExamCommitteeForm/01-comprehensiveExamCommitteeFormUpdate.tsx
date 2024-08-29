import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputForm from "../../inputForm/inputForm";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import Link from "next/link";
import { IComprehensiveExamCommitteeForm } from "@/interface/form";
import useSWR from "swr";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import qs from "query-string";
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form";
import signature from "../../../../public/asset/signature.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IUser } from "@/interface/user";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

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
	const [open, setOpen] = useState(false);
	const [schoolName, setSchoolName] = useState("");
	const router = useRouter();
	const { toast } = useToast();
	const sigCanvas = useRef<SignatureCanvas>(null);
	const clear = () => {
		if (sigCanvas.current) {
			sigCanvas.current.clear();
		}
	};

	const handleDrawingSign = () => {
		if (sigCanvas.current?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
			if (open) {
				reset({
					...form.getValues(),
					headSchoolSignUrl: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
				});
			}
			setOpen(false);
		}
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
				router.push("/user/table?formType=comprehensiveExamCommitteeForm");
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
		if (user && user.position.toString() === "HEAD_OF_SCHOOL") {
			reset({
				...form.getValues(),
				headSchoolID: user.id,
			});
		}
	}, [formId]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/table?formType=comprehensiveExamCommitteeForm")}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				<div className="flex flex-col justify-center md:flex-row">
					<div className="w-full sm:2/4">
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
						<InputForm value={`${formData?.student?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />
					</div>

					<div className="w-full sm:2/4">
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
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger onClick={() => setOpen(!open)}>
									<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										<Image
											src={form.getValues().headSchoolSignUrl ? form.getValues().headSchoolSignUrl : signature}
											width={100}
											height={100}
											style={{
												width: "auto",
												height: "auto",
											}}
											alt="signature"
										/>
									</div>
								</DialogTrigger>
								<DialogContent className="w-max">
									<DialogHeader>
										<DialogTitle>ลายเซ็น</DialogTitle>
									</DialogHeader>
									<div className="w-full h-max flex justify-center mb-6 border-2">
										<SignatureCanvas
											ref={sigCanvas}
											backgroundColor="white"
											throttle={8}
											canvasProps={{
												width: 400,
												height: 150,
												className: "sigCanvas",
											}}
										/>
									</div>
									<div className="w-full h-full flex justify-center">
										<Button
											variant="outline"
											type="button"
											onClick={() => clear()}
											className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ล้าง
										</Button>
										<Button
											variant="outline"
											type="button"
											onClick={() => handleDrawingSign()}
											className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ยืนยัน
										</Button>
									</div>
								</DialogContent>
							</Dialog>
							{formData?.headSchoolID ? (
								<Label className="mb-2">
									{`${formData?.headSchool.prefix.prefixTH}${formData?.headSchool.firstNameTH} ${formData?.headSchool.lastNameTH}`}
								</Label>
							) : (
								<FormField
									control={form.control}
									name="headSchoolID"
									render={({ field }) => (
										<>
											<Popover>
												<PopoverTrigger asChild disabled={user?.role.toString() != "SUPER_ADMIN"}>
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
																			?.prefix.prefixTH
																  } ${
																		headSchool?.find((headSchool) => headSchool.id === field.value)
																			?.firstNameTH
																  } ${
																		headSchool?.find((headSchool) => headSchool.id === field.value)
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
																	value={`${headSchool.prefix.prefixTH}${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
																	key={headSchool.id}
																	onSelect={() => {
																		form.setValue("headSchoolID", headSchool.id);
																		setSchoolName(headSchool.school.schoolNameTH);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			field.value === headSchool.id ? "opacity-100" : "opacity-0"
																		)}
																	/>
																	{`${headSchool.prefix.prefixTH}${headSchool.firstNameTH} ${headSchool.lastNameTH}`}
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
								form.getValues().headSchoolID === user?.id ? user.school.schoolNameTH : schoolName
							}`}</Label>
						</div>
					</div>
				</div>
				<div className="w-full flex px-20 mt-4 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table?formType=comprehensiveExamCommitteeForm`)}
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

export default ComprehensiveExamCommitteeFormUpdate;
