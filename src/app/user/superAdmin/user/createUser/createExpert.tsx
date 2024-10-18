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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
	prefix: z.string().min(1, { message: "กรุณาเลือกคำนำหน้า / Please select prefix" }),
	firstName: z.string().min(1, { message: "กรุณากรอกชื่อ / First name requierd" }),
	lastName: z.string().min(1, { message: "กรุณากรอกนามสกุล / Last name requierd" }),
});

export default function CreateExpert() {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prefix: "",
			firstName: "",
			lastName: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
	
		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/expert`,
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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white flex flex-col">
				<div className="w-full 2xl:w-1/2 px-4 mx-auto">
					<FormField
						control={form.control}
						name="prefix"
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
											<SelectItem value="Mr.">Mr.</SelectItem>
											<SelectItem value="Ms.">Ms.</SelectItem>
											<SelectItem value="Miss">Miss</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="firstName"
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
						name="lastName"
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
