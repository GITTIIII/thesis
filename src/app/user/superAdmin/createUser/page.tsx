"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import createUser from "@../../../public/asset/createUser.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CreateUsers from "./creatUsers";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { Form, FormField } from "@/components/ui/form";

const formSchema = z.object({
	prefix: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	username: z.string(),
	password: z.string(),
	email: z.string(),
	phone: z.string(),
	sex: z.string(),
	degree: z.string(),
	institute: z.string(),
	school: z.string(),
	program: z.string(),
	programYear: z.string(),
	position: z.string(),
	role: z.string(),
	formState: z.number(),
	advisorID: z.number(),
});

const CreateUser = () => {
	const [active, setActive] = useState("");
	const [role, setRole] = useState("");
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prefix: "",
			firstName: "",
			lastName: "",
			username: "",
			password: "",
			email: "",
			phone: "",
			sex: "",
			degree: "",
			institute: "",
			school: "",
			program: "",
			programYear: "",
			position: "",
			role: "",
			formState: 0,
			advisorID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);

		const url = qs.stringifyUrl({
			url: `/api/user`,
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
				router.push("/user/superAdmin");
			}, 1000);
		} else {
			toast({
				title: "Error",
				description: res.statusText,
				variant: "destructive",
			});
		}
	};

	
	return (
		<div className="w-full h-full p-12">
			<div className="flex items-center p-4">
				<Image src={createUser} width={100} height={100} alt="createUser" />
				<label className="text-2xl">เพิ่มรายชื่อผู้ใช้</label>
			</div>
			<Tabs defaultValue="student" className="w-full">
				<TabsList className="grid w-1/2 h-16 grid-cols-3">
					<TabsTrigger
						className="h-full text-lg"
						value="student"
						onClick={() => setActive("student")}
					>
						นักศึกษา
					</TabsTrigger>
					<TabsTrigger
						className="h-full text-lg"
						value="studentExcel"
						onClick={() => setActive("studentExcel")}
					>
						นักศึกษาด้วย Excel
					</TabsTrigger>
					<TabsTrigger
						className="h-full text-lg"
						value="admin"
						onClick={() => setActive("admin")}
					>
						อาจารย์/กรรมการ
					</TabsTrigger>
				</TabsList>
				<TabsContent value="student">
					<Card>
						<CardHeader>
							<CardTitle>นักศึกษา</CardTitle>
						</CardHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full h-full bg-white p-4 "
							>
								<CardContent className="space-y-2 grid grid-cols-2">
									{/* เเถวซ้าย */}
									<div className="w-1/2 p-4 mx-auto">
										<FormField
											control={form.control}
											name="prefix"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="prefix">คำนำหน้า / Prefix</Label>
													<Select
														onValueChange={(value) => field.onChange(value)}
														value={field.value}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="คำนำหน้า" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectItem value="นาย">นาย</SelectItem>
																<SelectItem value="นาง">นาง</SelectItem>
																<SelectItem value="นางสาว">นางสาว</SelectItem>
																<SelectItem value="Mr.">Mr.</SelectItem>
																<SelectItem value="Ms.">Ms.</SelectItem>
																<SelectItem value="Miss">Miss</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="firstName">ชื่อ / First name</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="lastName">นามสกุล / Last name</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="username"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="username">
														รหัสนักศึกษา / Student ID
													</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="password">รหัสผ่าน / Password</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="email">อีเมล / Email</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="phone">เบอร์โทร / Phone number</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="sex"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="sex">เพศ / Sex</Label>
													<Select
														onValueChange={(value) => field.onChange(value)}
														value={field.value}
													>
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
												</div>
											)}
										/>
									</div>
									{/* เเถวขวา */}
									<div className="w-1/2 p-4 mx-auto">
										<FormField
											control={form.control}
											name="degree"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="degree">ระดับการศึกษา / Degree</Label>
													<Select
														onValueChange={(value) => field.onChange(value)}
														value={field.value}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="ระดับการศึกษา" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectItem value="Master">ปริญญาโท</SelectItem>
																<SelectItem value="Doctoral">
																	ปริญญาเอก
																</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="institute"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="institute">
														สำนักวิชา / Institute
													</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="school"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="school">สาขาวิชา / School</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="program"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="program">หลักสูตร / Program</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="programYear"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="programYear">
														ปีหลักสูตร (พ.ศ.) / Program Year (C.E.)
													</Label>
													<Input {...field} />
												</div>
											)}
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button>ยืนยัน</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</TabsContent>
				<TabsContent value="admin">
					<Card>
						<CardHeader>
							<CardTitle>อาจารย์/กรรมการ</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full h-full bg-white p-4 "
							>
								<CardContent className="space-y-2 grid grid-cols-2">
									{/* เเถวซ้าย */}
									<div className="w-1/2 p-4 mx-auto">
										<FormField
											control={form.control}
											name="prefix"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="prefix">คำนำหน้า / Prefix</Label>
													<Select
														onValueChange={(value) => field.onChange(value)}
														value={field.value}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="คำนำหน้า" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectItem value="นาย">นาย</SelectItem>
																<SelectItem value="นาง">นาง</SelectItem>
																<SelectItem value="นางสาว">นางสาว</SelectItem>
																<SelectItem value="Mr.">Mr.</SelectItem>
																<SelectItem value="Ms.">Ms.</SelectItem>
																<SelectItem value="Miss">Miss</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="firstName">ชื่อ / First name</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="lastName">นามสกุล / Last name</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="username"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="username">
														ชื่อผู้ใช้ / Username
													</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="password">รหัสผ่าน / Password</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="email">อีเมล / Email</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="phone">เบอร์โทร / Phone number</Label>
													<Input {...field} />
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="sex"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="sex">เพศ / Sex</Label>
													<Select
														onValueChange={(value) => field.onChange(value)}
														value={field.value}
													>
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
												</div>
											)}
										/>
									</div>
									{/* เเถวขวา */}
									<div className="w-1/2 p-4 mx-auto">
										<FormField
											control={form.control}
											name="role"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="role">บทบาท / Role</Label>
													<Select
														onValueChange={(value) => {
															field.onChange(value);
															setRole(value);
														}}
														value={field.value}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="บทบาท" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectItem value="ADMIN">อาจารย์</SelectItem>
																<SelectItem value="COMMITTEE">
																	กรรมการ
																</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
												</div>
											)}
										/>
										<FormField
											control={form.control}
											name="position"
											render={({ field }) => (
												<div className="space-y-1 mb-2">
													<Label htmlFor="position">ตำเเหน่ง / Position</Label>
													<Select
														onValueChange={(value) => field.onChange(value)}
														value={field.value}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="ตำเเหน่ง" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																{role == "ADMIN" && (
																	<>
																		<SelectItem value="ADVISOR">
																			อาจารย์ที่ปรึกษา
																		</SelectItem>
																		<SelectItem value="HEAD_INSTITUTE">
																			หัวหน้าสาขา
																		</SelectItem>
																	</>
																)}
																{role == "COMMITTEE" && (
																	<>
																		<SelectItem value="COMMITTEE_OUTLINE">
																			กรรมการสอบโครงร่างวิทยานิพนธ์
																		</SelectItem>
																		<SelectItem value="COMMITTEE_INSTITUTE">
																			กรรมการประจำสำนักวิขา
																		</SelectItem>
																		<SelectItem value="COMMITTEE_EXAMING">
																			กรรมการสอบวิทยานิพนธ์
																		</SelectItem>
																	</>
																)}
															</SelectGroup>
														</SelectContent>
													</Select>
												</div>
											)}
										/>
										{role == "ADMIN" && (
											<>
												<FormField
													control={form.control}
													name="institute"
													render={({ field }) => (
														<div className="space-y-1 mb-2">
															<Label htmlFor="institute">
																สำนักวิชา / Institute
															</Label>
															<Input {...field} />
														</div>
													)}
												/>
												<FormField
													control={form.control}
													name="school"
													render={({ field }) => (
														<div className="space-y-1 mb-2">
															<Label htmlFor="school">สาขาวิชา / School</Label>
															<Input {...field} />
														</div>
													)}
												/>
											</>
										)}
									</div>
								</CardContent>
								<CardFooter>
									<Button>ยืนยัน</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</TabsContent>
				<TabsContent value="studentExcel">
					<Card>
						<CardHeader>
							<CardTitle>นักศึกษา</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
						<CardContent>
							<CreateUsers />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default CreateUser;
