"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useSWR, { mutate } from "swr";
import { ISchool } from "@/interface/school";

const formSchema = z.object({
	programNameTH: z.string().min(1, { message: "กรุณากรอกชื่อหลักสูตรภาษาไทย / Thai program name requierd" }),
	programNameEN: z.string().min(1, { message: "กรุณากรอกชื่อหลักสูตรภาษาอังกฤษ / English program name requierd" }),
	programYear: z.string().min(1, { message: "กรุณากรอกปีหลักสูตร / Year requierd" }),
	schools: z.array(z.number()).optional(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateProgram() {
	const { data: schoolData = [] } = useSWR<ISchool[]>(process.env.NEXT_PUBLIC_URL + "/api/school", fetcher);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			programNameTH: "",
			programNameEN: "",
			programYear: "",
			schools: [],
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		console.log(values);
		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/schoolProgram`,
		});

		try {
			const res = await axios.post(url, values);
			if (res.status === 200) {
				mutate(process.env.NEXT_PUBLIC_URL + "/api/schoolProgram");
				toast({
					title: "Success",
					description: "บันทึกสำเร็จแล้ว",
					variant: "default",
				});
				setTimeout(() => {
					form.reset();
					router.refresh();
					router.push("/user/superAdmin/program");
				}, 1000);
			}
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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="p-4 mx-96 my-8 bg-white shadow-md rounded-xl">
				<div className="text-2xl font-medium py-4">เพิ่มหลักสูตร</div>
				<div className="flex flex-col justify-center">
					<FormField
						control={form.control}
						name="programNameTH"
						render={({ field }) => (
							<div>
								<FormLabel htmlFor="programNameTH">
									ชื่อหลักสูตร <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="programNameEN"
						render={({ field }) => (
							<div>
								<FormLabel htmlFor="programNameEN">
									Program Name <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="programYear"
						render={({ field }) => (
							<div>
								<FormLabel htmlFor="programYear">
									ปีหลักสูตร <span className="text-red-500">*</span>
								</FormLabel>
								<Input {...field} />
								<FormMessage />
							</div>
						)}
					/>
				</div>
				<div className="py-4">
					<FormField
						control={form.control}
						name="schools"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-base">ประกอบด้วยสาขาดังนี้</FormLabel>
									<FormDescription>กรุณาเลือกสาขาที่อยู่ในหลักสูตร</FormDescription>
								</div>
								{schoolData.map((school) => (
									<FormField
										key={school.id}
										control={form.control}
										name="schools"
										render={({ field }) => {
											return (
												<FormItem key={school.id} className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															onCheckedChange={(checked) => {
																const newValue = checked
																	? [...field.value, school.id]
																	: field.value.filter((value) => value !== school.id);
																field.onChange(newValue);
															}}
														/>
													</FormControl>
													<FormLabel className="text-sm font-normal">
														{school.schoolNameTH} ({school.schoolNameEN})
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end gap-4 p-4">
					<Button variant="outline" type="reset" onClick={() => router.push("/user/superAdmin/program")} className="">
						ยกเลิก
					</Button>
					<Button disabled={loading} type="submit" className="">
						ยืนยัน
					</Button>
				</div>
			</form>
		</Form>
	);
}
