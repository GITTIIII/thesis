"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { use, useEffect, useState } from "react";

import Image from "next/image";
import createUser from "@../../../public/asset/createUser.png";
import CreateUsers from "./createStudentExel";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { IInstitute } from "@/interface/institute";
import { IProgram } from "@/interface/program";
import { ISchool } from "@/interface/school";
import { IUser } from "@/interface/user";
import useSWR from "swr";
const formSchema = z.object({
	prefixTH: z.string().min(1, { message: "กรุณาเลือกคำนำหน้า / Please select prefix" }),
	firstNameTH: z.string().min(1, { message: "กรุณากรอกชื่อ / First name requierd" }),
	lastNameTH: z.string().min(1, { message: "กรุณากรอกนามสกุล / Last name requierd" }),
	username: z.string().min(1, { message: "กรุณากรอกรหัสนักศึกษา / Student ID requierd" }),
	password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน / Password requierd" }),
	email: z.string().min(1, { message: "กรุณาอีเมล / Email requierd" }),
	phone: z.string(),
	sex: z.string(),
	degree: z.string().min(1, { message: "กรุณาเลือกระดับการศึกษา / Please select degree" }),
	instituteID: z.number().min(1, { message: "กรุณาเลือกสำนักวิชา / Please select institute" }),
	schoolID: z.number().min(1, { message: "กรุณาเลือกสาขาวิชา / Please select school" }),
	programID: z.number().min(1, { message: "กรุณาเลือกหลักสูตร / Please select program" }),
	position: z.string(),
	role: z.string(),
	formState: z.number(),
	advisorID: z.number().min(1, { message: "กรุณาเลือกอาจารย์ที่ปรึกษา / Please select advisor" }),
});
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateStudent() {

  const { data: instituteData = [] } = useSWR<IInstitute[]>(process.env.NEXT_PUBLIC_URL + "/api/institute", fetcher);
  const { data: schoolData = [] } = useSWR<ISchool[]>(process.env.NEXT_PUBLIC_URL + "/api/school", fetcher);
  const { data: programData = [] } = useSWR<IProgram[]>(process.env.NEXT_PUBLIC_URL + "/api/program", fetcher);
  const { data: allAdvisor = [] } = useSWR<IUser[]>(process.env.NEXT_PUBLIC_URL + "/api/getAdvisor", fetcher);

	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prefixTH: "",
			firstNameTH: "",
			lastNameTH: "",
			username: "",
			password: "",
			email: "",
			phone: "",
			sex: "",
			degree: "",
			instituteID: 0,
			schoolID: 0,
			programID: 0,
			position: "NONE",
			role: "STUDENT",
			formState: 1,
			advisorID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		console.log(values);
		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/user`,
		});

		try {
			const res = await axios.post(url, values);
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			setTimeout(() => {
				form.reset();
				router.refresh();
				router.push("/user/superAdmin/user");
			}, 1000);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toast({
					title: "Error",
					description: err.response?.data?.message || "An error occurred",
					variant: "destructive",
				});
			}
		}
	};

	const { reset } = form;

	useEffect(() => {
		reset({
			...form.getValues(),
			schoolID: 0,
			programID: 0,
			advisorID: 0,
		});
	}, [form.watch("instituteID")]);

	useEffect(() => {
		reset({
			...form.getValues(),
			programID: 0,
			advisorID: 0,
		});
	}, [form.watch("schoolID")]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white flex flex-col">
				{/* เเถวซ้าย */}
				<div className="w-full 2xl:w-1/2 px-4 mx-auto mb-4">
					<FormField
						control={form.control}
						name="prefixTH"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="prefix">
									คำนำหน้า / Prefix <span className="text-red-500">*</span>
								</FormLabel>
								<Select onValueChange={(value) => field.onChange(value)} value={field.value}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="คำนำหน้า" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="นาย">นาย</SelectItem>
											<SelectItem value="นาง">นาง</SelectItem>
											<SelectItem value="นางสาว">นางสาว</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="firstNameTH"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="firstName">
									ชื่อ / First name <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="lastNameTH"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="lastName">
									นามสกุล / Last name <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="username">
									รหัสนักศึกษา / Student ID <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="password">
									รหัสผ่าน / Password <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="email">
									อีเมล / Email <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="phone">เบอร์โทร / Telephone</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="sex"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="sex">เพศ / Sex</FormLabel>
								<Select onValueChange={(value) => field.onChange(value)} value={field.value}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="เพศ" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="Male">ชาย</SelectItem>
											<SelectItem value="Female">หญิง</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</div>
						)}
					/>

					<FormField
						control={form.control}
						name="degree"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel htmlFor="degree">
									ระดับการศึกษา / Degree <span className="text-red-500">*</span>
								</FormLabel>
								<Select onValueChange={(value) => field.onChange(value)} value={field.value}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="ระดับการศึกษา" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="Master">ปริญญาโท</SelectItem>
											<SelectItem value="Doctoral">ปริญญาเอก</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="instituteID"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel>
									สำนักวิชา / Institute <span className="text-red-500">*</span>
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn("w-full justify-between ", !field.value && "text-muted-foreground")}
											>
												{field.value
													? `${
															instituteData?.find((instituteData) => instituteData.id === field.value)
																?.instituteNameTH
													  } `
													: "เลือกสำนักวิชา"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="ค้นหาสำนักวิชา" />
											<CommandList>
												<CommandEmpty>ไม่พบสำนักวิชา</CommandEmpty>
												{instituteData?.map((instituteData) => (
													<CommandItem
														value={`${instituteData.instituteNameTH}`}
														key={instituteData.id}
														onSelect={() => {
															form.setValue("instituteID", instituteData.id);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																field.value === instituteData.id ? "opacity-100" : "opacity-0"
															)}
														/>
														{instituteData.instituteNameTH}
													</CommandItem>
												))}
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="schoolID"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel>
									สาขาวิชา / School <span className="text-red-500">*</span>
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
											>
												{field.value
													? `${schoolData?.find((schoolData) => schoolData.id === field.value)?.schoolNameTH} `
													: "เลือกสาขาวิชา"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="ค้นหาสาขาวิชา" />
											<CommandList>
												<CommandEmpty>ไม่พบสาขาวิชา</CommandEmpty>
												{schoolData
													?.filter((schoolData) => schoolData.instituteID == form.watch("instituteID"))
													.map((schoolData) => (
														<CommandItem
															value={`${schoolData.schoolNameTH}`}
															key={schoolData.id}
															onSelect={() => {
																form.setValue("schoolID", schoolData.id);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	field.value === schoolData.id ? "opacity-100" : "opacity-0"
																)}
															/>
															{schoolData.schoolNameTH}
														</CommandItem>
													))}
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="programID"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel>
									หลักสูตร / Program <span className="text-red-500">*</span>
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
											>
												{field.value
													? `${
															programData?.find((programData) => programData.id === field.value)
																?.programNameTH
													  } `
													: "เลือกหลักสูตร"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="ค้นหาหลักสูตร" />
											<CommandList>
												<CommandEmpty>ไม่พบหลักสูตร</CommandEmpty>
												{programData.map((programData) => (
													<CommandItem
														value={`${programData.programNameTH}`}
														key={programData.id}
														onSelect={() => {
															form.setValue("programID", programData.id);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																field.value === programData.id ? "opacity-100" : "opacity-0"
															)}
														/>
														{programData.programNameTH}
													</CommandItem>
												))}
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="advisorID"
						render={({ field }) => (
							<div className="space-y-1 mb-2">
								<FormLabel>
									อาจารย์ที่ปรึกษา / Advisor <span className="text-red-500">*</span>
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
											>
												{field.value
													? `${allAdvisor?.find((advisor) => advisor.id === field.value)?.firstNameTH} ${
															allAdvisor?.find((advisor) => advisor.id === field.value)?.lastNameTH
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
												{allAdvisor
													?.filter((allAdvisor) => allAdvisor.schoolID == form.watch("schoolID"))
													.map((advisor) => (
														<CommandItem
															value={`${advisor.firstNameTH} ${advisor.lastNameTH}`}
															key={advisor.id}
															onSelect={() => {
																form.setValue("advisorID", advisor.id);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	field.value === advisor.id ? "opacity-100" : "opacity-0"
																)}
															/>
															{`${advisor.firstNameTH} ${advisor.lastNameTH}`}
														</CommandItem>
													))}
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</div>
						)}
					/>
				</div>
				<div className="w-full flex ml-auto lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push("/user/superAdmin")}
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
