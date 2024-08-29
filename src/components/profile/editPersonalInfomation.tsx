"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { GoPencil } from "react-icons/go";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { IPrefix } from "@/interface/prefix";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EditPersonalInformation = ({ user }: { user: IUser | undefined }) => {
	const { toast } = useToast();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { mutate } = useSWRConfig();
	const { data: prefix, isLoading } = useSWR("/api/prefix", fetcher);
	const formSchema = z.object({
		id: z.number(),
		prefixID: z.number(),
		username: z.string(),
		firstNameTH: z.string(),
		lastNameTH: z.string(),
		firstNameEN: z.string(),
		lastNameEN: z.string(),
		sex: z.string(),
		email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
		phone: z
			.string()
			.length(10, { message: "เบอร์โทรศัพท์ต้องมี 10 หลัก" })
			.regex(/^\d+$/, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น" }),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			prefixID: 0,
			username: "",
			firstNameTH: "",
			lastNameTH: "",
			firstNameEN: "",
			lastNameEN: "",
			sex: "",
			email: "",
			phone: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const url = qs.stringifyUrl({
			url: `/api/user`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			form.reset();
			router.refresh();
			mutate("/api/getCurrentUser");
			setOpen(false);
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
		if (user) {
			reset({
				...form.getValues(),
				id: user.id,
				prefixID: user.prefixID,
				username: user.username,
				firstNameTH: user.firstNameTH,
				lastNameTH: user.lastNameTH,
				firstNameEN: user.firstNameEN,
				lastNameEN: user.lastNameEN,
				sex: user.sex,
				email: user.email,
				phone: user.phone,
			});
		}
	}, [form, reset, user]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="link">
					<GoPencil size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent className="md:max-w-[800px] h-max overflow-auto rounded-lg">
				<DialogHeader>
					<DialogTitle className=" text-2xl">แก้ไขข้อมูลส่วนตัว</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>รหัสนักศึกษา</FormLabel>
									<FormControl>
										<Input {...field} disabled />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-between md:flex-row flex-col">
							<FormField
								control={form.control}
								name="prefixID"
								render={({ field }) => (
									<FormItem className="md:w-2/5">
										<FormLabel>คำนำหน้าชื่อ (ไทย)</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
													>
														{field.value
															? `${prefix?.find((prefix: IPrefix) => prefix.id === field.value)?.prefixTH} `
															: "เลือกคำนำหน้า"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="ค้นหาคำนำหน้า" />
													<CommandList>
														<CommandEmpty>ไม่พบคำนำหน้า</CommandEmpty>
														{prefix?.map((prefix: IPrefix) => (
															<CommandItem
																value={`${prefix.prefixTH}`}
																key={prefix.id}
																onSelect={() => {
																	form.setValue("prefixID", prefix.id);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === prefix.id ? "opacity-100" : "opacity-0"
																	)}
																/>
																{prefix.prefixTH}
															</CommandItem>
														))}
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="firstNameTH"
								render={({ field }) => (
									<FormItem className=" md:w-52">
										<FormLabel>ชื่อ</FormLabel>
										<FormControl>
											<Input {...field} disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastNameTH"
								render={({ field }) => (
									<FormItem className=" md:w-52">
										<FormLabel>นามสกุล</FormLabel>
										<FormControl>
											<Input {...field} disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-between  md:flex-row flex-col">
							<FormField
								control={form.control}
								name="prefixID"
								render={({ field }) => (
									<FormItem className="md:w-2/5">
										<FormLabel>คำนำหน้าชื่อ (อังกฤษ)</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
													>
														{field.value
															? `${prefix?.find((prefix: IPrefix) => prefix.id === field.value)?.prefixEN} `
															: "เลือกคำนำหน้า"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="ค้นหาคำนำหน้า" />
													<CommandList>
														<CommandEmpty>ไม่พบคำนำหน้า</CommandEmpty>
														{prefix?.map((prefix: IPrefix) => (
															<CommandItem
																value={`${prefix.prefixEN}`}
																key={prefix.id}
																onSelect={() => {
																	form.setValue("prefixID", prefix.id);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === prefix.id ? "opacity-100" : "opacity-0"
																	)}
																/>
																{prefix.prefixEN}
															</CommandItem>
														))}
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="firstNameEN"
								render={({ field }) => (
									<FormItem className=" md:w-52">
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastNameEN"
								render={({ field }) => (
									<FormItem className=" md:w-52">
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="sex"
							render={({ field }) => (
								<FormItem className=" md:w-52">
									<FormLabel>เพศ</FormLabel>
									<FormControl>
										<Select onValueChange={(value) => field.onChange(value)} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="เพศ" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="Male">ชาย</SelectItem>
													<SelectItem value="Female">หญิง</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>อีเมล</FormLabel>
									<FormControl>
										<Input placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>เบอร์โทรศัพท์</FormLabel>
									<FormControl>
										<Input placeholder="Phone number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className=" mt-4">
							<Button disabled={form.formState.isSubmitting} type="submit">
								ยืนยัน
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditPersonalInformation;
