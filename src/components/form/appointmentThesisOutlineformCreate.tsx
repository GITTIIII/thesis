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

const AppointmentOutlineFormCreate = () => {
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
					<FormField
							control={form.control}
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-max">
										<FormLabel>อว 7414 </FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-[300px] m-auto  rounded-lg"
												type="int"
												{...field}
												placeholder="xxx / xxx"
											/>
											
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<InputForm
							value={`${user?.username} `}
							label="ข้าพเจ้า / I"
						/>

						<FormField
							control={form.control}
							name="advisorID"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto flex flex-col ">
										<FormLabel>เป็นที่ปรึกษาของ / the advisor of </FormLabel>
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
															: "ค้นหารายชึ่อนักศึกษา"}
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
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-max">
										<FormLabel>รหัสนักศึกษา / Enrollment no.</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-[300px] m-auto  rounded-lg"
												type="int"
												{...field}
												
											/>
											
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
						<InputForm value={`${user?.school.schoolName}`} label="สาขาวิชา / School" />
						<InputForm value={`${user?.program.programName}`} label="หลักสูตร / Program" />
						<InputForm
							value={`${user?.program.programYear}`}
							label="ปีหลักสูตร / Program Year"
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<FormLabel>ประธานกรรมการ / Head of the committee</FormLabel>
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
										<FormLabel>กรรมการ (อาจารย์ที่ปรึกษาวิทยานิพนธ์) / Member of the committee (advisor)</FormLabel>
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
										<FormLabel>กรรมการ(อาจารย์ที่ปรึกษาร่วม) ถ้ามี / Member of the committee (advisor)</FormLabel>
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
										<FormLabel>กรรมการ / Member of the committee(advisor)</FormLabel>
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
										<FormLabel>กรรมการ / Member of the committee (advisor)</FormLabel>
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
	
					</div>
				</div>
			
				<div className="w-3/4 text-sm mx-auto p-5  border-2 rounded-lg my-5 border-[#eeee] ">
					<div className="font-bold underline"> หมายเหตุ / Note</div>
					<div className="flex flex-col item-center justify-center md:flex-row">
					<div className="w-full sm:2/4 flex flex-col justify-center item-center ml-4">
					
						<FormField
							control={form.control}
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center my-6 justify-center">
									<FormItem className="w-max">
										<FormLabel>1. กรรมการลำดับที่</FormLabel>
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
						<div className="w-full flex item-center justify-center">
							<p className="w-[300px]">ได้รับความเห็นชอบรับรองผู้ทรงคุณวุฒิเป็นผู้เชี่ยวชาญตามมติที่ประชุมคณะกรรมการประจำสำนักวิชา</p>
						</div>
						<FormField
							control={form.control}
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center my-6 justify-center">
									<FormItem className="w-max">
										<FormLabel>ประจำการประชุมครั้งที่ </FormLabel>
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
										<FormLabel>เมื่อวันที่ </FormLabel>
										<FormControl>
											<Input
												type="date"
												className="text-sm p-2 w-[300px] m-auto rounded-lg"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
					</div> 
					<div className="w-full sm:2/4 ml-4">
					<FormField
							control={form.control}
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center my-6 justify-center">
									<FormItem className="w-max">
										<FormLabel>2. กรรมการลำดับที่</FormLabel>
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
						<div className="w-full flex item-center justify-center">
							<p className="w-[300px]">ได้รับความเห็นชอบรับรองผู้ทรงคุณวุฒิเป็นผู้เชี่ยวชาญตามมติที่ประชุมคณะกรรมการประจำสำนักวิชา</p>
						</div>
						<FormField
							control={form.control}
							name="thesisNameEN"
							render={({ field }) => (
								<div className="flex flex-row items-center my-6 justify-center">
									<FormItem className="w-max">
										<FormLabel>ประจำการประชุมครั้งที่ </FormLabel>
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
										<FormLabel>เมื่อวันที่ </FormLabel>
										<FormControl>
											<Input
												type="date"
												className="text-sm p-2 w-[300px] m-auto  rounded-lg"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>
					</div>
					</div>
				</div>
				<div className="flex item-center justify-center">
				<div className="w-3/4 flex flex-col item-center justify-center md:flex-row">
					<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
							<div className="text-center mb-2">อาจารย์ที่ปรึกษา / <br />Thesis advisor</div>
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
						<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
							<div className="text-center mb-2">หัวหน้าสาขาวิชา / <br />Chair of the School</div>
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
						<div className="w-full sm:1/3 flex flex-col items-center mb-6 justify-center">
							<div className="text-center mb-2">ประธานคณะทำงานวิชาการ / <br />Associate Dean for Academic Affairs</div>
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

export default AppointmentOutlineFormCreate;



					// Input box
					// <FormField
					// 		control={form.control}
					// 		name="thesisNameEN"
					// 		render={({ field }) => (
					// 			<div className="flex flex-row items-center mb-6 justify-center">
					// 				<FormItem className="w-max">
					// 					<FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
					// 					<FormControl>
					// 						<Input
					// 							className="text-sm p-2 w-[300px] m-auto  rounded-lg"
					// 							{...field}
					// 						/>
					// 					</FormControl>
					// 					<FormMessage />
					// 				</FormItem>
					// 			</div>
					// 		)}
					// 	/>


					//Get Data Box
					// <InputForm
					// 		value={`${user?.firstName} ${user?.lastName}`}
					// 		label="ชื่อ-นามสกุล / Full Name"
					// 	/>