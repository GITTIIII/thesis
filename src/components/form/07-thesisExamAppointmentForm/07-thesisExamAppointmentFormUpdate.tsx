import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { IOutlineForm, IProcessPlan, IThesisExamAppointmentForm, IThesisProgressForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DatePicker } from "@/components/datePicker/datePicker";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import signature from "@/../../public/asset/signature.png";
import ThesisProcessPlan from "../thesisProcessPlan";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import useSWR, { mutate } from "swr";
import InputForm from "@/components/inputForm/inputForm";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
	id: z.number(),
	percentage: z.number(),
	processPlan: z.array(z.any()),
	assessmentResult: z.string(),
	advisorSignUrl: z.string(),
	dateAdvisor: z.date().optional(),
	headSchoolComment: z.string(),
	headSchoolSignUrl: z.string(),
	dateHeadSchool: z.date().optional(),
	headSchoolID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisProgressFormUpdate = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const { data: user } = useSWR<IUser>("/api/getCurrentUser", fetcher);
	const { data: headSchool } = useSWR<IUser[]>("/api/getHeadSchool", fetcher);
	const { data: formData } = useSWR<IThesisExamAppointmentForm>(formId ? `/api/get07FormById/${formId}` : "", fetcher);
	const { data: approvedForm } = useSWR<IOutlineForm>(formData ? `/api/get05ApprovedFormByStdId/${formData?.student.id}` : "", fetcher);
	const [processPlans, setProcessPlans] = useState<IProcessPlan[]>();
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [openAdvisor, setOpenAdvisor] = useState(false);
	const [openHeadSchool, setOpenHeadSchool] = useState(false);
	const { toast } = useToast();

	const handleDrawingSignAdvisor = (signUrl: string) => {
		reset({
			...form.getValues(),
			advisorSignUrl: signUrl,
		});
		setOpenAdvisor(false);
	};

	const handleDrawingSignHeadSchool = (signUrl: string) => {
		reset({
			...form.getValues(),
			headSchoolSignUrl: signUrl,
		});
		setOpenHeadSchool(false);
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			percentage: 0,
			processPlan: [],
			assessmentResult: "",
			advisorSignUrl: "",
			dateAdvisor: undefined as unknown as Date,
			headSchoolComment: "",
			headSchoolSignUrl: "",
			dateHeadSchool: undefined as unknown as Date,
			headSchoolID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		setLoading(true);
		if (
			(values.advisorSignUrl == "" && values.dateAdvisor != undefined) ||
			(values.headSchoolSignUrl == "" && values.headSchoolID != 0)
		) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}
		if (processPlans) {
			values.processPlan = processPlans;
		}
		const url = qs.stringifyUrl({
			url: `/api/06ThesisProgressForm`,
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
				mutate(`/api/get06FormById/${formId}`);
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
	}, [formId]);

	const handleCancel = () => {
		setLoading(false);
		setIsOpen(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
				<div className="w-full flex px-0 sm:px-10 mb-2">
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
					{/* ฝั่งซ้าย */}
					<div className="w-full">
						<InputForm value={`${formData?.trimester} `} label="ภาคเรียน / Trimester" />
						<InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา / Academic year" />
						<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
						<InputForm value={`${formData?.gpa}`} label="คะเเนนสะสมเฉลี่ย / GPA" />
						<InputForm value={`${formData?.credits}`} label="หน่วยกิต / Credits" />

						<InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
						<InputForm
							value={`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm value={`${formData?.student?.school?.schoolNameTH}`} label="สาขาวิชา / School" />
						<InputForm value={`${formData?.student?.program?.programNameTH}`} label="หลักสูตร / Program" />
						<InputForm value={`${formData?.student?.program?.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />

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
					</div>
					<div className="border-l border-[#eeee]"></div>

					{/* ฝั่งขวา */}
					<div className="w-full">
						<div className="w-full sm:w-3/4 mx-auto flex flex-col item-center justify-center rounded-lg mb-2">
							<InputForm
								value={`${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}
								label="อาจารย์ที่ปรึกษา / Advisor"
							/>
							<div className="text-center font-semibold mb-2">โครงร่างวิทยานิพนธ์</div>
							<div className="flex flex-row items-center mb-6 justify-center">
								<div className="w-[300px]">
									<Label>
										วันที่อนุมัติโครงร่างวิทยานิพนธ์ / <br />
										Thesis outline approval date
									</Label>
									<Input
										disabled
										value={`${
											approvedForm?.dateOutlineCommitteeSign
												? new Date(approvedForm?.dateOutlineCommitteeSign).toLocaleDateString("th")
												: ""
										}`}
									/>
								</div>
							</div>

							<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis Topic (TH)" />
							<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis Topic (EN)" />
							<InputForm
								value={`${formData?.dateExam ? new Date(formData?.dateExam).toLocaleDateString("th") : ""}`}
								label="วันที่นัดสอบ / Date of the examination"
							/>
						</div>

						<div className="flex flex-col items-center mt-6 mb-6 justify-center">
							<Label>ลายเซ็น / Signature</Label>
							<Button variant="outline" type="button" className="w-60 mt-4 h-max">
								<Image
									src={formData?.student.signatureUrl ? formData?.student.signatureUrl : signature}
									width={200}
									height={100}
									style={{ width: "auto", height: "auto" }}
									alt="signature"
								/>
							</Button>
							<Label className="mt-4">{`วันที่ ${
								formData?.date ? new Date(formData?.date).toLocaleDateString("th") : "__________"
							}`}</Label>
						</div>
					</div>

					<hr className="่่justify-center mx-auto w-full sm:w-max my-5 border-t-2 border-[#eeee]" />
				</div>
				<div>
					<Checkbox />
					<Checkbox />
					<Checkbox />
					<Checkbox />
				</div>
			</form>
		</Form>
	);
};

export default ThesisProgressFormUpdate;
