import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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

const formSchema = z.object({
	date: z.string(),
	thesisNameTH: z.string(),
	thesisNameEN: z.string(),
	studentID: z.number(),
	advisorID: z.number(),
	coAdvisorID: z.number(),
});

const OutlineFormCreate = () => {
	const router = useRouter();
	const [user, setUser] = useState<IUser | null>(null);
	const [allAdvisor, setAllAdvisor] = useState<IUser[] | null>(null);

	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: "",
			thesisNameTH: "",
			thesisNameEN: "",
			studentID: 0,
			advisorID: 0,
			coAdvisorID: 0,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		if (!user?.signatureUrl) {
			toast({
				title: "Error",
				description: "ไม่พบลายเซ็น",
				variant: "destructive",
			});
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

	useEffect(() => {
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => setUser(data));
		fetch("/api/getAdvisor")
			.then((res) => res.json())
			.then((data) => setAllAdvisor(data));
	}, []);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full h-full bg-white p-4"
			>
				<div className="flex flex-col justify-center md:flex-row">
					{/* ฝั่งซ้าย */}
					<div className="w-full sm:2/4">
					<div className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</div>
						<InputForm
							value={`${user?.firstName} ${user?.lastName}`}
							label="ชื่อ-นามสกุล / Fullname"
						/>
						<InputForm
							value={`${user?.username} `}
							label="รหัสนักศึกษา / StudentID"
						/>

						<div className="flex flex-col items-center mb-6 justify-center">
							<FormLabel className="font-normal">
								ระดับการศึกษา / Education Level
							</FormLabel>
							<RadioGroup className="space-y-1 mt-2">
								<div>
									<RadioGroupItem
										checked={user?.educationLevel === "Master"}
										value="Master"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาโท (Master Degree)
									</FormLabel>
								</div>
								<div>
									<RadioGroupItem
										checked={user?.educationLevel === "Doctoral"}
										value="Doctoral"
									/>
									<FormLabel className="ml-2 font-normal">
										ปริญญาเอก (Doctoral Degree)
									</FormLabel>
								</div>
							</RadioGroup>
						</div>

						<InputForm value={`${user?.school}`} label="สำนักวิชา / School" />
						<InputForm value={`${user?.program}`} label="หลักสูตร / Program" />
						<InputForm
							value={`${user?.programYear}`}
							label="ปีหลักสูตร / Program Year"
						/>
					</div>

					{/* ฝั่งขวา */}
					<div className="w-full sm:2/4">
						<div className="text-center font-semibold mb-2">ชื่อโครงร่างวิทยานิพนธ์</div>
						<FormField
							control={form.control}
							name="thesisNameTH"
							render={({ field }) => (
								<div className="flex flex-row items-center mb-6 justify-center">
									<FormItem className="w-auto">
										<Label>ชื่อภาษาไทย / ThesisName(TH)</Label>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
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
									<FormItem className="w-auto">
										<FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
										<FormControl>
											<Input
												className="text-sm p-2 w-60 m-auto  rounded-lg"
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
									<FormItem className="w-auto">
										<FormLabel>อาจารย์ที่ปรึกษา / Thesis Advisor</FormLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(parseInt(value, 10))
											}
										>
											<FormControl>
												<SelectTrigger className="text-sm p-2 w-60 m-auto  rounded-lg">
													<SelectValue
														placeholder="อาจารย์ที่ปรึกษา"
														defaultValue=""
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{allAdvisor?.map((advisor) => (
													<SelectItem
														key={advisor.id}
														value={String(advisor.id)}
													>{`${advisor.firstName} ${advisor.lastName}`}</SelectItem>
												))}
											</SelectContent>
										</Select>
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
									<FormItem className="w-auto">
										<FormLabel>
											อาจารย์ที่ปรึกษาร่วม(ถ้ามี) / Co-Thesis Advisor (if any)
										</FormLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(parseInt(value, 10))
											}
										>
											<FormControl>
												<SelectTrigger className="text-sm p-2 w-60 m-auto  rounded-lg">
													<SelectValue
														placeholder="อาจารย์ที่ปรึกษาร่วม"
														defaultValue=""
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={String(0)}>
													ไม่มีอาจารย์ที่ปรึกษาร่วม
												</SelectItem>
												{allAdvisor?.map((advisor) => (
													<SelectItem
														key={advisor.id}
														value={String(advisor.id)}
													>{`${advisor.firstName} ${advisor.lastName}`}</SelectItem>
												))}
											</SelectContent>
										</Select>
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

				<div className="w-full flex px-20 lg:flex justify-center">
					<Button
						variant="outline"
						type="reset"
						onClick={() => router.push(`/user/table`)}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
					>
						ยกเลิก
					</Button>
					<Button
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
