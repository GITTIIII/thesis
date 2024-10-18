"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Textarea } from "@/components/ui/textarea";
import uploadBlack from "@../../../public/asset/uploadBlack.png";
import uploadOrange from "@../../../public/asset/uploadOrange.png";
import Image from "next/image";
import pdfIcon from "@/../../public/asset/pdf.png";
import pngIcon from "@/../../public/asset/png.png";
import jpgIcon from "@/../../public/asset/jpg.png";
import { X } from "lucide-react";

const EditCertificate = ({ user, certificateType }: { user: IUser | undefined; certificateType: string }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [fileName, setFileName] = useState("No selected File");
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const { mutate } = useSWRConfig();
	const router = useRouter();

	const formSchema = z.object({
		file: z
			.instanceof(File)
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				message: "ไฟล์ต้องมีขนาดไม่เกิน 5MB.",
			})
			.refine((file) => ["image/png", "image/jpeg", "application/pdf"].includes(file.type), {
				message: "ประเภทไฟล์ต้องเป็น PNG, JPEG, เเละ PDF เท่านั้น",
			}),
		certificateType: z.string(),
		description: z.string(),
		id: z.number(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			description: "",
			certificateType: "",
			file: undefined as unknown as File,
		},
	});

	const { reset } = form;

	useEffect(() => {
		if (user) {
			reset({
				...form.getValues(),
				id: user.id,
				certificateType: certificateType,
			});
		}
	}, [user, reset, certificateType, form]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!values.file) return;
		setLoading(true);

		const formData = new FormData();
		formData.append("file", values.file);
		formData.append("certificateType", values.certificateType);
		formData.append("description", values.description);
		formData.append("id", values.id.toString());

		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/certificate`,
		});
		const res = await axios.post(url, formData);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			router.refresh();
			form.reset();
			setFileName("No selected File");
			mutate(process.env.NEXT_PUBLIC_URL + "/api/getCurrentUser");
			setOpen(false);
			setLoading(false);
		} else {
			toast({
				title: "Error",
				description: res.statusText,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" className="h-max w-full my-2">
						<Image
							src={uploadBlack}
							width={24}
							height={24}
							
							alt="jpeg"
						/>
						<label className="ml-2">คลิกเพื่ออัปโหลดไฟล์</label>
					</Button>
				</DialogTrigger>
				<DialogContent className="w-[500px] inline rounded-lg">
					<DialogHeader>
						<DialogTitle className="text-2xl">อัปโหลดไฟล์ / Upload File</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="file"
								render={({ field }) => (
									<FormItem
										onClick={() => document.querySelector<HTMLInputElement>(".input-field")?.click()}
										className="h-[300px] w-full flex flex-col justify-center items-center border-2 border-dashed border-[#F26522] cursor-pointer rounded-xl hover:bg-accent"
									>
										<Image src={uploadOrange} width={64} height={64} alt="jpeg" />
										<label>เลือกไฟล์ / Browse File</label>
										<FormControl>
											<Input
												type="file"
												className="hidden input-field"
												onChange={(e) => {
													const files = e.target.files;
													if (files && files.length > 0) {
														field.onChange(files[0]);
														setFileName(files[0].name);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full flex mt-2 items-center">
								{form.getValues("file") && (
									<div>
										{form.getValues("file").type === "image/jpeg" && (
											<Image
												src={jpgIcon}
												width={32}
												height={32}
												
												alt="jpeg"
											/>
										)}
										{form.getValues("file").type === "application/pdf" && (
											<Image
												src={pdfIcon}
												width={32}
												height={32}
												
												alt="pdf"
											/>
										)}
										{form.getValues("file").type === "image/png" && (
											<Image
												src={pngIcon}
												width={32}
												height={32}
												
												alt="png"
											/>
										)}
									</div>
								)}
								<label className="ml-2 text-sm">{fileName}</label>
								{form.getValues("file") && (
									<X
										className="ml-auto hover:cursor-pointer hover:text-[#F26522]"
										onClick={() => {
											setFileName("No selected File");
											form.reset();
										}}
									/>
								)}
							</div>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												className="mt-2 resize-none"
												placeholder="รายละเอียด..."
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button disabled={loading} type="submit" className="mt-2 w-full">
								ยืนยัน
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditCertificate;
