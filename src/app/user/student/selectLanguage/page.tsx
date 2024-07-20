"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";

import { Button } from "@/components/ui/button";

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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	id: z.number(),
	formLanguage: z.string().min(1, { message: "กรุณาเลือกภาษา / Please select language" }),
	firstNameEN: z.string(),
	lastNameEN: z.string(),
});

async function getCurrentUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

export default function SelectLanguage() {
	const [user, setUser] = useState<IUser>();
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			formLanguage: "",
			firstNameEN: "",
			lastNameEN: "",
		},
	});

	const { reset } = form;

	useEffect(() => {
		async function fetchData() {
			const data = await getCurrentUser();
			setUser(data);
			reset({
				...form.getValues(),
				id: data.id,
			});
		}
		fetchData();
	}, []);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		console.log(values);
		const url = qs.stringifyUrl({
			url: `/api/user`,
		});

		try {
			const res = await axios.patch(url, values);
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			setTimeout(() => {
				form.reset();
				router.refresh();
				router.push("/user/student");
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
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full h-full flex flex-col justify-center items-center"
			>
				<FormField
					control={form.control}
					name="formLanguage"
					render={({ field }) => (
						<div className="flex flex-col items-center space-y-1 mb-2">
							<FormLabel htmlFor="prefix">
								ภาษา / Language <span className="text-red-500">*</span>
							</FormLabel>
							<Select onValueChange={(value) => field.onChange(value)} value={field.value}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="เลือกภาษา" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="th">ภาษาไทย</SelectItem>
										<SelectItem value="en">English</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</div>
					)}
				/>
				{form.watch("formLanguage") == "en" && (
					<>
						<FormField
							control={form.control}
							name="firstNameEN"
							render={({ field }) => (
								<div className="flex flex-col items-center space-y-1 mb-2">
									<FormLabel htmlFor="prefix">
										First name <span className="text-red-500">*</span>
									</FormLabel>
									<Input {...field} />
									<FormMessage />
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="lastNameEN"
							render={({ field }) => (
								<div className="flex flex-col items-center space-y-1 mb-2">
									<FormLabel htmlFor="prefix">
										Last name <span className="text-red-500">*</span>
									</FormLabel>
									<Input {...field} />
									<FormMessage />
								</div>
							)}
						/>
					</>
				)}

				<Button
					disabled={loading}
					variant="outline"
					type="submit"
					className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
				>
					ยืนยัน
				</Button>
			</form>
		</Form>
	);
}
