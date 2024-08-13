"use client";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoFileDirectory, GoPencil, GoUpload } from "react-icons/go";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { Slider } from "@/components/ui/slider";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import React, { useState, useEffect, useRef } from "react";
import signature from "@/../../public/asset/signature.png";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, User } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import SignatureCanvas from "react-signature-canvas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { IPrefix } from "@/interface/prefix";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile() {
	const { data: user, isLoading } = useSWR("/api/getCurrentUser", fetcher);

	return (
		<>
			<div className="w-full h-max flex flex-col justify-center items-center p-10">
				<div className="h-max lg:w-[950px] md:w-[750px] w-[400px]  [&>div]:bg-white [&>div]:border [&>div]:overflow-hidden  [&>div]:rounded-lg [&>div]:shadow-[0px_0px_5px_1px_#e2e8f0] grid md:grid-cols-4 md:grid-rows-9 gap-4">
					<div className="lg:row-span-3 md:col-start-1 md:row-start-1 md:col-span-1 col-start-1 row-span-3  col-span-4  content-center justify-center flex relative p-4">
						<Avatar className="w-[128px] h-max my-auto">
							<AvatarImage src={user?.profileUrl} alt="Profile" />
							<AvatarFallback>
								<User className="w-[128px] h-auto" />
							</AvatarFallback>
						</Avatar>
						<div className=" absolute right-0 top-0">
							<EditProfile user={user} />
						</div>
					</div>
					<div className="md:col-span-3 md:row-span-3 row-start-4 row-span-3  col-span-4 p-8 relative ">
						<label className=" text-xl ">ข้อมูลส่วนตัว</label>
						<div className=" absolute right-0 top-0">
							<EditPersonalInformation user={user} />
						</div>
						<div className="mt-4 md:flex ">
							<section className="flex flex-col sm:w-max gap-4">
								{user?.role.toString() === "STUDENT" && <p>{`รหัสนักศึกษา:  ${user?.username} `}</p>}
								<p>{`ชื่อ - สกุล (ไทย):  ${user?.prefix.prefixTH}${user?.firstNameTH} ${user?.lastNameTH} `}</p>
								<p>{`ชื่อ - สกุล (อังกฤษ):  ${user?.prefix.prefixEN}${user?.firstNameEN ? user?.firstNameEN : ""} ${
									user?.lastNameEN ? user?.lastNameEN : ""
								} `}</p>
								<p>{`เพศ:  ${user?.sex == "Male" ? "ชาย" : "หญิง"} `}</p>
							</section>
							<section className="flex flex-col mt-3 md:mt-0 sm:w-max gap-4 md:ml-8 sm:ml-0">
								<p>{`อีเมล:  ${user?.email} `}</p>
								<p>{`เบอร์โทรศัพท์:  ${user?.phone} `}</p>
							</section>
						</div>
					</div>

					<div className="md:col-span-2 md:row-span-4 md:row-start-4 row-start-7 row-span-5  col-span-4 p-8">
						<div className="w-full flex  justify-between">
							<label className=" text-xl ">ข้อมูลด้านการศึกษา</label>
						</div>
						<section className="mt-4  gap-4 flex  flex-col self-center">
							<p>{`สำนักวิชา: ${user?.institute.instituteNameTH} `}</p>
							<p>{`สาขาวิชา: ${user?.school.schoolNameTH} `}</p>
							{user?.role.toString() == "STUDENT" && (
								<>
									<p>{`หลักสูตร: ${user?.program ? user?.program.programNameTH : ""} ${
										user?.program ? user?.program.programYear : ""
									} `}</p>
									<p>{`ระดับการศึกษา: ${user?.degree.toLowerCase() === "master" ? "ปริญญาโท" : "ปริญญาเอก"} `}</p>
									<p>{`อ.ที่ปรึกษา: ${user?.advisor.prefix.prefixTH} ${user?.advisor.firstNameTH} ${user?.advisor.lastNameTH}`}</p>
								</>
							)}
						</section>
					</div>
					<div className="md:col-span-2 md:row-span-4 md:col-start-3 md:row-start-4 overflow-clip  row-start-12  col-span-4 p-8 relative">
						<label className=" text-xl ">ลายเซ็น</label>
						<div className=" absolute right-0 top-0">
							<EditSignature user={user} />
						</div>
						<div className="w-full h-full flex justify-center items-center">
							<Image
								src={user?.signatureUrl ? user?.signatureUrl : signature}
								width={200}
								height={100}
								style={{
									width: "auto",
									height: "auto",
								}}
								alt="Profile"
							/>
						</div>
					</div>
					{user?.role.toString() === "STUDENT" && (
						<div className="md:col-span-4 md:row-span-4 row-start-4 row-span-3 col-span-4 p-8 relative ">
							<label className=" text-xl ">ทุนการศึกษา</label>
							<div className=" absolute right-0 top-0">
								<EditCertificate user={user} />
							</div>
							<div className="mt-4 flex flex-col">
								<div>
									<label>{`ทุน OROG ${
										user?.degree == "Master"
											? `(ป.โท วารสารระดับชาติ หรือ ประชุมวิชาการระดับนานาชาติ)`
											: `(ป.เอก วารสารระดับนานาชาติ)`
									}`}</label>
								</div>
								<div>
									<label>{`ทุนกิตติบัณฑิต / ทุนวิเทศบัณฑิต ${
										user?.degree == "Master"
											? `(ป.โท ประชุมวิชาการระดับชาติ / นานาชาติ เเละ วารสารระดับชาติ / นานาชาติ)`
											: `(ป.เอก นำเสนอผลงานระดับชาติ / นานาชาติ เเละ วารสารระดับนานาชาติ)`
									}`}</label>
								</div>
								<div>
									<label>{`ทุนศักยภาพ / ทุนเรียนดี / ทุนส่วนตัว ${
										user?.degree == "Master" ? `(ป.โท ประชุมวิชาการระดับชาติ)` : `(ป.เอก วารสารระดับชาติ)`
									}`}</label>
								</div>
								<div>
									<label>{`ทุนอื่นๆ`}</label>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
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

const EditSignature = ({ user }: { user: IUser | undefined }) => {
	const [open, setOpen] = useState(false);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [image, setImage] = useState<string>("");
	const [active, setActive] = useState(1);
	const { toast } = useToast();
	const router = useRouter();
	const { mutate } = useSWRConfig();
	const sigCanvas = useRef<SignatureCanvas>(null);
	const clear = () => {
		if (sigCanvas.current) {
			sigCanvas.current.clear();
		}
	};
	const formSchema = z.object({
		id: z.number(),
		signatureUrl: z.string(),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			signatureUrl: "",
		},
	});

	const handleDrawingSign = () => {
		if (active == 2 && sigCanvas.current?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (active == 2 && sigCanvas.current && !sigCanvas.current.isEmpty()) {
			setImage(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
			setActive(3);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const url = qs.stringifyUrl({
			url: `/api/user`,
		});
		// const aTag = document.createElement("a");
		// aTag.href = values.signatureUrl;
		// aTag.download = "test";
		// aTag.click();
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
			});
		}
	}, [user, reset]);

	const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
			console.log("donee", { croppedImage });
			reset({
				...form.getValues(),
				signatureUrl: croppedImage!,
			});
		} catch (e) {
			console.error(e);
		}
	};
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="link">
					<GoPencil size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-fit max-h-fit rounded-lg">
				<DialogHeader>
					<DialogTitle className=" text-2xl">ลายเซ็น</DialogTitle>
				</DialogHeader>
				<div className="w-[400px] sm:w-[600px] lg:w-[800px]  h-[600px] bg-transparent ">
					<div className="w-full h-full bg-[#ffffff] pb-8 rounded-md">
						<div className="w-full h-fit mt-2 flex">
							<button
								onClick={() => setActive(1)}
								className={`w-full flex justify-center items-center text-sm bg-white-500 border-black  ${
									active === 1 ? "border-x border-t border-b-white text-[#F26522]" : "border-b"
								}`}
							>
								<GoFileDirectory className="hidden md:block" size={30} color={active == 1 ? "#F26522" : "#000"} />
								<label className="ml-1">ลายเซ็นของคุณที่มีในระบบ</label>
							</button>
							<button
								onClick={() => setActive(2)}
								className={`w-full    flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
									active === 2 ? "border-x border-t border-b-white text-[#F26522]" : "border-b"
								}`}
							>
								<GoPencil className="hidden md:block" size={30} color={active === 2 ? "#F26522" : "#000"} />
								<label className="ml-2">วาดลายเซ็นตัวเอง</label>
							</button>
							<button
								onClick={() => setActive(3)}
								className={`w-full    flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
									active === 3 ? "border-x border-t border-b-white text-[#F26522]" : "border-b"
								}`}
							>
								<GoUpload className="hidden md:block" size={30} color={active === 3 ? "#F26522" : "#000"} />
								<label className="ml-2">อัปโหลดรูปภาพ</label>
							</button>
						</div>

						{/* main */}
						<div className="w-full h-full">
							{active == 1 && (
								<div className="w-full h-full p-2">
									<div className="w-auto h-auto flex justify-center border-2 p-4 rounded-md">
										<Image
											src={user?.signatureUrl ? user?.signatureUrl : signature}
											width={100}
											height={100}
											style={{
												width: "auto",
												height: "auto",
											}}
											alt="signature"
										/>
									</div>
								</div>
							)}
							{active == 2 && (
								<div className="w-full h-full py-2 m-auto">
									<Form {...form}>
										<div className="w-full h-full flex justify-center mb-6">
											<form
												onSubmit={form.handleSubmit(onSubmit)}
												className="w-full h-full flex flex-col justify-center border-2 border-dashed border-[#F26522] bg-[#f2642229] relative"
											>
												<div className="w-full h-max flex justify-center mb-2">
													<SignatureCanvas
														ref={sigCanvas}
														backgroundColor="white"
														throttle={8}
														canvasProps={{
															style: {
																width: "400px",
																height: "150px",
															},
														}}
													/>
												</div>
												<div className="w-full flex justify-center">
													<Button
														variant="outline"
														type="button"
														onClick={() => clear()}
														className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
													>
														ล้าง
													</Button>
													<Button
														variant="outline"
														type="button"
														onClick={() => handleDrawingSign()}
														className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
													>
														ต่อไป
													</Button>
												</div>
											</form>
										</div>
									</Form>
								</div>
							)}
							{active == 3 && (
								<div className="w-full h-full py-2">
									<div className="w-full h-full flex flex-col justify-center border-2 border-dashed border-[#F26522] bg-[#f2642229] relative">
										<div className=" block h-full">
											<Cropper
												image={image}
												crop={crop}
												zoom={zoom}
												aspect={5 / 2}
												rotation={rotation}
												onCropChange={setCrop}
												onCropComplete={onCropComplete}
												onZoomChange={setZoom}
												onRotationChange={setRotation}
												// restrictPosition={false}
											/>
										</div>
										<div className=" w-full flex gap-2 px-3 absolute bottom-1 right-0">
											{/* <Button className="  bg-white p-3 rounded-xl"> */}
											<Input
												type="file"
												accept="image/*"
												onChange={handleFileChange}
												className="h-auto text-sm text-grey-500 rounded-xl file:border-0 file:text-md file:w-fit file:h-full file:text-[#F26522] bg-white hover:file:cursor-pointer hover:file:opacity-80"
											/>
											{/* </Button> */}
											<div className=" flex w-full  bg-white p-3 rounded-xl">
												<Label className="mr-4 content-center inline-block text-[#F26522]">Zoom</Label>
												<Slider
													defaultValue={[zoom]}
													value={[zoom]}
													max={3}
													min={1}
													step={0.01}
													className=" w-full "
													onValueChange={(values) => setZoom(values[0])}
												/>
											</div>
											<div className=" w-full  flex bg-white p-3 rounded-xl">
												<Label className="mr-4 content-center inline-block text-[#F26522]">Rotation</Label>
												<Slider
													defaultValue={[rotation]}
													value={[rotation]}
													max={360}
													min={0}
													step={1}
													className=" w-full "
													onValueChange={(values) => setRotation(values[0])}
												/>
											</div>
											<Button
												variant="outline"
												type="button"
												onClick={() => onSubmit(form.getValues())}
												className="bg-[#F26522] w-auto text-lg text-white rounded-xl  border-[#F26522] "
											>
												ยืนยัน
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const EditProfile = ({ user }: { user: IUser | undefined }) => {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [image, setImage] = useState<string>("");
	const [cropImage, setCropImage] = useState<string>("");
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const { mutate } = useSWRConfig();
	const formSchema = z.object({
		id: z.number(),
		profileUrl: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			profileUrl: "",
		},
	});

	const { reset } = form;

	useEffect(() => {
		if (user) {
			reset({
				...form.getValues(),
				id: user.id,
			});
		}
	}, [user, reset]);

	const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
			setCropImage(croppedImage!);
		} catch (e) {}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (cropImage == "") {
			toast({
				title: "Error",
				description: "ไม่พบรูปภาพ",
				variant: "destructive",
			});
			return;
		}
		values.profileUrl = cropImage;
		const url = qs.stringifyUrl({
			url: `/api/user`,
		});
		// const aTag = document.createElement("a");
		// aTag.href = cropImage;
		// aTag.download = "test";
		// aTag.click();
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
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="link">
						<GoPencil size={20} />
					</Button>
				</DialogTrigger>
				<DialogContent className="md:max-w-[500px] md:max-h-max sm:max-w-[425px]  inline rounded-lg">
					<DialogHeader>
						<DialogTitle className=" text-2xl">รูป</DialogTitle>
					</DialogHeader>
					<div className=" relative sm:h-[350px] h-60  mt-3  border">
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={2.5 / 3}
							rotation={rotation}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
							onRotationChange={setRotation}
						/>
					</div>
					<div className=" my-2 flex w-full  bg-white p-3 rounded-md border-1 border">
						<Label className="mr-4 content-center inline-block text-[#F26522]">Zoom</Label>
						<Slider
							defaultValue={[zoom]}
							value={[zoom]}
							max={3}
							min={1}
							step={0.01}
							className=" w-full "
							onValueChange={(values) => setZoom(values[0])}
						/>
					</div>
					<div className=" w-full  flex bg-white p-3 rounded-md border-1 border">
						<Label className="mr-4 content-center inline-block text-[#F26522] ">Rotation</Label>
						<Slider
							defaultValue={[rotation]}
							value={[rotation]}
							max={360}
							min={0}
							step={1}
							className=" w-full "
							onValueChange={(values) => setRotation(values[0])}
						/>
					</div>
					<Input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className=" mt-2 text-sm text-grey-500 rounded-md file:border-0 file:text-md file:w-fit file:h-full file:text-[#F26522] bg-white hover:file:cursor-pointer hover:file:opacity-80"
					/>
					<Button type="submit" className=" mt-2 w-full" onClick={() => onSubmit(form.getValues())}>
						ยืนยัน
					</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};

const EditCertificate = ({ user }: { user: IUser | undefined }) => {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const { mutate } = useSWRConfig();
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);

		const url = qs.stringifyUrl({
			url: `/api/upload`,
		});
		const res = await axios.post(url, formData);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			router.refresh();
			mutate("/api/getCurrentUser");
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
					<Button variant="link">
						<GoPencil size={20} />
					</Button>
				</DialogTrigger>
				<DialogContent className="md:max-w-[500px] md:max-h-max sm:max-w-[425px]  inline rounded-lg">
					<DialogHeader>
						<DialogTitle className=" text-2xl">ไฟล์</DialogTitle>
					</DialogHeader>
					<Input
						type="file"
						onChange={handleFileChange}
						className=" mt-2 text-sm text-grey-500 rounded-md file:border-0 file:text-md file:w-fit file:h-full file:text-[#F26522] bg-white hover:file:cursor-pointer hover:file:opacity-80"
					/>
					<Button disabled={loading} type="submit" className=" mt-2 w-full" onClick={() => handleUpload()}>
						ยืนยัน
					</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};
