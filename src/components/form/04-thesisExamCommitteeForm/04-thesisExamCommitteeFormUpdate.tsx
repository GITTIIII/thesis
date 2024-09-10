import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SignatureCanvas from "react-signature-canvas";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { Label } from "../../ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import { IExamCommitteeForm } from "@/interface/form";
import useSWR from "swr";
import Link from "next/link";
import { DatePicker } from "@/components/datePicker/datePicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
	id: z.number(),
	headSchoolID: z.number().nullable(),
	headSchoolSignUrl: z.string(),
	advisorSignUrl: z.string(),
	instituteComSignUrl: z.string(),
	addNotes: z.array(
		z.object({
			committeeNumber: z.number().min(1, { message: "กรุณาระบุลำดับของกรรมการ / number of committee requierd" }),
			meetingNumber: z.number().min(1, { message: "กรุณาระบุครั้งของการประชุม / number of meeting requierd" }),
			date: z.date().nullable(),
		})
	),
});
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ExameCommitteeFormUpdate = ({ formId }: { formId: number }) => {
	const { data: formData, isLoading } = useSWR<IExamCommitteeForm>(`/api/get04FormById/${formId}`, fetcher);
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const [loading, setLoading] = useState(false);
	const [openHeadSchoolDialog, setOpenHeadSchoolDialog] = useState(false);
	const [openAdvisorDialog, setOpenAdvisorDialog] = useState(false);
	const [openinstituteComDialog, setOpeninstituteComDialog] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const sigCanvasHeadSchool = useRef<SignatureCanvas>(null);
	const sigCanvasAdvisor = useRef<SignatureCanvas>(null);
	const sigCanvasinstituteCom = useRef<SignatureCanvas>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: formId,
			headSchoolSignUrl: formData?.headSchoolSignUrl || "",
			advisorSignUrl: formData?.advisorSignUrl || "",
			headSchoolID: 0,
			instituteComSignUrl: formData?.instituteComSignUrl || "",
			addNotes:
				formData?.addNotes && formData.addNotes.length > 0
					? formData.addNotes
					: [{ committeeNumber: 0, meetingNumber: 0, date: null }],
		},
	});
	const { control, handleSubmit, reset } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "addNotes",
	});

	const clear = (type: "headSchool" | "advisor" | "instituteCom") => {
		if (type === "headSchool" && sigCanvasHeadSchool.current) {
			sigCanvasHeadSchool.current.clear();
		}
		if (type === "advisor" && sigCanvasAdvisor.current) {
			sigCanvasAdvisor.current.clear();
		}
		if (type === "instituteCom" && sigCanvasinstituteCom.current) {
			sigCanvasinstituteCom.current.clear();
		}
	};

	const handleDrawingSign = (type: "headSchool" | "advisor" | "instituteCom") => {
		const canvas =
			type === "headSchool"
				? sigCanvasHeadSchool.current
				: type === "advisor"
				? sigCanvasAdvisor.current
				: sigCanvasinstituteCom.current;

		if (canvas?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		}

		if (canvas) {
			const newSignUrl = canvas.getTrimmedCanvas().toDataURL("image/png");

			if (type === "headSchool") {
				form.setValue("headSchoolSignUrl", newSignUrl);
				setOpenHeadSchoolDialog(false);
			} else if (type === "advisor") {
				form.setValue("advisorSignUrl", newSignUrl);
				setOpenAdvisorDialog(false);
			} else if (type === "instituteCom") {
				form.setValue("instituteComSignUrl", newSignUrl);
				setOpeninstituteComDialog(false);
			}
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("Submitting form with values:", values);
		setLoading(true);

		if (user && user.position.toString()==="headSchool" && !values.headSchoolSignUrl && values.headSchoolID !== 0) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็นหัวหน้าสาขาวิชา",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		if (user && user.position.toString()==="advisor"&&!values.advisorSignUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็นอาจารย์ที่ปรึกษา",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}
		
		if (user && user.position.toString()==="instituteCom" &&!values.instituteComSignUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็นอาจารย์ที่ปรึกษา",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		const url = qs.stringifyUrl({
			url: `/api/04ThesisExamCommitteeForm`,
		});

		try {
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
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (formData) {
			form.reset({
				id: formId,
				headSchoolSignUrl: formData.headSchoolSignUrl || "",
				advisorSignUrl: formData.advisorSignUrl || "",
				headSchoolID: formData.headSchoolID || null,
				instituteComSignUrl: formData.instituteComSignUrl || "",
				addNotes: formData.addNotes.length > 0 ? formData.addNotes : [{ committeeNumber: 0, meetingNumber: 0, date: null }],
			});
		}
		if (user && user.position.toString() === "HEAD_OF_SCHOOL") {
			form.setValue("headSchoolID", user.id);
		}
	}, [formId, formData, user]);

	const [showFields, setShowFields] = useState(false);
	const handleAddNote = () => {
		setShowFields(true);
		append({ committeeNumber: 0, meetingNumber: 0, date: null });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="w-full flex px-0 lg:px-20 mb-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/user/table")}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
					>
						ย้อนกลับ
					</Button>
				</div>
				{/* ฝั่งซ้าย */}
				<div className="flex flex-col justify-center md:flex-row ">
					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
						<InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
						<InputForm value={`${formData?.trimester}`} label="ภาคเรียน / Trimester" />
						<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา / Academic year" />
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
						<InputForm value={`${formData?.student?.school.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student.program.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
						<div className="flex items-center justify-center text-sm">
							<CircleAlert className="mr-1" />
							สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
							<Button type="button" variant="link" className="p-1 text-[#A67436]">
								<Link href="/user/expertTable">คลิกที่นี่</Link>
							</Button>
						</div>
						{formData?.committeeMembers.map((member, index) => (
							<InputForm key={index} value={`${member.name}`} label="กรรมการ / Committee" />
						))}
					</div>
				</div>
				<div className="flex item-center justify-center ">
					<div className="w-3/4 flex flex-col item-center justify-center md:flex-row border-2 rounded-lg py-5 my-5 border-[#eeee] ">
						<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
							{/* อาจารย์ที่ปรึกษา */}
							<div className="text-center mb-2">
								อาจารย์ที่ปรึกษา / <br />
								Thesis advisor
							</div>
							<Dialog open={openAdvisorDialog} onOpenChange={setOpenAdvisorDialog}>
								<DialogTrigger onClick={() => setOpenAdvisorDialog(true)}>
									<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										<Image
											src={form.getValues().advisorSignUrl || "/asset/signature.png"}
											width={120}
											height={120}
											alt="Signature"
										/>
									</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>เซ็นลายเซ็นอาจารย์ที่ปรึกษา</DialogTitle>
									</DialogHeader>
									<div className="w-full h-max flex justify-center mb-6 border-2">
										<SignatureCanvas
											ref={sigCanvasAdvisor}
											penColor="black"
											canvasProps={{ width: 300, height: 150, className: "signature-canvas" }}
										/>
									</div>
									<div className="w-full h-full flex justify-center">
										<Button
											type="button"
											onClick={() => clear("advisor")}
											className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ล้าง
										</Button>
										<Button
											type="button"
											onClick={() => handleDrawingSign("advisor")}
											className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											บันทึก
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>

						{/* หัวหน้าสาขาวิชา */}
						<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
							<div className="text-center mb-2">
								หัวหน้าสาขาวิชา / <br />
								Chair of the School
							</div>
							<Dialog open={openHeadSchoolDialog} onOpenChange={setOpenHeadSchoolDialog}>
								<DialogTrigger onClick={() => setOpenHeadSchoolDialog(true)}>
									<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										<Image
											src={form.getValues().headSchoolSignUrl || "/asset/signature.png"}
											width={120}
											height={120}
											alt="Signature"
										/>
									</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>เซ็นลายเซ็นหัวหน้าสาขาวิชา</DialogTitle>
									</DialogHeader>
									<div className="w-full h-max flex justify-center mb-6 border-2">
										<SignatureCanvas
											ref={sigCanvasHeadSchool}
											penColor="black"
											canvasProps={{ width: 300, height: 150, className: "signature-canvas" }}
										/>
									</div>
									<div className="w-full h-full flex justify-center">
										<Button
											type="button"
											onClick={() => clear("headSchool")}
											className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ล้าง
										</Button>
										<Button
											type="button"
											onClick={() => handleDrawingSign("headSchool")}
											className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											บันทึก
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>

						{/* ประธานคณะทำงานวิชาการ */}
						<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
							<div className="text-center mb-2">
								ประธานคณะทำงานวิชาการ / <br />
								Associate Dean for Academic Affairs
							</div>
							<Dialog open={openinstituteComDialog} onOpenChange={setOpeninstituteComDialog}>
								<DialogTrigger onClick={() => setOpeninstituteComDialog(true)}>
									<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										<Image
											src={form.getValues().instituteComSignUrl || "/asset/signature.png"}
											width={120}
											height={120}
											alt="Signature"
										/>
									</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>เซ็นลายเซ็นประธานคณะทำงานวิชาการ</DialogTitle>
									</DialogHeader>
									<div className="w-full h-max flex justify-center mb-6 border-2">
										<SignatureCanvas
											ref={sigCanvasinstituteCom}
											penColor="black"
											canvasProps={{ width: 300, height: 150, className: "signature-canvas" }}
										/>
									</div>
									<div className="w-full h-full flex justify-center">
										<Button
											type="button"
											onClick={() => clear("instituteCom")}
											className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											ล้าง
										</Button>
										<Button
											type="button"
											onClick={() => handleDrawingSign("instituteCom")}
											className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
										>
											บันทึก
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</div>
				<div className="w-3/4 text-sm mx-auto p-5 border-2 rounded-lg my-5 border-[#eeee]">
					<div className="font-bold underline text-center my-2">หมายเหตุ / Note</div>
					<div className="flex flex-col items-center justify-center md:flex-row">
						<div className="w-full sm:w-3/4 flex flex-col justify-center items-center ml-4">
							{formData?.addNotes &&
								formData?.addNotes.map((field, index) => (
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
								))}
							{showFields &&
								fields.map((field, index) => (
									<FormItem key={field.id} className="m-5 w-full">
										<div className="flex flex-wrap items-center justify-center  space-x-3 whitespace-nowrap">
											<FormField
												control={form.control}
												name={`addNotes.${index}.committeeNumber`}
												render={({ field }) => (
													<div className="flex items-center space-x-2 my-2">
														<FormLabel>กรรมการลำดับที่</FormLabel>
														<Input
															type="number"
															value={field.value ? field.value : ""}
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
															value={field.value ? field.value : ""}
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
															onDateChange={field.onChange}
															value={field.value ? new Date(field.value) : undefined}
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

export default ExameCommitteeFormUpdate;
