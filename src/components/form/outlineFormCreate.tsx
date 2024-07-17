import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import signature from "@/../../public/asset/signature.png";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import InputForm from "../inputForm/inputForm";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
	date: z.string(),
	thesisNameTH: z
		.string()
		.min(1, { message: "กรุณากรอกชื่อวิทยานิพนธ์ / Thesis name requierd" }),
	thesisNameEN: z
		.string()
		.toUpperCase()
		.min(1, { message: "กรุณากรอกชื่อวิทยานิพนธ์ / Thesis name requierd" }),
	abstract: z
		.string()
		.min(1, { message: "กรุณากรอกบทคัดย่อ / Abstract requierd" }),
	studentID: z.number(),
	advisorID: z
		.number()
		.min(1, { message: "กรุณาเลือกอาจารย์ที่ปรึกษา / Advisor requierd" }),
	coAdvisorID: z.number(),
});

async function getUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

async function getAllAdvisor() {
	const res = await fetch("/api/getAdvisor");
	return res.json();
}

const userPromise = getUser();
const allAdvisorPromise = getAllAdvisor();

const OutlineFormCreate = () => {
	const router = useRouter();
	const user: IUser = use(userPromise);
	const allAdvisor: IUser[] = use(allAdvisorPromise);
	const [loading, setLoading] = useState(false)

	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: "",
			thesisNameTH: "",
			thesisNameEN: "",
			abstract: "",
			studentID: 0,
			advisorID: 0,
			coAdvisorID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true)
		if (!user?.signatureUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
			setLoading(false)
			return;
		}
		const url = qs.stringifyUrl({
			url: `/api/outlineForm`,
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
		const today = new Date();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();
		const date = today.getDate();
		const currentDate = date + "/" + month + "/" + year;
		if (user) {
			reset({
				...form.getValues(),
				studentID: user.id,
				date: currentDate,
			});
		}
	}, [user, reset]);

	

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full h-full bg-white p-4"
			>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
						<h1 className="mb-2 font-bold text-center">ข้อมูลนักศึกษา</h1>
						<InputForm
							value={`${user?.firstName} ${user?.lastName}`}
							label="ชื่อ-นามสกุล / Full Name"
						/>
						<InputForm
							value={`${user?.username} `}
							label="รหัสนักศึกษา / Student ID"
						/>

						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel className="font-normal">
								ระดับการศึกษา / Education Level
							</FormLabel>
							<RadioGroup disabled className="space-y-1 mt-2">
								<div>
									<RadioGroupItem
										checked={user?.degree === "Master"}
										value="Master"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาโท (Master Degree)
									</FormLabel>
								</div>
								<div>
									<RadioGroupItem
										checked={user?.degree === "Doctoral"}
										value="Doctoral"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาเอก (Doctoral Degree)
									</FormLabel>
								</div>
							</RadioGroup>
						</div>

						<InputForm value={`${user?.school.schoolName}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program.programName}`} label="หลักสูตร / Program" />
						<InputForm
							value={`${user?.program.programYear}`}
							label="ปีหลักสูตร / Program Year"
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<h1 className="text-center font-semibold mb-2">
							ชื่อโครงร่างวิทยานิพนธ์
						</h1>
						<FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ชื่อภาษาไทย / ThesisName(TH)</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-[300px] m-auto  rounded-lg"
												{...field}
											/>
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
									<FormItem className="w-max">
										<FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-[300px] m-auto  rounded-lg"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="advisorID"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto flex flex-col ">
										<FormLabel>อาจารย์ที่ปรึกษา / Thesis Advisor</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-[300px] justify-between",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value
															? `${
																	allAdvisor?.find(
																		(advisor) => advisor.id === field.value
																	)?.firstName
															  } ${
																	allAdvisor?.find(
																		(advisor) => advisor.id === field.value
																	)?.lastName
															  }`
															: "เลือกอาจารย์ที่ปรึกษา"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0">
												<Command>
													<CommandInput placeholder="ค้นหาชื่ออาจารย์ที่ปรึกษา" />
													<CommandList>
														<CommandEmpty>ไม่พบอาจารย์ที่ปรึกษา</CommandEmpty>
														{allAdvisor?.map((advisor) => (
															<CommandItem
																value={`${advisor.firstName} ${advisor.lastName}`}
																key={advisor.id}
																onSelect={() => {
																	form.setValue("advisorID", advisor.id);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === advisor.id
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
																{`${advisor.firstName} ${advisor.lastName}`}
															</CommandItem>
														))}
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="coAdvisorID"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto flex flex-col items-center">
										<FormLabel>
											อาจารย์ที่ปรึกษาร่วม(ถ้ามี) / Co-Thesis Advisor (if any)
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-[300px] justify-between",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value
															? `${
																	allAdvisor?.find(
																		(advisor) => advisor.id === field.value
																	)?.firstName
															  } ${
																	allAdvisor?.find(
																		(advisor) => advisor.id === field.value
																	)?.lastName
															  }`
															: "เลือกอาจารย์ที่ปรึกษาร่วม"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0">
												<Command>
													<CommandInput placeholder="ค้นหาชื่ออาจารย์ที่ปรึกษา" />
													<CommandList>
														<CommandEmpty>ไม่พบอาจารย์ที่ปรึกษา</CommandEmpty>
														{allAdvisor?.map((advisor) => (
															<CommandItem
																value={`${advisor.firstName} ${advisor.lastName}`}
																key={advisor.id}
																onSelect={() => {
																	form.setValue("coAdvisorID", advisor.id);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === advisor.id
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
																{`${advisor.firstName} ${advisor.lastName}`}
															</CommandItem>
														))}
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel>ลายเซ็น / Signature</FormLabel>
							<Button
								variant="outline"
								type="button"
								className="w-60 mt-4 h-max"
							>
								<Image
									src={user?.signatureUrl ? user?.signatureUrl : signature}
									width={100}
									height={100}
									alt="signature"
								/>
							</Button>
						</div>
					</div>
				</div>
				<div className="w-full h-max">
					<FormField
						control={form.control}
						name="abstract"
						render={({ field }) => (
							<FormItem className="w-full h-auto flex flex-col items-center">
								<FormLabel>บทคัดย่อ / Abstract</FormLabel>
								<FormControl>
									<Textarea
										placeholder="บทคัดย่อ..."
										className="text-[16px] resize-none 
											w-full md:w-[595px] lg:w-[794px] 
											h-[842px] lg:h-[1123px] 
											p-[16px] 
											md:pt-[108px] lg:pt-[144px] 
											md:pl-[108px] lg:pl-[144px] 
											md:pr-[72px]  lg:pr-[96px] 
											md:pb-[72px]  lg:pb-[96px]"
										value={field.value}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="w-full flex mt-4 px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table`)}
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

export default OutlineFormCreate;
