import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IUser } from "@/interface/user";
import { IOutlineCommitteeForm } from "@/interface/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import useSWR from "swr";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { DatePicker } from "@/components/datePicker/datePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CircleAlert } from "lucide-react";
import signature from "../../../../public/asset/signature.png";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
	id: z.number(),
	trimester: z
		.number()
		.min(1, { message: "กรุณาระบุภาคเรียน / Trimester required" })
		.max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
	academicYear: z.number().min(1, { message: "กรุณากรอกปีการศึกษา / Academic year required" }),
	committeeMembers: z
		.array(z.object({ name: z.string().min(1, { message: "กรุณากรอกชื่อกรรมการ / Committee member required" }) }))
		.min(5, { message: "กรุณาเพิ่มกรรมการอย่างน้อย 5 คน / At least 5 committee members required" }),
	times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times required" }),
	examDate: z.date({ message: "กรุณาเลือกวันที่สอบ / Exam's date is required." }),
	headSchoolID: z.number(),
	headSchoolSignUrl: z.string(),
	advisorSignUrl: z.string(),

	studentID: z.number(),
});

export default function SuperAdminForm03Update({ formId }: { formId: number }) {
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: formData } = useSWR<IOutlineCommitteeForm>(`/api/get03FormById/${formId}`, fetcher);
	const [loading, setLoading] = useState(false);
	const [openHeadSchoolDialog, setOpenHeadSchoolDialog] = useState(false);
	const [openAdvisorDialog, setOpenAdvisorDialog] = useState(false);
	const router = useRouter();
	const sigCanvasHeadSchool = useRef<SignatureCanvas>(null);
	const sigCanvasAdvisor = useRef<SignatureCanvas>(null);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			times: 0,
			trimester: 0,
			academicYear: 0,
			committeeMembers: [{ name: "" }],
			examDate: undefined as unknown as Date,

			id: formId,
			headSchoolSignUrl: formData?.headSchoolSignUrl || "",
			advisorSignUrl: formData?.advisorSignUrl || "",
			headSchoolID: 0,
			studentID: 0,
		},
	});

	const clear = (type: "headSchool" | "advisor") => {
		if (type === "headSchool" && sigCanvasHeadSchool.current) {
			sigCanvasHeadSchool.current.clear();
		}
		if (type === "advisor" && sigCanvasAdvisor.current) {
			sigCanvasAdvisor.current.clear();
		}
	};

	const handleDrawingSign = (type: "headSchool" | "advisor") => {
		const canvas = type === "headSchool" ? sigCanvasHeadSchool.current : sigCanvasAdvisor.current;

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
			}
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("Submitting form with values:", values);
		setLoading(true);

		if (!values.headSchoolSignUrl && values.headSchoolID !== 0) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็นหัวหน้าสาขาวิชา",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		if (!values.advisorSignUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็นอาจารย์ที่ปรึกษา",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		const url = qs.stringifyUrl({
			url: `/api/03ThesisOutlineCommitteeForm`,
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
					router.push("/user/table?formType=thesisOutlineCommitteeForm");
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
				headSchoolID: formData.headSchoolID || 0,
			});
		}
		if (user && user.position.toString() === "HEAD_OF_SCHOOL") {
			form.setValue("headSchoolID", user.id);
		}
	}, [formId, formData, user]);

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

						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="font-bold">ลายเซ็นหัวหน้าสาขาวิชา</h1>
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

						<div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
							<h1 className="font-bold">ลายเซ็นอาจารย์ที่ปรึกษา</h1>
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
