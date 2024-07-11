import { z } from "zod";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import signature from "@/../../public/asset/signature.png";
import folderOrange from "@../../../public/asset/folderOrange.png";
import folderBlack from "@../../../public/asset/folderBlack.png";
import penOrange from "@../../../public/asset/penOrange.png";
import penBlack from "@../../../public/asset/penBlack.png";
import uploadOrange from "@../../../public/asset/uploadOrange.png";
import uploadBlack from "@../../../public/asset/uploadBlack.png";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import SignatureCanvas from "react-signature-canvas";

type User = {
	id: number;
	signatureUrl: string;
};

const formSchema = z.object({
	id: z.number(),
	signatureUrl: z.string(),
});

export default function Signature() {
	const [active, setActive] = useState(1);
	const [user, setUser] = useState<User | null>(null);
	const { toast } = useToast();
	const router = useRouter();

	const sigCanvas = useRef<SignatureCanvas>(null);
	const clear = () => {
		if (sigCanvas.current) {
			sigCanvas.current.clear();
		}
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			signatureUrl: "",
		},
	});

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				reset({
					...form.getValues(),
					signatureUrl: base64String,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrawingSign = () => {
		if (active == 2 && sigCanvas.current?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (
			active == 2 &&
			sigCanvas.current &&
			!sigCanvas.current.isEmpty()
		) {
			reset({
				...form.getValues(),
				signatureUrl: sigCanvas.current
					.getTrimmedCanvas()
					.toDataURL("image/png"),
			});
		}
		onSubmit(form.getValues());
	};

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
			setTimeout(() => {
				setActive(1);
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
		if (user) {
			reset({
				...form.getValues(),
				id: user.id,
			});
		}
	}, [user, reset]);

	const getUser = async () => {
		const res = await fetch("/api/getCurrentUser");
		const data = await res.json();
		setUser(data);
	};

	useEffect(() => {
		getUser();
	}, [active]);

	return (
		<>
			<div className="w-full h-full bg-transparent py-10 md:py-12 px-2 lg:px-28">
				<div className="w-full h-full bg-[#ffffff] p-8 rounded-md">
					{/* head */}
					<div className="w-full flex items-center">
						<Image src={signature} width={50} height={50} alt="signature" />
						<label className="ml-4 font-bold text-2xl">ลายเซ็น</label>
					</div>
					{/* menu */}
					<div className="w-full h-max mt-2 flex">
						<button
							onClick={() => setActive(1)}
							className={`w-full 2xl:w-1/5 flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
								active === 1
									? "border-x border-t border-b-white text-[#F26522]"
									: "border-b"
							}`}
						>
							<Image
								src={active === 1 ? folderOrange : folderBlack}
								className="w-8 h-8 md:w-16 md:h-16"
								alt="signature"
							/>
							<label className="ml-2">ลายเซ็นของคุณ</label>
						</button>
						<button
							onClick={() => setActive(2)}
							className={`w-full 2xl:w-1/5 flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
								active === 2
									? "border-x border-t border-b-white text-[#F26522]"
									: "border-b"
							}`}
						>
							<Image
								src={active === 2 ? penOrange : penBlack}
								className="w-8 h-8 md:w-16 md:h-16"
								alt="pen"
							/>
							<label className="ml-2">วาดลายเซ็นตัวเอง</label>
						</button>
						<button
							onClick={() => setActive(3)}
							className={`w-full 2xl:w-1/5 flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
								active === 3
									? "border-x border-t border-b-white text-[#F26522]"
									: "border-b"
							}`}
						>
							<Image
								src={active === 3 ? uploadOrange : uploadBlack}
								className="w-8 h-8 md:w-16 md:h-16"
								alt="upload"
							/>
							<label className="ml-2">อัปโหลดรูปภาพ</label>
						</button>
						<div className="bg-white-500 border-b border-black w-0  2xl:w-1/5 py-4"></div>
						<div className="bg-white-500 border-b border-black w-0  2xl:w-1/5 py-4"></div>
					</div>

					{/* main */}
					<div className="w-full h-full">
						{active == 1 && (
							<div className="w-full h-full grid sm:grid-cols-3 2xl:grid-cols-5 gap-2 p-2">
								<div className="w-max h-max flex justify-center border-2 p-4 rounded-md">
									<Image
										src={user?.signatureUrl ? user?.signatureUrl : signature}
										width={200}
										height={200}
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
											className="w-full h-max flex flex-col justify-center border-2 border-dashed border-[#F26522] bg-[#f2642229] py-32"
										>
											<div className="w-full h-max flex justify-center mb-6">
												<SignatureCanvas
													ref={sigCanvas}
													backgroundColor="white"
													throttle={8}
													canvasProps={{
														width: 200,
														height: 200,
														className: "sigCanvas",
													}}
												/>
											</div>
											<div className="w-full h-full flex justify-center">
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
													ยืนยัน
												</Button>
											</div>
										</form>
									</div>
								</Form>
							</div>
						)}
						{active == 3 && (
							<div className="w-full h-max 2xl:h-full py-2">
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="w-full h-max flex flex-col justify-center bg-[#f2642229] border-2 border-dashed border-[#F26522] py-48"
									>
										<div className="flex flex-col justify-center md:flex-row">
											<div className="w-full sm:2/4">
												<FormField
													control={form.control}
													name="signatureUrl"
													render={({ field }) => (
														<div className="flex flex-row items-center mb-6 justify-center">
															<FormItem className="w-auto">
																<FormLabel>เลือกไฟล์</FormLabel>
																<FormControl>
																	<Input
																		type="file"
																		className="text-sm p-2 w-60 rounded-lg"
																		onChange={handleImageChange}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														</div>
													)}
												/>
											</div>
										</div>
										<div className="w-full flex justify-center">
											<Button
												variant="outline"
												type="submit"
												className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
											>
												ยืนยัน
											</Button>
										</div>
									</form>
								</Form>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
