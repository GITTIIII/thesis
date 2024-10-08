"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IUser } from "@/interface/user";
import { IPrefix } from "@/interface/prefix";
import useSWR, { mutate } from "swr";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IInstitute } from "@/interface/institute";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";

const formSchema = z.object({
	id: z.number(),
	prefixID: z.number(),
	firstNameTH: z.string(),
	lastNameTH: z.string(),
	firstNameEN: z.string(),
	lastNameEN: z.string(),
	email: z.string(),
	phone: z.string(),
	sex: z.string(),
	instituteID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UpdateHeadInstituteDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
	const { data: prefixData } = useSWR<IPrefix[]>(process.env.NEXT_PUBLIC_URL + "/api/prefix", fetcher);
	const { data: instituteData } = useSWR<IInstitute[]>(process.env.NEXT_PUBLIC_URL + "/api/institute", fetcher);

	const [isOpen, isClose] = useState(false);

	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			prefixID: 0,
			firstNameTH: "",
			lastNameTH: "",
			firstNameEN: "",
			lastNameEN: "",
			email: "",
			phone: "",
			sex: "",
			instituteID: 0,
		},
	});

	useEffect(() => {
		form.reset(user);
		form.setValue("firstNameEN", user.firstNameEN || "");
		form.setValue("lastNameEN", user.lastNameEN || "");
	}, [form, user]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/user`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			isClose(false);
			mutate(process.env.NEXT_PUBLIC_URL + "/api/getHeadInstitute");
			toast({
				title: "บันทึกสำเร็จแล้ว",
				description: "ข้อมูลผู้ใช้ถูกแก้ไขเรียบร้อยแล้ว",
				variant: "default",
			});
			form.reset();
			router.refresh();
		} else {
			toast({
				title: "พบข้อผิดพลาด",
				description: res.statusText,
				variant: "destructive",
			});
		}
	}

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={isClose} defaultOpen={isOpen}>
				<DialogTrigger>{children}</DialogTrigger>
				<DialogContent className="sm:max-w-[50dvw] max-h-full">
					<DialogHeader className="pb-2">
						<DialogTitle className="text-xl text-center">แก้ไขข้อมูลนักศึกษา</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="prefixID"
									render={({ field }) => (
										<FormItem className="flex flex-col mt-2">
											<FormLabel>คำนำหน้า</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-[50dwv] justify-between",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value
																? prefixData?.find((prefix) => prefix.id === field.value)?.prefixTH +
																  " / " +
																  prefixData?.find((prefix) => prefix.id === field.value)?.prefixEN
																: "เลือกคำนำหน้า"}
															<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-[50dwv] p-0">
													<Command>
														<CommandInput className="h-9" />
														<CommandList>
															<CommandEmpty>ไม่พบคำนำหน้า</CommandEmpty>
															<CommandGroup>
																{prefixData?.map((prefix) => (
																	<CommandItem
																		value={prefix.prefixTH}
																		key={prefix.id}
																		onSelect={() => {
																			form.setValue("prefixID", prefix.id);
																		}}
																	>
																		{prefix.prefixTH} / {prefix.prefixEN}
																		<CheckIcon
																			className={cn(
																				"ml-auto h-4 w-4",
																				prefix.id === field.value ? "opacity-100" : "opacity-0"
																			)}
																		/>
																	</CommandItem>
																))}
															</CommandGroup>
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
									name="sex"
									render={({ field }) => (
										<FormItem>
											<FormLabel>เพศ / sex</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={user.sex}>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Male">ชาย</SelectItem>
													<SelectItem value="Female">หญิง</SelectItem>
													<SelectItem value="Other">อื่นๆ</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="firstNameTH"
									render={({ field }) => (
										<FormItem>
											<FormLabel>ชื่อ</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastNameTH"
									render={({ field }) => (
										<FormItem>
											<FormLabel>นามสกุล</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="firstNameEN"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
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
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>อีเมล / Email</FormLabel>
											<FormControl>
												<Input type="email" {...field} />
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
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="instituteID"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>สำนักวิชา / institute</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-[50dwv] justify-between",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value
																? instituteData?.find((institute) => institute.id === field.value)
																		?.instituteNameTH
																: "เลือกสำนักวิชา"}
															<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-[50dwv] p-0">
													<Command>
														<CommandInput className="h-9" />
														<CommandList>
															<CommandEmpty>ไม่พบสำนักวิชา</CommandEmpty>
															<CommandGroup>
																{instituteData?.map((institute) => (
																	<CommandItem
																		value={institute.instituteNameTH}
																		key={institute.id}
																		onSelect={() => {
																			form.setValue("instituteID", institute.id);
																		}}
																	>
																		{institute.instituteNameTH}
																		<CheckIcon
																			className={cn(
																				"ml-auto h-4 w-4",
																				institute.id === field.value ? "opacity-100" : "opacity-0"
																			)}
																		/>
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								ยกเลิก
							</Button>
						</DialogClose>
						<Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
							ยืนยัน
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
